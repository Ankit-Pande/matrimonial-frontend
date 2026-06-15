import { api } from "./client";
import type { Profile, ProfileInput } from "@/types";

// Photo upload ke jawab ka type.
interface PhotoResponse {
  success: boolean;
  photos: string[];
}

export const userApi = {
  // Apna profile lao.
  getMyProfile: () =>
    api.get("/user/me").then((r) => r.data.profile as Profile),

  // Naya profile banao.
  createProfile: (data: ProfileInput) =>
    api.post("/user/profile", data).then((r) => r.data.profile as Profile),

  // Profile update karo.
  updateProfile: (data: ProfileInput) =>
    api.patch("/user/profile", data).then((r) => r.data.profile as Profile),

  // Photo upload (Cloudinary). FormData se file jaati hai.
  uploadPhoto: (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    return api
      .post("/user/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data as PhotoResponse);
  },

  // Photo delete — kaunsi URL hatani hai.
  deletePhoto: (url: string) =>
    api
      .delete("/user/photo", { data: { url } })
      .then((r) => r.data as PhotoResponse),
};
