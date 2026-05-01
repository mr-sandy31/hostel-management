import API from "./client";
import type { AxiosResponse } from "axios";

/* =========================
   COMMON TYPES
========================= */

type ApiList<T> = {
  data?: T[];
  students?: T[];
  visitors?: T[];
  complaints?: T[];
  requests?: T[];
};

type ApiSingle<T> = {
  data?: T;
};

/* =========================
   ATTENDANCE
========================= */

export const getStatus = (email: string) =>
  API.get(`/attendance/status/${email}`);

export const markAttendance = (data: any) =>
  API.post(`/attendance/mark`, data);

export const getAttendanceHistory = (email: string) =>
  API.get(`/attendance/history/${email}`);

export const getAllAttendance = () =>
  API.get("/warden/attendance");

/* =========================
   PROFILE
========================= */

export const getProfile = (email: string) =>
  API.get(`/profile/${email}`);

/* =========================
   REQUEST
========================= */

export const createRequest = (data: any) =>
  API.post("/request", data);

export const getRequests = (email: string) =>
  API.get(`/request/${email}`);

export const getAllRequests = () =>
  API.get("/warden/requests");

export const updateRequestStatus = (data: any) =>
  API.put("/warden/request/update", data);

/* =========================
   STUDENTS
========================= */

export const getStudentsList = () =>
  API.get("/warden/students");

export const getStudents = () =>
  API.get("/warden/students"); // keep single source

export const updateStudentStatus = (data: any) =>
  API.put("/warden/student/update", data);

export const deleteStudent = (email: string) =>
  API.delete(`/warden/student/delete/${email}`);

/* =========================
   SIGN
========================= */

export const getSign = () =>
  API.get("/admin/sign");

export const uploadSign = (formData: FormData) =>
  API.post("/admin/upload-sign", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const deleteSign = () =>
  API.delete("/admin/sign");

/* =========================
   VISITOR
========================= */

export const createVisitor = (data: any) =>
  API.post("/visitor", data);

export const getVisitors = (email: string) =>
  API.get(`/visitor/${email}`);

export const getAllVisitors = () =>
  API.get("/warden/visitors");

export const updateVisitor = (data: any) =>
  API.put("/warden/visitor/update", data);

/* =========================
   COMPLAINT
========================= */

export const createComplaint = (data: any) =>
  API.post("/complaint", data);

export const getComplaints = (email: string) =>
  API.get(`/complaint/${email}`);

export const getAllComplaints = () =>
  API.get("/warden/complaints");

export const updateComplaint = (data: any) =>
  API.put("/warden/complaint/update", data);

/* =========================
   PAYMENT
========================= */

export const sendPayment = (data: any) =>
  API.post("/warden/payment", data);

export const getPayment = (email: string) =>
  API.get(`/payment/${email}`);

/* =========================
   LEAVE
========================= */

export const createLeave = (data: any) =>
  API.post("/leave", data);

export const getAllLeaves = () =>
  API.get("/warden/leaves");

export const updateLeave = (data: any) =>
  API.put("/warden/leave/update", data);

export const getLeaves = (from?: string, to?: string) =>
  API.get("/warden/leaves", {
    params: { from_date: from, to_date: to }
  });

/* =========================
   ROOM
========================= */

export const createRoom = (data: any) =>
  API.post("/warden/room", data);

export const getRooms = () =>
  API.get("/rooms");

export const bookRoom = (data: any) =>
  API.post("/room/book", data);

export const getRoomRequests = () =>
  API.get("/warden/room-requests");

export const updateRoom = (data: any) =>
  API.put("/warden/room/update", data);

export const deleteRoom = (id: string) =>
  API.delete(`/warden/room/delete/${id}`);