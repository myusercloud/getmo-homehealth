import { supabase } from "../config/supabase.js";

export async function uploadToSupabase(file) {
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `equipment/${fileName}`;

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl; 
}
