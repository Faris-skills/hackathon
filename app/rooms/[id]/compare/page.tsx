"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/image-uploader"
import { compareImages } from "@/actions/compare-images"
import { uploadImageToCloudinary } from "@/actions/cloudinary"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface CompareRoomPageProps {
  params: {
    id: string
  }
}

export default function CompareRoomPage({ params }: CompareRoomPageProps) {
  const [comparisonImage, setComparisonImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!comparisonImage) {
      setError("Please upload a comparison image")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get the reference image
      const { data: roomImage } = await supabase
        .from("room_images")
        .select("reference_image")
        .eq("room_id", params.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (!roomImage) throw new Error("Reference image not found")

      // Upload comparison image
      const comparisonImageUrl = await uploadImageToCloudinary(comparisonImage)

      // Compare images
      const formData = new FormData()
      formData.append("referenceImage", roomImage.reference_image)
      formData.append("comparisonImage", comparisonImageUrl)
      const results = await compareImages(formData)

      // Save comparison
      const { error: saveError } = await supabase.from("room_images").insert({
        room_id: params.id,
        reference_image: roomImage.reference_image,
        comparison_image: comparisonImageUrl,
        results,
      })

      if (saveError) throw saveError

      router.push(`/rooms/${params.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/rooms/${params.id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Room
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Upload Comparison Image</h3>
              <ImageUploader
                onImageChange={setComparisonImage}
                preview={null}
                label="Upload comparison image"
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push(`/rooms/${params.id}`)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Comparing..." : "Compare Images"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}