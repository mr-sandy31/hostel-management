# Implement LoginScreen API Integration

## Backend Status
- [ ] No /login endpoint exists
- [ ] No password field in student model  
- [ ] Need auth logic (hashing, status check)

## Frontend Progress
- [x] Add loginUser to authApi.ts
- [x] Update LoginScreen.tsx → API call + navigation
- [ ] AsyncStorage for auth token
- [ ] Role-based navigation (student/warden/admin)

## Priority: Frontend First (mock backend response)
**Assuming backend /login returns:** `{success: true, role: "student", status: "approved", token?}`
