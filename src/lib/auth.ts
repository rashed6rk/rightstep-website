const API_BASE = '/api';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client';
};

type LoginResponse = {
  success: boolean;
  otpId: number;
  email: string;
  emailSent: boolean;
};

type VerifyResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};

type SignupResponse = {
  success: boolean;
  otpId: number;
  email: string;
  emailSent: boolean;
};

type ApiError = { error: string };

async function apiCall<T>(endpoint: string, body?: Record<string, unknown>): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).error || `Request failed (${res.status})`);
  }

  return data as T;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiCall('/auth/login.php', { email, password });
}

export async function verifyOTP(otpId: number, code: string, email: string): Promise<VerifyResponse> {
  const res = await apiCall<VerifyResponse>('/auth/verify-otp.php', { otpId, code, email });
  if (res.token) {
    setToken(res.token);
    setUser(res.user);
  }
  return res;
}

export async function signup(name: string, email: string, password: string): Promise<SignupResponse> {
  return apiCall('/auth/signup.php', { name, email, password });
}

export async function forgotPassword(email: string): Promise<{ success: boolean }> {
  return apiCall('/auth/forgot.php', { email });
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean }> {
  return apiCall('/auth/reset-password.php', { email, code, newPassword });
}

export async function resendOTP(email: string, purpose: 'login' | 'signup' | 'reset'): Promise<{ otpId: number }> {
  return apiCall('/auth/resend-otp.php', { email, purpose });
}

export async function getMe(): Promise<{ user: AuthUser }> {
  return apiCall('/auth/me.php');
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rs_token');
}

function setToken(token: string) {
  localStorage.setItem('rs_token', token);
}

function setUser(user: AuthUser) {
  localStorage.setItem('rs_user', JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('rs_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem('rs_token');
  localStorage.removeItem('rs_user');
}
