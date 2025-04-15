"use client"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { FormEvent, useRef } from "react"
import { CreateUserSchema } from "@workspace/common/zodschema"
import { httpAxios } from "@/lib/axios-config"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        const name = nameRef.current?.value
        const email = emailRef.current?.value
        const password = passwordRef.current?.value

        const zodData = CreateUserSchema.safeParse({name,email,password})

        if(zodData.error){
            const errors = JSON.parse(zodData.error.message)
            toast(errors[0].message)
            return
        }

        try {
          const response = await httpAxios.post("/api/signup",{email,password,name})
          router.push('/home')
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message;
          if (errorMessage) {
            toast(errorMessage);
          } else {
            console.error("Unexpected error:", error);
          }
        }

    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Enter your email , password and name below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e)=>handleSubmit(e)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  ref={emailRef}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="name">Name</Label>
                </div>
                <Input id="name" type="text" required ref={nameRef} />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required ref={passwordRef} />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Signup
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
