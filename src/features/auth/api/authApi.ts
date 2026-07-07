import { apiClient } from '@/api/client'

export interface SignupRequest {
  email: string
  password: string
}

export interface SignupResponse {
  id: number
  email: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export const authApi = {
  signup: (input: SignupRequest) =>
    apiClient.post<SignupResponse>('/auth/signup', input).then((res) => res.data),

  login: (input: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', input).then((res) => res.data),
}
