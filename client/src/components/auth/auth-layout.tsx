import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 px-4 py-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full -translate-y-24 translate-x-24 animate-float-1"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-400/20 to-blue-500/20 rounded-full translate-y-20 -translate-x-20 animate-float-2"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-tl from-pink-400/20 to-yellow-500/20 rounded-full -translate-x-16 -translate-y-16 animate-float-3"></div>

      <Card className="w-full max-w-md glass-card rounded-2xl relative z-10 floating-element">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            {title}
          </CardTitle>
          <p className="text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
