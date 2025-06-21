import { useState, useCallback } from "react"

interface UseFormState<T> {
  values: T
  isLoading: boolean
  error: string
  setValues: (values: Partial<T>) => void
  setError: (error: string) => void
  reset: () => void
}

export function useFormState<T>(initialValues: T): UseFormState<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const updateValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setError("")
    setIsLoading(false)
  }, [initialValues])

  return {
    values,
    isLoading,
    error,
    setValues: updateValues,
    setError,
    reset,
  }
}

export function useAsyncOperation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | undefined> => {
    setIsLoading(true)
    setError("")

    try {
      const result = await operation()
      console.log("result", result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed"
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    setError,
    execute,
  }
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address"
  }
  return null
}

export function validateName(name: string): string | null {
  if (name.length < 3) {
    return "Name must be at least 3 characters long"
  }
  return null
}

export function validatePassword(password: string, confirmPassword?: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long"
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one letter"
  }
  
  if (!/\d/.test(password)) {
    return "Password must contain at least one number"
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character"
  }
  
  if (confirmPassword && password !== confirmPassword) {
    return "Passwords do not match"
  }
  
  return null
} 