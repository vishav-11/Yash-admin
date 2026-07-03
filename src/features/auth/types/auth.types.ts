export interface AuthAdmin {
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── API ka actual response shape ──────────────────────────────────────────────
export interface LoginApiResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AuthAdmin;        // ← "user" nahi, "admin" hai
}

// ── Hamare app ke andar jo store hoga ────────────────────────────────────────
export interface LoginResponse {
  admin: AuthAdmin;
  token: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}