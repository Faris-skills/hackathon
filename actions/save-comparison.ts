"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface SaveComparisonParams {
  referenceImage: string
  comparisonImage: string
  results: string
}

export async function saveComparisonToHistory({ referenceImage, comparisonImage, results }: SaveComparisonParams) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to save comparisons")
  }

  // Save the comparison to the database
  const { error } = await supabase.from("comparisons").insert({
    user_id: user.id,
    reference_image: referenceImage,
    comparison_image: comparisonImage,
    results,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error saving comparison:", error)
    throw new Error("Failed to save comparison")
  }

  revalidatePath("/history")
}
