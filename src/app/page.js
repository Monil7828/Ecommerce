'use client'

import { GlobalContext } from "@/context"
import { useContext } from "react"

export default function Home() {

  const {isAuthUser}= useContext(GlobalContext);

  console.log(isAuthUser);
  return (
    <main className="flex bg-slate-200 min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-black">E commerce website</h1>
    </main>
  )
}
