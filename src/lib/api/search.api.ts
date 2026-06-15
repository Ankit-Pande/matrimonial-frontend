import { api } from "./client";
import type { Profile } from "@/types";

export interface SearchParams {
  religion?: string; caste?: string; maritalStatus?: string;
  professionType?: string; manglikStatus?: string; diet?: string;
  motherTongue?: string; state?: string; city?: string; gotra?: string;
  minAge?: number; maxAge?: number; minHeight?: number; maxHeight?: number;
  minIncome?: number; cursor?: string; limit?: number;
}

export const searchApi = {
  search: (params: SearchParams) =>
    api.get("/search", { params }).then(
      (r) => r.data as { profiles: Profile[]; nextCursor: string | null }
    ),
  getProfile: (id: string) =>
    api.get(`/search/${id}`).then((r) => r.data.profile as Profile),
};
