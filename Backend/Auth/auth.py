from Database.database import student_collection
from fastapi import HTTPException

# REGISTER
def register_student(student):
    existing = student_collection.find_one({"email": student.email})
    if existing:
        return {"error": "Email already exists"}

    student_collection.insert_one({
        "name": student.name,
        "mobile": student.mobile,
        "email": student.email,
        "branch": student.branch,
        "year": student.year,
        "prn": student.prn,
        "password": student.password,
        "father_name": student.father_name,   
        "blood_group": student.blood_group, 
        "status": "pending",
        "role": "student"   # 🔥 default role
    })

    return {
        "message": "Signup successful. Please contact admin for approval."
    }

# LOGIN
def login_student(student):
    db_user = student_collection.find_one({"email": student.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # approval check
    if db_user.get("status") != "approved":
        raise HTTPException(status_code=403, detail="Account not approved")

    # password check
    if db_user.get("password") != student.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    # 🔥 FINAL RESPONSE FIX
    return {
        "message": "Login successful",
        "name": db_user["name"],
        "email": db_user["email"],
        "role": db_user.get("role", "student")   # ✅ IMPORTANT
    }