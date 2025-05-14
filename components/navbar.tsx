import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth/auth-button"
import { ImageIcon } from "lucide-react"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          <span className="font-bold">Spot the Difference</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/history">History</Link>
          </Button>
          <AuthButton />
        </nav>
      </div>
    </header>
  )
}
