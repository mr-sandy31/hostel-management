from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import pytz, uuid, os
from PIL import Image

from schemas.schemas import StudentRegister, StudentLogin
from Auth.auth import register_student, login_student
from Database.database import student_collection
from Database.database import room_collection
from uuid import uuid4

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- STATIC ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ---------------- HELPERS ----------------
def get_time():
    now = datetime.now(pytz.timezone("Asia/Kolkata"))
    return now.strftime("%Y-%m-%d"), now.strftime("%H:%M:%S")

def success(data=None, message="Success"):
    return {"success": True, "message": message, "data": data}

def error(msg="Error", code=400):
    raise HTTPException(status_code=code, detail=msg)

def get_student(email: str):
    student = student_collection.find_one({"email": email})
    if not student:
        error("User not found", 404)
    return student

def create_entry(email, field, payload):
    student = get_student(email)
    student_collection.update_one(
        {"_id": student["_id"]},
        {"$push": {field: payload}}
    )

def update_nested(email, field, item_id, updates):
    student = get_student(email)
    items = student.get(field, [])

    updated = False
    for item in items:
        if item.get("id") == item_id:
            item.update(updates)
            updated = True
            break

    if not updated:
        error("Item not found", 404)

    student_collection.update_one(
        {"_id": student["_id"]},
        {"$set": {field: items}}
    )

# ---------------- AUTH ----------------
@app.post("/register")
def register(student: StudentRegister):
    return register_student(student)

@app.post("/login")
def login(student: StudentLogin):
    return login_student(student)

# ---------------- PROFILE ----------------
@app.get("/profile/{email}")
def get_profile(email: str):
    user = student_collection.find_one({"email": email}, {"_id": 0})
    if not user:
        error("User not found", 404)
    return success(user)

# ---------------- ATTENDANCE ----------------
@app.post("/attendance/mark")
def mark_attendance(data: dict):
    student = get_student(data.get("email"))

    attendance = student.get("attendance", [])
    status = "entry" if not attendance else (
        "exit" if attendance[-1]["status"] == "entry" else "entry"
    )

    date, time = get_time()

    create_entry(data.get("email"), "attendance", {
        "name": student["name"],
        "email": data.get("email"),
        "status": status,
        "date": date,
        "time": time
    })

    return success({"status": status}, f"{status} marked")

@app.get("/attendance/history/{email}")
def history(email: str):
    student = get_student(email)
    return success(list(reversed(student.get("attendance", []))))

# ---------------- REQUEST ----------------
@app.post("/request")
def create_request(data: dict):
    date, time = get_time()

    req = {
        "id": str(uuid.uuid4()),
        "type": data.get("type"),
        "description": data.get("description"),
        "status": "Pending",
        "date": date,
        "time": time
    }

    create_entry(data.get("email"), "requests", req)
    return success(message="Request submitted")

@app.get("/request/{email}")
def get_requests(email: str):
    student = get_student(email)
    return success(list(reversed(student.get("requests", []))))

@app.get("/warden/requests")
def all_requests():
    data = []
    for s in student_collection.find({}):
        for r in s.get("requests", []):
            data.append({**r, "name": s["name"], "email": s["email"]})

    return success(list(reversed(data)))

@app.put("/warden/request/update")
def update_request(data: dict):
    update_nested(
        data.get("email"),
        "requests",
        data.get("id"),
        {"status": data.get("status")}
    )
    return success(message="Request updated")

# ---------------- STUDENTS ----------------
@app.get("/warden/students")
def get_students():
    students = list(student_collection.find({}, {"_id": 0}))
    return success(students)

@app.put("/warden/student/update")
def update_student(data: dict):
    student_collection.update_one(
        {"email": data.get("email")},
        {"$set": {"status": data.get("status")}}
    )
    return success(message="Updated")

@app.delete("/warden/student/delete/{email}")
def delete_student(email: str):
    res = student_collection.delete_one({"email": email})
    if res.deleted_count == 0:
        error("Student not found", 404)
    return success(message="Deleted")

# ---------------- SIGNATURE ----------------
@app.post("/admin/upload-sign")
def upload_sign(file: UploadFile = File(...)):
    try:
        path = f"{UPLOAD_DIR}/sign.png"
        image = Image.open(file.file)
        image = image.resize((300, 150))
        image.save(path)
        return success(message="Signature uploaded")
    except Exception as e:
        error(str(e))

@app.get("/admin/sign")
def get_sign(request: Request):
    path = f"{UPLOAD_DIR}/sign.png"
    base = str(request.base_url)
    return success({"url": f"{base}uploads/sign.png"} if os.path.exists(path) else None)

@app.delete("/admin/sign")
def delete_sign():
    path = f"{UPLOAD_DIR}/sign.png"
    if os.path.exists(path):
        os.remove(path)
    return success(message="Deleted")

# ---------------- VISITOR ----------------
@app.post("/visitor")
def create_visitor(data: dict):
    date, time = get_time()

    visitor = {
        "id": str(uuid.uuid4()),
        "name": data.get("name"),
        "relation": data.get("relation"),
        "status": "Pending",
        "date": date,
        "time": time
    }

    create_entry(data.get("email"), "visitors", visitor)
    return success(message="Visitor added")

@app.get("/visitor/{email}")
def get_visitors(email: str):
    student = get_student(email)
    return success(list(reversed(student.get("visitors", []))))

@app.get("/warden/visitors")
def all_visitors():
    data = []
    for s in student_collection.find({}):
        for v in s.get("visitors", []):
            data.append({**v, "student": s["name"], "email": s["email"]})
    return success(list(reversed(data)))

