import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"

interface ComparisonDetailPageProps {
  params: {
    id: string
  }
}

export default async function ComparisonDetailPage({ params }: ComparisonDetailPageProps) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get the comparison details
  const { data: comparison, error } = await supabase
    .from("comparisons")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (error || !comparison) {
    notFound()
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/history">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to History
          </Link>
        </Button>
        <h1 className="text-4xl font-bold">Comparison Details</h1>
        <p className="text-muted-foreground">{format(new Date(comparison.created_at), "PPP p")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Reference Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={comparison.reference_image || "/placeholder.svg"}
              alt="Reference"
              className="w-full h-auto rounded-lg object-contain max-h-[500px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparison Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={comparison.comparison_image || "/placeholder.svg"}
              alt="Comparison"
              className="w-full h-auto rounded-lg object-contain max-h-[500px]"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Differences Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{comparison.results}</div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
