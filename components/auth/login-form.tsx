"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  const demoAccounts = [
    {
      email: "admin@airwatch.com",
      password: "admin123",
      role: "Admin",
      color: "bg-red-100 text-red-800",
    },
    {
      email: "analyst@airwatch.com",
      password: "analyst123",
      role: "Analyst",
      color: "bg-blue-100 text-blue-800",
    },
    {
      email: "viewer@airwatch.com",
      password: "viewer123",
      role: "Viewer",
      color: "bg-green-100 text-green-800",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto">
            <svg
              width="64"
              height="64"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
              <path
                d="M100 40 Q 140 60, 100 120 Q 60 60, 100 40 Z"
                fill="white"
                opacity="0.9"
              />
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.7"
                strokeDasharray="5,5"
              />
              <circle cx="100" cy="100" r="25" fill="#10b981" opacity="0.8" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SPADE</h1>
          <p className="text-gray-600">Air Quality Monitoring System</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>
              Use these accounts to explore different user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={account.color}>{account.role}</Badge>
                  </div>
                  <p className="text-sm font-medium">{account.email}</p>
                  <p className="text-xs text-gray-600">
                    Password: {account.password}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                >
                  Use
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Built for ISRO SPADE Hackathon 2025</p>
          <p className="text-xs mt-1">
            Advanced Satellite-based Air Quality Monitoring
          </p>
        </div>
      </div>
    </div>
  );
}