@app.put("/warden/visitor/update")
def update_visitor(data: dict):
    update_nested(
        data.get("email"),
        "visitors",
        data.get("id"),
        {"status": data.get("status")}
    )
    return success(message="Visitor updated")

# ---------------- COMPLAINT ----------------
@app.post("/complaint")
def create_complaint(data: dict):
    date, time = get_time()

    complaint = {
        "id": str(uuid.uuid4()),
        "text": data.get("text"),
        "status": "Pending",
        "remark": "",
        "date": date,
        "time": time
    }

    create_entry(data.get("email"), "complaints", complaint)
    return success(message="Complaint submitted")

@app.get("/complaint/{email}")
def get_complaints(email: str):
    student = get_student(email)
    return success(list(reversed(student.get("complaints", []))))

@app.get("/warden/complaints")
def all_complaints():
    data = []
    for s in student_collection.find({}):
        for c in s.get("complaints", []):
            data.append({**c, "student": s["name"], "email": s["email"]})
    return success(list(reversed(data)))

@app.put("/warden/complaint/update")
def update_complaint(data: dict):
    update_nested(
        data.get("email"),
        "complaints",
        data.get("id"),
        {
            "status": data.get("status"),
            "remark": data.get("remark")
        }
    )
    return success(message="Complaint updated")

@app.get("/warden/attendance")
def get_all_attendance():
    data = []

    students = student_collection.find({})

    for s in students:
        for a in s.get("attendance", []):
            data.append({
                "name": s["name"],
                "email": s["email"],
                "date": a["date"],
                "time": a["time"],
                "status": a["status"]  # entry / exit
            })

    return {"data": list(reversed(data))}


@app.post("/warden/payment")
def send_payment(data: dict):
    student_collection.update_one(
        {"email": data["email"]},
        {
            "$set": {
                "payment": {
                    "amount": data["amount"],
                    "status": "pending"
                }
            }
        }
    )

    return {"message": "Payment request sent"}


@app.get("/payment/{email}")
def get_payment(email: str):
    user = student_collection.find_one({"email": email})

    if not user:
        return {"data": {}}

    return {
        "data": user.get("payment", {})
    }
    
@app.get("/attendance/status/{email}")
def get_status(email: str):
    print("EMAIL:", email)  # debug

    student = student_collection.find_one({"email": email})

    if not student:
        return {"last_status": None}

    attendance = student.get("attendance", [])

    return {
        "last_status": attendance[-1]["status"] if attendance else None
    }

from uuid import uuid4

@app.post("/leave")
def create_leave(data: dict):
    try:
        leave_data = {
            "id": str(uuid4()),
            "name": data.get("name", ""),
            "from": data.get("from", ""),
            "to": data.get("to", ""),
            "status": "Pending"
        }

        result = student_collection.update_one(
            {"email": data.get("email")},
            {"$push": {"leaves": leave_data}}
        )

        if result.matched_count == 0:
            return {"error": "Student not found"}

        return {"message": "Leave applied"}

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}


@app.get("/warden/leaves")
def get_leaves(from_date: str = None, to_date: str = None):
    students = list(student_collection.find({}, {"_id": 0}))
    leaves = []

    for s in students:
        for l in s.get("leaves", []):
            l["student"] = s.get("name", "")
            l["email"] = s.get("email", "")
            leaves.append(l)

    # 🔥 DATE FILTER
    if from_date and to_date:
        def parse(d):
            return datetime.strptime(d, "%d-%m-%Y")

        leaves = [
            l for l in leaves
            if parse(from_date) <= parse(l["from"]) <= parse(to_date)
        ]

    return {"data": leaves}


@app.put("/warden/leave/update")
def update_leave(data: dict):
    student_collection.update_one(
        {"email": data["email"], "leaves.id": data["id"]},
        {"$set": {"leaves.$.status": data["status"]}}
    )
    return success(message="Updated")

from uuid import uuid4

# 🏠 CREATE ROOM
@app.post("/warden/room")
def create_room(data: dict):
    room = {
        "id": str(uuid4()),
        "room_no": data["room_no"],
        "capacity": data["capacity"],
        "occupied": 0
    }
    room_collection.insert_one(room)
    return {"message": "Room created"}


# 📥 GET ROOMS
@app.get("/rooms")
def get_rooms():
    rooms = list(room_collection.find({}, {"_id": 0}))
    return {"data": rooms}


# 🛏 BOOK ROOM
@app.post("/room/book")
def book_room(data: dict):
    student_collection.update_one(
        {"email": data["email"]},
        {
            "$set": {
                "room_request": {
                    "room_id": data["room_id"],
                    "status": "Pending"
                }
            }
        }
    )
    return {"message": "Request sent"}


# 🧑‍💼 WARDEN VIEW REQUESTS
@app.get("/warden/room-requests")
def get_room_requests():
    students = list(student_collection.find({}, {"_id": 0}))
    requests = []

    for s in students:
        if s.get("room_request"):
            req = s["room_request"]
            req["student"] = s["name"]
            req["email"] = s["email"]
            requests.append(req)

    return {"data": requests}


# ✅ APPROVE / REJECT
@app.put("/warden/room/update")
def update_room(data: dict):
    student_collection.update_one(
        {"email": data["email"]},
        {
            "$set": {
                "room_request.status": data["status"],
                "room_id": data["room_id"] if data["status"] == "Approved" else None
            }
        }
    )
    return {"message": "Updated"}

@app.delete("/warden/room/delete/{room_id}")
def delete_room(room_id: str):
    room_collection.delete_one({"id": room_id})
    return {"message": "Room deleted"}