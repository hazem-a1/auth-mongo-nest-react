import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiService } from "@/lib/api"

interface User {
  firstName: string
  lastName: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  refreshToken: () => Promise<void>
  navigateTo: (page: "login" | "signup" | "dashboard") => void
  currentPage: "login" | "signup" | "dashboard"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<"login" | "signup" | "dashboard">("login")
  
  // Store tokens in memory
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const isAuthenticated = !!user

  const login = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    fetchUser()
    setCurrentPage("dashboard")
  }

  const logout = () => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
    setCurrentPage("login")
  }

  const navigateTo = (page: "login" | "signup" | "dashboard") => {
    setCurrentPage(page)
  }

  const fetchUser = async () => {
    if (!accessToken) {
      setIsLoading(false)
      return
    }

    try {
      const users = await apiService.getUser(accessToken)
      if (users.length > 0) {
        setUser(users[0]) // Assuming the first user is the current user
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTokens = async () => {
    if (!refreshToken) return

    try {
      const data = await apiService.refreshTokens(refreshToken)
      setAccessToken(data.accessToken)
      setRefreshToken(data.refresh_token)
    } catch (error) {
      console.error("Failed to refresh tokens:", error)
      logout()
    }
  }

  useEffect(() => {
    fetchUser()
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken: refreshTokens,
        navigateTo,
        currentPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
