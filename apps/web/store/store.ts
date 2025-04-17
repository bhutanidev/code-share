import {create} from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface userState{
    name:String|null,
    email:String|null,
    id:String|null,
    isAuthenticated:boolean,
    setName:(name:string|null)=>void
    setEmail:(email:string|null)=>void
    setId:(id:string|null)=>void
    setAuthentication:(authenticated:boolean)=>void
}

const useUserStore = create(
    persist<userState>((set) => ({
    name:null,
    email:null,
    id:null,
    isAuthenticated:false,
    setName:(name:string|null)=>set((state)=>({name:name})),
    setEmail:(email:string|null)=>set((state)=>({email:email})),
    setId:(id:string|null)=>set((state)=>({id:id})),
    setAuthentication:(authenticated:boolean)=>set((state)=>({isAuthenticated:authenticated})),
  }),
  {
      name: 'count-store',
      storage: createJSONStorage(() => localStorage),
  }
))

export default useUserStore