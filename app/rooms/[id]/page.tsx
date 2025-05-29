import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { format } from "date-fns"

interface RoomDetailPageProps {
  params: {
    id: string
  }
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: room } = await supabase
    .from("rooms")
    .select(`
      *,
      room_images (
        id,
        reference_image,
        comparison_image,
        results,
        created_at
      )
    `)
    .eq("id", params.id)
    .single()

  if (!room) {
    notFound()
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/rooms">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Link>
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">{room.name}</h1>
          <Button asChild>
            <Link href={`/rooms/${room.id}/compare`}>
              <Plus className="h-4 w-4 mr-2" />
              New Comparison
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {room.room_images?.map((image: any) => (
          <Card key={image.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Comparison from {format(new Date(image.created_at), "PPP")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Reference Image</h3>
                  <img
                    src={image.reference_image || "/placeholder.svg"}
                    alt="Reference"
                    className="w-full h-auto rounded-lg object-contain max-h-[500px]"
                  />
                </div>
                {image.comparison_image && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Comparison Image</h3>
                    <img
                      src={image.comparison_image}
                      alt="Comparison"
                      className="w-full h-auto rounded-lg object-contain max-h-[500px]"
                    />
                  </div>
                )}
              </div>
              {image.results && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Differences Found</h3>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">{image.results}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {!room.room_images?.length && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No comparisons yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by adding your first comparison for this room.
            </p>
            <Button asChild>
              <Link href={`/rooms/${room.id}/compare`}>
                <Plus className="h-4 w-4 mr-2" />
                New Comparison
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}