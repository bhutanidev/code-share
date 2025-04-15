// "use client"
// import React, { HTMLInputTypeAttribute, useRef } from 'react';
// import { Code, ArrowRight, Users, Plus } from 'lucide-react';
// import { Button } from '@workspace/ui/components/button'; 
// import { Input } from '@workspace/ui/components/input';
// import { ModeToggle } from '@/components/mode-toggle';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
// import { useRouter } from 'next/navigation';
// import { httpAxios } from '@/lib/axios-config';
// import { CreateRoomSchema } from '@workspace/common/zodschema';
// import { toast } from 'sonner';

// const HomePage =  ()=>{

//   const joinRef = useRef<HTMLInputElement>(null)
//   const createRef = useRef<HTMLInputElement>(null)
//   const router = useRouter()

//   const handleJoin = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
//     e.preventDefault()
//     const slug = joinRef.current?.value
//     const zodData = CreateRoomSchema.safeParse({slug})
//     if(zodData.error){
//       const errors = JSON.parse(zodData.error.message)
//       toast(errors[0].message)
//       return
//     }
//     //check if room exists
//     //fetch real id of the slug from backend
//     try {
//       console.log("handle join",slug)
//       const {data} = await httpAxios.post("/api/joinroom",{slug})
//       console.log("response from joinroom",data);
      
//       router.push('/home')
//       const roomID  = data.data?.roomId
//       console.log(roomID)
//       if(!roomID){
//         toast("something went wrong")
//         return
//       }
//       router.push(`/room/${roomID}`)
//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message;
//       if (errorMessage) {
//         toast.error(errorMessage);
//       } else {
//         console.error("Unexpected error:", error);
//       }
//     }
//   }
//   const handleCreate = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
//     e.preventDefault()
//     const slug = createRef.current?.value
//     //check if room created or not
//     //fetch real id of the slug from backend
//     const zodData = CreateRoomSchema.safeParse({slug})
//     if(zodData.error){
//       const errors = JSON.parse(zodData.error.message)
//       toast(errors[0].message)
//       return
//     }
//     //check if room exists
//     //fetch real id of the slug from backend
//     try {
//       console.log("handle create", slug);
//       const {data} = await httpAxios.post("/api/createroom",{slug})
//       console.log("response from create",data);

//       router.push('/home')
//       const roomID  = data.data?.id
//       console.log(roomID)
//       if(!roomID){
//         toast("something went wrong")
//         return
//       }
//       router.push(`/room/${roomID}`)
//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message;
//       if (errorMessage) {
//         toast.error(errorMessage);
//       } else {
//         console.error("Unexpected error:", error);
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground flex flex-col">
//       {/* Header/Navbar */}
//       <header className="border-b border-border">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <Code className="h-6 w-6 text-primary" />
//             <h1 className="text-xl font-bold">CodeShare</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <ModeToggle />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row gap-8 items-center">
//         {/* Left side - Join/Create Forms */}
//         <div className="w-full md:w-1/2 space-y-6">
//           <div className="space-y-2">
//             <h2 className="text-4xl font-bold">Code together in real-time</h2>
//             <p className="text-xl text-muted-foreground">
//               Connect, collaborate, and code from anywhere with CodeShare
//             </p>
//           </div>

//           <Tabs defaultValue="join" className="w-full max-w-md">
//             <TabsList className="grid grid-cols-2 mb-4">
//               <TabsTrigger value="join">Join Room</TabsTrigger>
//               <TabsTrigger value="create">Create Room</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="join" className="space-y-4">
//               <div className="flex flex-col gap-4">
//                 <div className="flex gap-2">
//                   <Input 
//                     placeholder="Enter a room code" 
//                     className="flex-1"
//                     id='join-room'
//                     ref={joinRef}
//                   />
//                   <Button onClick={(e)=>handleJoin(e)}>
//                     Join
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Enter a room code to join an existing collaborative session
//                 </p>
//               </div>
//             </TabsContent>
            
