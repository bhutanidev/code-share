"use client"
import { httpAxios } from "@/lib/axios-config";
import useUserStore from "@/store/store";
import { Button } from "@workspace/ui/components/button";
import { LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter()
  const {setEmail,setId,setName,setAuthentication} = useUserStore((state) => state)
  const handleLogout = async() => {
    // This would typically connect to your authentication system
    try {
        const response = await httpAxios.post('/api/logout')
        toast('Logged out successfully');
        setEmail(null)
        setId(null)
        setName(null)
        setAuthentication(false)
        router.push('/')
        console.log('User logged out');
        // Here you would add your actual logout logic, such as:
        // - Clear auth tokens from localStorage
        // - Call your logout API endpoint
        // - Redirect to login page
    } catch (error) {
        console.log("logout error",error);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleLogout}
      className="flex items-center gap-1"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  );
}