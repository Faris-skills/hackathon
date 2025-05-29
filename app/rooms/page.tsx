import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default async function RoomsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: rooms } = await supabase
    .from("rooms")
    .select(`
      *,
      room_images (
        reference_image,
        comparison_image,
        created_at
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Rooms</h1>
        <Button asChild>
          <Link href="/rooms/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Link>
        </Button>
      </div>

      {rooms && rooms.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room: any) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle className="text-lg">{room.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {room.room_images?.[0] ? (
                    <>
                      <img
                        src={room.room_images[0].reference_image || "/placeholder.svg"}
                        alt="Reference"
                        className="w-full h-auto rounded-lg object-cover aspect-square"
                      />
                      <img
                        src={room.room_images[0].comparison_image || "/placeholder.svg"}
                        alt="Latest Comparison"
                        className="w-full h-auto rounded-lg object-cover aspect-square"
                      />
                    </>
                  ) : (
                    <div className="col-span-2 aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                      No images yet
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {room.room_images?.length || 0} comparisons
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/rooms/${room.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No rooms yet</h2>
          <p className="text-muted-foreground mb-6">
            Start by adding your first room to begin tracking comparisons.
          </p>
          <Button asChild>
            <Link href="/rooms/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Link>
          </Button>
        </div>
      )}
    </main>
  )
}