
import React from "react"
import { signIn } from "@/auth"

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("auth0")
      }}
    >
      <button type="submit" className="hover:text-gwgreen">Sign In</button>
    </form>
  )
}