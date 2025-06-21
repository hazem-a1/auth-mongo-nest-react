import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useFormState, useAsyncOperation } from "@/lib/hooks"
import { apiService } from "@/lib/api"

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const { login, navigateTo } = useAuth()
  const { values, isLoading, error, setValues, setError } = useFormState<LoginForm>({
    email: "",
    password: "",
  })
  const { execute } = useAsyncOperation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await execute(
      async () => apiService.login(values),
      (data) => login(data.accessToken, data.refresh_token),
      (err) => setError(err.message)
    )
  }

  const handleGoogleLogin = () => {
    window.location.href = "/api/v1/auth/google"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@hello.world"
                value={values.email}
                onChange={(e) => setValues({ email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={(e) => setValues({ password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-black"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              Continue with Google
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {"Don't have an account? "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => navigateTo("signup")}
              >
                Sign up
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}