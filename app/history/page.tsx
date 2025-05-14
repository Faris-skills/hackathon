import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function HistoryPage() {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get the user's comparison history
  const { data: comparisons, error } = await supabase
    .from("comparisons")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comparisons:", error)
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Comparison History</h1>
        <Button asChild>
          <Link href="/">New Comparison</Link>
        </Button>
      </div>

      {comparisons && comparisons.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((comparison) => (
            <Card key={comparison.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {formatDistanceToNow(new Date(comparison.created_at), { addSuffix: true })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <img
                    src={comparison.reference_image || "/placeholder.svg"}
                    alt="Reference"
                    className="w-full h-auto rounded-lg object-cover aspect-square"
                  />
                  <img
                    src={comparison.comparison_image || "/placeholder.svg"}
                    alt="Comparison"
                    className="w-full h-auto rounded-lg object-cover aspect-square"
                  />
                </div>
                <div className="line-clamp-3 text-sm text-muted-foreground mb-4">{comparison.results}</div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/history/${comparison.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No comparisons yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't made any image comparisons yet. Start by creating a new comparison.
          </p>
          <Button asChild>
            <Link href="/">New Comparison</Link>
          </Button>
        </div>
      )}
    </main>
  )
}
