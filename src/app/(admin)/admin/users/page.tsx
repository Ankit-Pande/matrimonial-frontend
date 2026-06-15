"use client";
import { useEffect, useState, useCallback } from "react";
import { Check, Ban, Trash2, ShieldPlus, ShieldMinus } from "lucide-react";
import { adminApi } from "@/lib/api/admin.api";
import { getApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AdminUser } from "@/types";

export default function AdminUsers() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .listUsers()
      .then((u) => setUsers(u))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  // Koi bhi action chalao, phir list refresh.
  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await fn();
      load();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <h1 className="gold-line font-display text-2xl md:text-3xl text-maroon mb-6">Users</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-cream text-maroon text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="px-4 py-3">{u.profile?.name ?? "—"}</td>
                  <td className="px-4 py-3">{u.phone}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs">{u.role}</span>
                    {u.isPremium && <span className="ml-1 text-xs text-gold-dark">★</span>}
                  </td>
                  <td className="px-4 py-3">
                    {u.isBlocked ? (
                      <span className="text-xs text-red-600">Blocked</span>
                    ) : u.isApproved ? (
                      <span className="text-xs text-green-600">Active</span>
                    ) : (
                      <span className="text-xs text-amber-600">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center" style={{ opacity: busyId === u.id ? 0.5 : 1 }}>
                      {!u.isApproved && (
                        <button onClick={() => run(u.id, () => adminApi.approveUser(u.id))} title="Approve" className="text-green-600 hover:text-green-700"><Check size={18} /></button>
                      )}
                      <button onClick={() => run(u.id, () => adminApi.toggleBlock(u.id))} title={u.isBlocked ? "Unblock" : "Block"} className="text-amber-600 hover:text-amber-700"><Ban size={18} /></button>
                      <button onClick={() => { if (confirm("Delete this user permanently?")) run(u.id, () => adminApi.deleteUser(u.id)); }} title="Delete" className="text-red-600 hover:text-red-700"><Trash2 size={18} /></button>
                      {isSuperAdmin && u.role === "USER" && (
                        <button onClick={() => run(u.id, () => adminApi.makeAdmin(u.id))} title="Make Admin" className="text-maroon hover:opacity-70"><ShieldPlus size={18} /></button>
                      )}
                      {isSuperAdmin && u.role === "ADMIN" && (
                        <button onClick={() => run(u.id, () => adminApi.removeAdmin(u.id))} title="Remove Admin" className="text-gray-500 hover:text-gray-700"><ShieldMinus size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
