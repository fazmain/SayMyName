"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, CreditCard, Globe, Mic } from "lucide-react";

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="bg-blue-50/50 backdrop-blur-md shadow-lg border border-white/20 rounded-xl">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/logo.png"
                  alt="Say My Name Logo"
                  width={60}
                  height={60}
                  className="w-10 h-10"
                />
                <span className="text-lg text-gray-700">
                  Saymyname
                </span>
              </Link>

              {/* Navigation Items */}
              <div className="flex items-center space-x-4">
                <Link href="/gallery">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Globe className="h-4 w-4 mr-2" />
                    Gallery
                  </Button>
                </Link>

                {user ? (
                  <div className="flex items-center space-x-5">
                    <Link href="/create">
                      <Button size="sm">
                        <Mic className="h-4 w-4 mr-2" />
                        Create
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || ""} />
                            <AvatarFallback className="bg-blue-700 text-white">
                              {user.displayName?.[0]?.toUpperCase() ||
                                user.email?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                      >
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium">
                              {user.displayName || "User"}
                            </p>
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            My Name Cards
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="cursor-pointer"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth?mode=signup">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
