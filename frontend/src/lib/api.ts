interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
}

interface User {
  firstName: string
  lastName: string
  email: string
}

class ApiService {
  private baseUrl = "/api/v1"

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }

    return response.json()
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Registration failed")
    }

    return response.json()
  }

  async getUser(accessToken: string): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user")
    }

    return response.json()
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/refresh-tokens`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    })

    if (!response.ok) {
      throw new Error("Failed to refresh tokens")
    }

    return response.json()
  }
}

export const apiService = new ApiService() 