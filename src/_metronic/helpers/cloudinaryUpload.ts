import axios, { AxiosResponse } from "axios";

interface CloudinaryUploadResponse {
  secure_url: string;
  // Add other properties you might need from Cloudinary
}
// Cloudinary upload function
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'castania'); // Replace with your upload preset
  
  try {
    const response = await axios.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/dv91eyjei/image/upload`, // Replace with your cloud name
      formData
    );
    
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};