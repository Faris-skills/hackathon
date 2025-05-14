import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dzqy1jljf",
  api_key: "939911551967337",
  api_secret: "9rpllQrtDhmLlO_NHTnm_oZ8OFQ",
});

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "image-comparisons" }, (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      })
      .end(buffer);
  });

      const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
}
