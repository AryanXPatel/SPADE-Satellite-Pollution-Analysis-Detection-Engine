"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, hasPermission } from "@/lib/auth";
import {
  Home,
  Database,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Package,
  X,
  Menu,
} from "lucide-react";
import { BulkExportDialog } from "./bulk-export-dialog";

export function Navigation() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      permission: "read",
    },
    {
      href: "/verification",
      label: "API Verification",
      icon: Database,
      permission: "read",
    },
    {
      href: "/performance",
      label: "Model Performance",
      icon: BarChart3,
      permission: "read",
    },
    {
      href: "/explorer",
      label: "Data Explorer",
      icon: Database,
      permission: "read",
    },
    {
      href: "/forecast",
      label: "Forecast & Alerts",
      icon: TrendingUp,
      permission: "read",
    },
    {
      href: "/admin",
      label: "Admin Panel",
      icon: Settings,
      permission: "admin",
    },
  ].filter((item) => hasPermission(user, item.permission));

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="grad1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
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
            <div>
              <span className="font-bold text-xl text-gray-800">SPADE</span>
            </div>
            {user && (
              <Badge variant="secondary" className="ml-2">
                {user.role}
              </Badge>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Bulk Export */}
            {hasPermission(user, "export") && (
              <BulkExportDialog>
                <Button variant="ghost" size="icon" title="Bulk Export">
                  <Package className="h-5 w-5" />
                </Button>
              </BulkExportDialog>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout ({user?.name})</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
