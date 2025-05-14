import { ImageComparisonForm } from "@/components/image-comparison-form"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Spot the Difference</h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Upload a reference image and a comparison image to find the differences between them. Our AI will analyze both
        images and provide detailed descriptions of what has changed.
      </p>

      <div className="max-w-4xl mx-auto">
        <ImageComparisonForm />
      </div>
    </main>
  )
}
