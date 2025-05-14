import { RegisterForm } from "@/components/auth/register-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Create an Account</h1>
      <RegisterForm />
    </main>
  )
}
