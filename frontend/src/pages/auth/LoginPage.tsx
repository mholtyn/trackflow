import { useState } from "react"
import { Button } from "@/components/retroui/Button"
import { Input } from "@/components/retroui/Input"
import useLogin from "@/hooks/useLogin"

function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { username , password })
    loginMutation.mutate({ username, password})
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-80"
        aria-label="Login form"
      >
        <h2 className="text-center text-2xl font-semibold mb-4">
          Log in to Trackflow
        </h2>

        <label htmlFor="username" className="block mb-1 font-medium">
          Username
        </label>
        <Input
          id="username"
          type="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />

        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full">
          Log In
        </Button>

        <p className="text-center text-sm text-gray-600">
          No account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  )
}

export default LoginPage