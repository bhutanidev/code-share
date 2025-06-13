// store/useYDocStore.ts
import { create } from 'zustand'
import * as Y from 'yjs'

type YDocStore = {
  ytext: Y.Text | null
  setYText: (text: Y.Text) => void
  getCurrentCode: () => string
}

const useYDocStore = create<YDocStore>((set, get) => ({
  ytext: null,
  setYText: (text) => set({ ytext: text }),
  getCurrentCode: () => get().ytext?.toString() || "",
}))

export default useYDocStore
