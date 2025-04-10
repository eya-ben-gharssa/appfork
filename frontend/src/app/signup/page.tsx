'use client'

import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { toast } from "sonner"


export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("signup succcessfully")

    setTimeout(() => {
      router.push('/signin')
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignUp} className="space-y-4 p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold">Sign Up</h1>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full">Create Account</Button>
        <p className="text-sm text-center mt-2">
          Already have an account? <a href="/signin" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </form>
    </div>
  )
}
