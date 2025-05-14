"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { ComparisonResults } from "@/components/comparison-results"
import { compareImages } from "@/actions/compare-images"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export function ImageComparisonForm() {
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [comparisonImage, setComparisonImage] = useState<File | null>(null)
  const [referencePreview, setReferencePreview] = useState<string | null>(null)
  const [comparisonPreview, setComparisonPreview] = useState<string | null>(null)
  const [results, setResults] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleReferenceImageChange = (file: File | null) => {
    setReferenceImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferencePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setReferencePreview(null)
    }
  }

  const handleComparisonImageChange = (file: File | null) => {
    setComparisonImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setComparisonPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setComparisonPreview(null)
    }
  }

  const handleSubmit = async () => {
    if (!referenceImage || !comparisonImage) {
      setError("Please upload both a reference image and a comparison image")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("referenceImage", referenceImage)
      formData.append("comparisonImage", comparisonImage)

      const result = await compareImages(formData)
      setResults(result)
    } catch (err) {
      setError("An error occurred while comparing the images. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Reference Image</h2>
            <ImageUploader
              onImageChange={handleReferenceImageChange}
              preview={referencePreview}
              label="Upload reference image"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Comparison Image</h2>
            <ImageUploader
              onImageChange={handleComparisonImageChange}
              preview={comparisonPreview}
              label="Upload comparison image"
            />
          </CardContent>
        </Card>
      </div>

      {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>}

      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={!referenceImage || !comparisonImage || isLoading} size="lg">
          {isLoading ? "Analyzing Images..." : "Find Differences"}
        </Button>
      </div>

      {!isLoggedIn && (
        <div className="bg-muted p-4 rounded-md text-center">
          <p className="mb-2">Sign in to save your comparison results and view your history</p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" asChild size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      )}

      {results && (
        <ComparisonResults
          results={results}
          referenceImage={referencePreview!}
          comparisonImage={comparisonPreview!}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  )
}
