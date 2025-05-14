"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveComparisonToHistory } from "@/actions/save-comparison"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import Link from "next/link"

interface ComparisonResultsProps {
  results: string
  referenceImage: string
  comparisonImage: string
  isLoggedIn: boolean
}

export function ComparisonResults({ results, referenceImage, comparisonImage, isLoggedIn }: ComparisonResultsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveComparison = async () => {
    setIsSaving(true)
    try {
      await saveComparisonToHistory({
        referenceImage,
        comparisonImage,
        results,
      })
      setSaved(true)
    } catch (error) {
      console.error("Failed to save comparison:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Comparison Results</CardTitle>
        {isLoggedIn ? (
          <Button variant="outline" size="sm" onClick={handleSaveComparison} disabled={isSaving || saved}>
            <Save className="h-4 w-4 mr-2" />
            {saved ? "Saved" : isSaving ? "Saving..." : "Save Results"}
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign in to save</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="differences">
          <TabsList className="mb-4">
            <TabsTrigger value="differences">Differences</TabsTrigger>
            <TabsTrigger value="sideBySide">Side by Side</TabsTrigger>
          </TabsList>

          <TabsContent value="differences">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{results}</div>
            </div>
          </TabsContent>

          <TabsContent value="sideBySide">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Reference Image</h3>
                <img
                  src={referenceImage || "/placeholder.svg"}
                  alt="Reference"
                  className="w-full h-auto rounded-lg object-contain max-h-[500px]"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Comparison Image</h3>
                <img
                  src={comparisonImage || "/placeholder.svg"}
                  alt="Comparison"
                  className="w-full h-auto rounded-lg object-contain max-h-[500px]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
