import { api } from "./client";
import type { Interest } from "@/types";

export const interestApi = {
  send: (toUserId: string) =>
    api.post("/interest", { toUserId }).then((r) => r.data.interest),
  respond: (id: string, action: "ACCEPT" | "REJECT") =>
    api.patch(`/interest/${id}`, { action }).then((r) => r.data.interest),
  sent: (cursor?: string, limit = 20) =>
    api.get("/interest/sent", { params: { cursor, limit } }).then(
      (r) => r.data as { interests: Interest[]; nextCursor: string | null }
    ),
  received: (cursor?: string, limit = 20) =>
    api.get("/interest/received", { params: { cursor, limit } }).then(
      (r) => r.data as { interests: Interest[]; nextCursor: string | null }
    ),
};
