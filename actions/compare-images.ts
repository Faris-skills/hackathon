"use server";

// import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai";
import { uploadImageToCloudinary } from "./cloudinary";

// export async function compareImages(formData: FormData): Promise<string> {
//   try {
//     const referenceImage = formData.get("referenceImage") as File;
//     const comparisonImage = formData.get("comparisonImage") as File;

//     if (!referenceImage || !comparisonImage) {
//       throw new Error("Both reference and comparison images are required");
//     }

//     // Convert images to base64 using Buffer (avoiding FileReader)
//     const referenceBase64 = await fileToBase64(referenceImage);
//     const comparisonBase64 = await fileToBase64(comparisonImage);
//     //   const referenceImageUrl = await uploadImageToCloudinary(referenceImage);
//     // const comparisonImageUrl = await uploadImageToCloudinary(comparisonImage);
//     const referenceImageUrl =
//       "https://res.cloudinary.com/dzqy1jljf/image/upload/v1747166127/image-comparisons/y4uxudvq2eqa1npxlvto.jpg";
//     const comparisonImageUrl =
//       "https://res.cloudinary.com/dzqy1jljf/image/upload/v1747166129/image-comparisons/d3l4fdvh1vqsfeiym8su.jpg";

//     // Use AI to analyze the differences
//     const { text } = await generateText({
//       model: openai("gpt-4.1"),
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an expert at detailed, pixel-perfect image comparison. Do NOT assume differences—only describe actual detected changes.",
//         },
//         {
//           role: "user",
//           content:
//             "Here are two images. Please compare them EXACTLY and list only the REAL differences.",
//         },
//         {
//           role: "user",
//           content: JSON.stringify([
//             {
//               type: "image",
//               image: referenceImageUrl,
//               providerOptions: {
//                 openai: { imageDetail: "high" },
//               },
//             },
//             {
//               type: "image",
//               image: comparisonImageUrl,
//               providerOptions: {
//                 openai: { imageDetail: "high" },
//               },
//             },
//           ]),
//         },
//       ],
//     });

//     return text;
//   } catch (error) {
//     console.error("Error comparing images:", error);
//     throw new Error("Failed to compare images");
//   }
// }

// Convert file to base64 using Buffer instead of FileReader
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return `data:${file.type};base64,${Buffer.from(arrayBuffer).toString(
    "base64"
  )}`;
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function compareImages(formData: FormData): Promise<string> {
  try {
    const referenceImage = formData.get("referenceImage") as File;
    const comparisonImage = formData.get("comparisonImage") as File;

    if (!referenceImage || !comparisonImage) {
      throw new Error("Both reference and comparison images are required.");
    }

    // Ensure images are hosted online (Cloudinary or similar)
    const referenceImageUrl = await uploadImageToCloudinary(referenceImage);
    const comparisonImageUrl = await uploadImageToCloudinary(comparisonImage);
    

    // const referenceBase64 = await fileToBase64(referenceImage);
    // const comparisonBase64 = await fileToBase64(comparisonImage);

    // const referenceImageUrl =
    //   "https://res.cloudinary.com/dzqy1jljf/image/upload/v1747166127/image-comparisons/y4uxudvq2eqa1npxlvto.jpg";
    // const comparisonImageUrl =
    //   "https://res.cloudinary.com/dzqy1jljf/image/upload/v1747166129/image-comparisons/d3l4fdvh1vqsfeiym8su.jpg";
      
    // Call OpenAI directly
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing images and finding differences between them. 
          You will be given two images: a reference image and a comparison image. 
          Your task is to identify all the differences between these images and provide a detailed description of each difference.
          Focus on just what is missing on the comparison image compared to the reference image.
          Do not assume any differences; only describe actual detected changes.
          
          Format your response as a list of differences, with each difference clearly described.
          Be specific and detailed in your descriptions, mentioning the exact location and nature of each difference.`,
        },
        {
          role: "user",
          content:
            "Here are two almost identical images. The first is the reference image, and the second is the comparison image. Please identify and describe all the differences between them.",
        },
        {
          role: "user",
          content: `Reference Image URL: ${referenceImageUrl}\nComparison Image URL: ${comparisonImageUrl}`,
        },
      ],
    });

    return response.choices[0]?.message?.content || "No differences found.";
  } catch (error) {
    console.error("Error comparing images:", error);
    throw new Error("Failed to analyze image differences.");
  }
}
