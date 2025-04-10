'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("You are signed in successfully")
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form action="auth/login" onSubmit={handleSignIn} className="space-y-4 p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold">Sign In</h1>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full">Sign In</Button>
        <p className="text-sm text-center mt-2">
          Don’t have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  )
}
