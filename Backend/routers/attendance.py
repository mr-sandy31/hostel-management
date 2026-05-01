from fastapi import APIRouter, HTTPException
from Database.database import student_collection
from datetime import datetime
import pytz

router = APIRouter(prefix="/attendance")


# ✅ Get Last Status
@router.get("/status/{email}")
def get_status(email: str):
    student = student_collection.find_one({"email": email})

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attendance = student.get("attendance", [])

    if not attendance:
        return {"last_status": None}

    return {"last_status": attendance[-1]["status"]}


# ✅ Mark Attendance
@router.post("/mark")
def mark_attendance(data: dict):

    email = data.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Missing email")

    student = student_collection.find_one({"email": email})

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attendance = student.get("attendance", [])

    # toggle logic
    if not attendance:
        status = "entry"
    else:
        last = attendance[-1]["status"]
        status = "exit" if last == "entry" else "entry"

    # time
    ist = pytz.timezone("Asia/Kolkata")
    now = datetime.now(ist)

    student_collection.update_one(
        {"_id": student["_id"]},
        {
            "$push": {
                "attendance": {
                    "name": student["name"],
                    "email": student["email"],
                    "status": status,
                    "date": now.strftime("%Y-%m-%d"),
                    "time": now.strftime("%H:%M:%S"),
                }
            }
        }
    )

    return {
        "message": f"{status.upper()} marked",
        "status": status,
        "name": student["name"]
    }