"use client"
import React from 'react';
import { LogIn } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import {toast} from "sonner"
import { useRouter } from 'next/navigation';
export default function SafetyPage() {
  const router = useRouter()
  const handleLoginRedirect = () => {
    toast("Taking you to the login page!")
    router.push('/login')
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Oops! Who Goes There?</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Looks like we need to know who you are first!
          </p>
          
          <div className="py-4">
            <span className="text-4xl">🔒</span>
          </div>
          
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleLoginRedirect}
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}