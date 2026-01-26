import { supabase } from "../config/supabaseClient.js";
import { randomUUID } from "crypto";

export async function uploadToSupabase(file) {
  try {
    if (!file) return null;

    const bucket = process.env.SUPABASE_BUCKET;

    // Generate unique filename
    const ext = file.originalname.split(".").pop();
    const filename = `${randomUUID()}.${ext}`;

    // Upload buffer to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return null;
    }

    // Generate public URL
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return {
      url: publicUrl.publicUrl,
      path: data.path,
    };

  } catch (err) {
    console.error("Supabase upload exception:", err);
    return null;
  }
}
