from pydantic import BaseModel, EmailStr

class StudentRegister(BaseModel):
    name: str
    mobile: str
    email: EmailStr
    branch: str
    year: str
    prn: str
    password: str
    father_name: str      
    blood_group: str 
    
class StudentLogin(BaseModel):
    email: EmailStr
    password: str


# ✅ Attendance schema (ADD THIS)
class AttendanceCreate(BaseModel):
    name: str
    email: EmailStr
    status: str