//             <TabsContent value="create" className="space-y-4">
//               <div className="flex flex-col gap-4">
//                 <div className="flex gap-2">
//                   <Input 
//                     placeholder="Enter a room name" 
//                     className="flex-1"
//                     id='crate-room'
//                     ref={createRef}
//                   />
//                   <Button onClick={(e)=>handleCreate(e)}>
//                     Create
//                     <Plus className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Create a new room and invite others to collaborate
//                 </p>
//               </div>
//             </TabsContent>
//           </Tabs>

//         </div>

//         {/* Right side - Illustration */}
//         <div className="w-full md:w-1/2 flex justify-center">
//           <div className="relative w-full max-w-lg aspect-square rounded-full bg-primary/10 flex items-center justify-center">
//             <div className="absolute w-4/5 h-4/5 rounded-full bg-primary/5 flex items-center justify-center">
//               <div className="relative">
//                 {/* Code Editor Preview */}
//                 <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden w-64 md:w-80">
//                   <div className="bg-muted p-2 flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-full bg-destructive"></div>
//                     <div className="w-3 h-3 rounded-full bg-warning"></div>
//                     <div className="w-3 h-3 rounded-full bg-success"></div>
//                     <div className="flex-1 text-xs px-2">collaborative-room.js</div>
//                   </div>
//                   <div className="p-3 font-mono text-xs overflow-x-auto bg-background/95">
//                     <pre className="text-left">
//                       <code className="text-foreground">
//                         <span className="text-blue-500">const</span> room = <span className="text-blue-500">new</span> <span className="text-yellow-500">CollabRoom</span>();{'\n'}
//                         <span className="text-blue-500">const</span> doc = room.<span className="text-yellow-500">getDocument</span>();{'\n'}
//                         <span className="text-blue-500">const</span> users = room.<span className="text-yellow-500">getUsers</span>();{'\n\n'}
//                         room.<span className="text-yellow-500">onUpdate</span>((update) =&gt; {'{'}
//                         {'\n  '}console.<span className="text-yellow-500">log</span>(<span className="text-green-500">'New update'</span>, update);
//                         {'\n'}{'}'}){'\n'}
//                       </code>
//                     </pre>
//                   </div>
//                 </div>

//                 {/* User indicators */}
//                 <div className="absolute -bottom-3 -right-3 flex">
//                   <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium border-2 border-background">
//                     A
//                   </div>
//                 </div>
//                 <div className="absolute -top-3 -left-3 flex">
//                   <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium border-2 border-background">
//                     B
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Connection lines */}
//             <div className="absolute inset-0 w-full h-full">
//               <svg width="100%" height="100%" viewBox="0 0 400 400" className="absolute inset-0">
//                 <path d="M150,150 L250,250" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
//                 <path d="M250,150 L150,250" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t border-border py-6">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Code className="h-5 w-5 text-primary" />
//               <span className="font-medium">CodeShare</span>
//             </div>
//             <div className="text-sm text-muted-foreground">
//               © {new Date().getFullYear()} CodeShare. All rights reserved.
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage

"use client"
import React, { HTMLInputTypeAttribute, useRef } from 'react';
import { Code, ArrowRight, Users, Plus, LogOut } from 'lucide-react';
import { Button } from '@workspace/ui/components/button'; 
import { Input } from '@workspace/ui/components/input';
import { ModeToggle } from '@/components/mode-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { useRouter } from 'next/navigation';
import { httpAxios } from '@/lib/axios-config';
import { CreateRoomSchema } from '@workspace/common/zodschema';
import { toast } from 'sonner';
import LogoutButton from '@/components/logout';

