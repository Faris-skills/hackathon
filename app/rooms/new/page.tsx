"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/image-uploader"
import { uploadImageToCloudinary } from "@/actions/cloudinary"

export default function NewRoomPage() {
  const [name, setName] = useState("")
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!name || !referenceImage) {
        throw new Error("Please provide both a room name and a reference image")
      }

      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(referenceImage)

      // Create room and initial reference image
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .insert({ name })
        .select()
        .single()

      if (roomError) throw roomError

      const { error: imageError } = await supabase
        .from("room_images")
        .insert({
          room_id: room.id,
          reference_image: imageUrl,
        })

      if (imageError) throw imageError

      router.push("/rooms")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Room Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Master Bedroom"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reference Image</label>
              <ImageUploader
                onImageChange={setReferenceImage}
                preview={null}
                label="Upload reference image"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/rooms")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}