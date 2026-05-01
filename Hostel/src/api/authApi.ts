import API from "./client";
import type { AxiosResponse } from "axios";

/* =========================
   TYPES
========================= */

export interface RegisterUserRequest {
  name: string;
  mobile: string;
  email: string;
  branch: string;
  year: string;
  prn: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface StudentType {
  id?: string;
  name?: string;
  mobile?: string;
  email?: string;
}

export interface ProfileType {
  name?: string;
  email?: string;
  mobile?: string;
  branch?: string;
  year?: string;
}

export interface AttendanceRequest {
  name: string;
  email: string;
  status: "entry" | "exit";
}

export interface StatusResponse {
  last_status: "entry" | "exit" | null;
}

/* =========================
   AUTH
========================= */

export const loginUser = (data: LoginCredentials) =>
  API.post("/login", data);

export const registerUser = (data: RegisterUserRequest) =>
  API.post("/register", data);

/* =========================
   STUDENTS
========================= */

export const getStudents = async (): Promise<AxiosResponse<{ data: StudentType[] }>> => {
  return API.get("/students");
};

/* =========================
   PROFILE
========================= */

export const getProfile = async (
  email: string
): Promise<AxiosResponse<{ data: ProfileType }>> => {
  return API.get(`/profile/${email}`);
};

/* =========================
   ATTENDANCE
========================= */

export const getStatus = async (
  email: string
): Promise<AxiosResponse<StatusResponse>> => {
  return API.get(`/attendance/status/${email}`);
};

export const markAttendance = async (
  data: AttendanceRequest
): Promise<AxiosResponse> => {
  return API.post("/attendance/mark", data);
};