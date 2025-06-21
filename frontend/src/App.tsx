import { AuthProvider, useAuth } from "@/context/auth-context"
import LoginPage from "@/pages/login-page"
import SignupPage from "@/pages/signup-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Welcome to the application, {user?.firstName} {user?.lastName}!
            </CardTitle>
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Email: {user?.email}</p>
            <p className="mt-4">You are successfully authenticated!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AuthenticatedApp() {
  const { isAuthenticated, isLoading, currentPage, navigateTo } = useAuth()
  console.log({isAuthenticated, isLoading, currentPage})
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading...
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return <Dashboard />
  }

  // Show signup page
  if (currentPage === "signup") {
    return (
      <div>
        <SignupPage />
        <div className="fixed bottom-4 right-4">
          <Button variant="ghost" onClick={() => navigateTo("login")}>
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  // Show login page (default)
  return (
    <div>
      <LoginPage />
      <div className="fixed bottom-4 right-4">
        <Button variant="ghost" onClick={() => navigateTo("signup")}>
          Create Account
        </Button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  )
}