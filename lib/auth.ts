"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "analyst" | "viewer"
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for hackathon
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@airwatch.com": {
    password: "admin123",
    user: {
      id: "1",
      email: "admin@airwatch.com",
      name: "Admin User",
      role: "admin",
      permissions: ["view_all", "edit_all", "export_data", "manage_users", "system_config"],
    },
  },
  "analyst@airwatch.com": {
    password: "analyst123",
    user: {
      id: "2",
      email: "analyst@airwatch.com",
      name: "Data Analyst",
      role: "analyst",
      permissions: ["view_all", "export_data", "create_reports"],
    },
  },
  "viewer@airwatch.com": {
    password: "viewer123",
    user: {
      id: "3",
      email: "viewer@airwatch.com",
      name: "Public Viewer",
      role: "viewer",
      permissions: ["view_public"],
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("airwatch_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("airwatch_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const demoUser = DEMO_USERS[email]
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user)
      localStorage.setItem("airwatch_user", JSON.stringify(demoUser.user))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("airwatch_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false
  return user.permissions.includes(permission) || user.role === "admin"
}