const HomePage = () => {

  const joinRef = useRef<HTMLInputElement>(null)
  const createRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  

  const handleJoin = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault()
    const slug = joinRef.current?.value
    const zodData = CreateRoomSchema.safeParse({slug})
    if(zodData.error){
      const errors = JSON.parse(zodData.error.message)
      toast(errors[0].message)
      return
    }
    //check if room exists
    //fetch real id of the slug from backend
    try {
      console.log("handle join",slug)
      const {data} = await httpAxios.post("/api/joinroom",{slug})
      console.log("response from joinroom",data);
      
      router.push('/home')
      const roomID  = data.data?.roomId
      console.log(roomID)
      if(!roomID){
        toast("something went wrong")
        return
      }
      router.push(`/room/${roomID}`)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }
  const handleCreate = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault()
    const slug = createRef.current?.value
    //check if room created or not
    //fetch real id of the slug from backend
    const zodData = CreateRoomSchema.safeParse({slug})
    if(zodData.error){
      const errors = JSON.parse(zodData.error.message)
      toast(errors[0].message)
      return
    }
    //check if room exists
    //fetch real id of the slug from backend
    try {
      console.log("handle create", slug);
      const {data} = await httpAxios.post("/api/createroom",{slug})
      console.log("response from create",data);

      router.push('/home')
      const roomID  = data.data?.id
      console.log(roomID)
      if(!roomID){
        toast("something went wrong")
        return
      }
      router.push(`/room/${roomID}`)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header/Navbar */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">CodeShare</h1>
          </div>
          <div className="flex items-center gap-4">
            <LogoutButton/>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row gap-8 items-center">
        {/* Left side - Join/Create Forms */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">Code together in real-time</h2>
            <p className="text-xl text-muted-foreground">
              Connect, collaborate, and code from anywhere with CodeShare
            </p>
          </div>

          <Tabs defaultValue="join" className="w-full max-w-md">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="join">Join Room</TabsTrigger>
              <TabsTrigger value="create">Create Room</TabsTrigger>
            </TabsList>
            
            <TabsContent value="join" className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter a room code" 
                    className="flex-1"
                    id='join-room'
                    ref={joinRef}
                  />
                  <Button onClick={(e)=>handleJoin(e)}>
                    Join
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter a room code to join an existing collaborative session
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter a room name" 
                    className="flex-1"
                    id='crate-room'
                    ref={createRef}
                  />
                  <Button onClick={(e)=>handleCreate(e)}>
                    Create
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create a new room and invite others to collaborate
                </p>
              </div>
            </TabsContent>
          </Tabs>

        </div>

        {/* Right side - Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg aspect-square rounded-full bg-primary/10 flex items-center justify-center">
            <div className="absolute w-4/5 h-4/5 rounded-full bg-primary/5 flex items-center justify-center">
              <div className="relative">
                {/* Code Editor Preview */}
                <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden w-64 md:w-80">
                  <div className="bg-muted p-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <div className="flex-1 text-xs px-2">collaborative-room.js</div>
                  </div>
                  <div className="p-3 font-mono text-xs overflow-x-auto bg-background/95">
                    <pre className="text-left">
                      <code className="text-foreground">
                        <span className="text-blue-500">const</span> room = <span className="text-blue-500">new</span> <span className="text-yellow-500">CollabRoom</span>();{'\n'}
                        <span className="text-blue-500">const</span> doc = room.<span className="text-yellow-500">getDocument</span>();{'\n'}
                        <span className="text-blue-500">const</span> users = room.<span className="text-yellow-500">getUsers</span>();{'\n\n'}
                        room.<span className="text-yellow-500">onUpdate</span>((update) =&gt; {'{'}
                        {'\n  '}console.<span className="text-yellow-500">log</span>(<span className="text-green-500">'New update'</span>, update);
                        {'\n'}{'}'}){'\n'}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* User indicators */}
                <div className="absolute -bottom-3 -right-3 flex">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium border-2 border-background">
                    A
                  </div>
                </div>
                <div className="absolute -top-3 -left-3 flex">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium border-2 border-background">
                    B
                  </div>
                </div>
              </div>
            </div>
            
            {/* Connection lines */}
            <div className="absolute inset-0 w-full h-full">
              <svg width="100%" height="100%" viewBox="0 0 400 400" className="absolute inset-0">
                <path d="M150,150 L250,250" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
                <path d="M250,150 L150,250" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <span className="font-medium">CodeShare</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CodeShare. All rights reserved.
            </div>
            {/* ModeToggle moved to bottom right corner */}
            <div className="fixed bottom-6 right-6">
              <ModeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage