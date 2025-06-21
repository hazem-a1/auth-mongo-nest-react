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

export function validatePassword(password: string, confirmPassword?: string): string | null {
  if (password.length < 6) {
    return "Password must be at least 6 characters long"
  }
  
  if (confirmPassword && password !== confirmPassword) {
    return "Passwords do not match"
  }
  
  return null
} 