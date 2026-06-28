import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "../actions"

export const metadata: Metadata = {
  title: "Sign Up | Momentum",
  description: "Create a new account.",
}

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Enter your information to get started
        </p>
      </div>

      <form className="space-y-4">
        {searchParams?.message && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
            {searchParams.message}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="name@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button className="w-full" formAction={signup}>
          Create Account
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline font-medium hover:text-primary">
          Sign in
        </Link>
      </div>
    </div>
  )
}
