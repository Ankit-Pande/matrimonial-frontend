import { api } from "./client";
import type { AdminStats, AdminUser, Plan } from "@/types";
import type { ProfileFormValues } from "@/lib/profileSchema";

// Admin ke saare API calls. Sirf admin/super-admin token se chalte hain.
export const adminApi = {
  // Dashboard ginti.
  stats: () =>
    api.get("/admin/stats").then((r) => r.data.stats as AdminStats),

  // Users list (filter optional).
  listUsers: (filters?: { isApproved?: string; isBlocked?: string }) =>
    api.get("/admin/users", { params: filters }).then((r) => r.data.users as AdminUser[]),

  approveUser: (id: string) =>
    api.patch(`/admin/users/${id}/approve`).then((r) => r.data),

  toggleBlock: (id: string) =>
    api.patch(`/admin/users/${id}/block`).then((r) => r.data),

  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`).then((r) => r.data),

  // Sirf super admin.
  makeAdmin: (id: string) =>
    api.patch(`/admin/users/${id}/make-admin`).then((r) => r.data),

  removeAdmin: (id: string) =>
    api.patch(`/admin/users/${id}/remove-admin`).then((r) => r.data),

  // Admin khud naya member profile banaye (walk-in). Phone optional.
  addProfile: (data: ProfileFormValues & { phone?: string }) =>
    api.post("/admin/profile", data).then((r) => r.data as { user: { id: string } }),

  // Admin profile pe photo (userId se).
  addProfilePhoto: (userId: string, file: File) => {
    const fd = new FormData();
    fd.append("photo", file);
    return api.post(`/admin/profile/${userId}/photo`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data);
  },

  // Bulk import (CSV se parse ki gayi rows).
  bulkAddProfiles: (rows: Record<string, unknown>[]) =>
    api.post("/admin/profiles/bulk", { rows }).then((r) => r.data as { added: number; failed: number; errors: string[] }),

  // Plans
  listPlans: () =>
    api.get("/admin/plans").then((r) => r.data.plans as Plan[]),

  createPlan: (data: { name: string; pricePaise: number; discountPercent: number; durationDays: number }) =>
    api.post("/admin/plans", data).then((r) => r.data),

  updatePlan: (id: string, data: { pricePaise: number; discountPercent: number; durationDays: number; isActive: boolean }) =>
    api.patch(`/admin/plans/${id}`, data).then((r) => r.data),

  deletePlan: (id: string) =>
    api.delete(`/admin/plans/${id}`).then((r) => r.data),
};
