"use client"

import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"

export default function LoginButton({text,variant}:{text:String,variant?:"outline"|null}){
    const router = useRouter()
    return(
    <Button size="lg" className={variant ? "": "bg-primary hover:bg-primary/90"} variant={variant} onClick={()=>router.push(`/${text.toLocaleLowerCase()}`)}>
        {text}
    </Button>
    )
}