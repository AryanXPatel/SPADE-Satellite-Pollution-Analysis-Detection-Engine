"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
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

// Demo users for testing
const DEMO_USERS: Record<string, User> = {
  "admin@airwatch.com": {
    id: "admin-1",
    email: "admin@airwatch.com", 
    name: "Admin User",
    role: "admin",
    permissions: ["read", "write", "admin", "export", "model-train"]
  },
  "analyst@airwatch.com": {
    id: "analyst-1",
    email: "analyst@airwatch.com",
    name: "Data Analyst", 
    role: "analyst",
    permissions: ["read", "write", "export"]
  },
  "viewer@airwatch.com": {
    id: "viewer-1",
    email: "viewer@airwatch.com",
    name: "Public Viewer",
    role: "viewer", 
    permissions: ["read"]
  }
}

const DEMO_PASSWORDS: Record<string, string> = {
  "admin@airwatch.com": "admin123",
  "analyst@airwatch.com": "analyst123", 
  "viewer@airwatch.com": "viewer123"
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("spade-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("spade-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = DEMO_USERS[email]
    const validPassword = DEMO_PASSWORDS[email]
    
    if (user && password === validPassword) {
      setUser(user)
      localStorage.setItem("spade-user", JSON.stringify(user))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("spade-user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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

export function hasPermission(user: User | null, permission: string): boolean {
  return user?.permissions.includes(permission) ?? false
}