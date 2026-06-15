"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/api/admin.api";
import { getApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Plan } from "@/types";

export default function AdminPlans() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.listPlans()
      .then(setPlans)
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  };
  useEffect(() => load(), []);

  const flash = (m: string) => { setMsg(m); setError(""); load(); setTimeout(() => setMsg(""), 2500); };

  if (loading) return <div className="grid md:grid-cols-2 gap-4 max-w-3xl">{[0, 1].map((i) => <Skeleton key={i} className="h-52" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-maroon">Plans & Offers</h1>
          <p className="text-muted text-sm mt-1">
            {isSuperAdmin ? "Create new plans or edit existing ones." : "(Only Super Admin can edit plans)"}
          </p>
        </div>
        {isSuperAdmin && (
          <Button variant="gold" onClick={() => setShowForm((s) => !s)}>
            <Plus size={16} /> New Plan
          </Button>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {msg && <p className="text-green-600 text-sm mb-4">{msg}</p>}

      {/* Naya plan form */}
      {showForm && isSuperAdmin && (
        <NewPlanForm onDone={(m) => { flash(m); setShowForm(false); }} onError={setError} />
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} canEdit={isSuperAdmin} onDone={flash} onError={setError} />
        ))}
        {plans.length === 0 && <p className="text-muted text-sm">No plans yet. Click New Plan to create one.</p>}
      </div>
    </div>
  );
}

// Ek plan ka card — modern look, shadow, edit/delete.
function PlanCard({ plan, canEdit, onDone, onError }: {
  plan: Plan; canEdit: boolean; onDone: (m: string) => void; onError: (m: string) => void;
}) {
  const [price, setPrice] = useState(String(plan.pricePaise / 100));
  const [discount, setDiscount] = useState(String(plan.discountPercent));
  const [days, setDays] = useState(String(plan.durationDays));
  const [active, setActive] = useState(plan.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updatePlan(plan.id, {
        pricePaise: Math.round(Number(price) * 100),
        discountPercent: Number(discount),
        durationDays: Number(days),
        isActive: active,
      });
      onDone(`${plan.name} updated`);
    } catch (err) { onError(getApiError(err)); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!confirm(`Delete "${plan.name}"?`)) return;
    try { await adminApi.deletePlan(plan.id); onDone(`${plan.name} deleted`); }
    catch (err) { onError(getApiError(err)); }
  };

  const finalPrice = Math.round(Number(price) * (1 - Number(discount) / 100));

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display text-maroon text-lg">{plan.name}</h3>
          <p className="text-xs text-muted">{days} days</p>
        </div>
        {Number(discount) > 0 && (
          <span className="bg-gold/15 text-gold-dark text-xs font-semibold px-2 py-1 rounded-full">{discount}% OFF</span>
        )}
      </div>
      <div className="mb-4">
        <span className="font-display text-2xl text-maroon">₹{finalPrice}</span>
        {Number(discount) > 0 && <span className="text-sm text-muted line-through ml-2">₹{price}</span>}
      </div>

      {canEdit ? (
        <div className="space-y-2">
          <Input type="number" label="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input type="number" label="Discount (%)" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          <Input type="number" label="Duration (days)" value={days} onChange={(e) => setDays(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-muted py-1">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active (visible to users)
          </label>
          <div className="flex gap-2 pt-1">
            <Button onClick={save} loading={saving} className="flex-1 text-sm">Save</Button>
            <button onClick={remove} className="px-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 size={16} /></button>
          </div>
        </div>
      ) : (
        <span className={`text-xs ${plan.isActive ? "text-green-600" : "text-muted"}`}>{plan.isActive ? "Active" : "Inactive"}</span>
      )}
    </div>
  );
}

// Naya plan banane ka form.
function NewPlanForm({ onDone, onError }: { onDone: (m: string) => void; onError: (m: string) => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [days, setDays] = useState("");
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!name || !price || !days) { onError("Please fill name, price and duration"); return; }
    setSaving(true);
    try {
      await adminApi.createPlan({
        name: name.trim(),
        pricePaise: Math.round(Number(price) * 100),
        discountPercent: Number(discount),
        durationDays: Number(days),
      });
      onDone(`${name} created`);
    } catch (err) { onError(getApiError(err)); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-cream rounded-2xl border border-line p-5 mb-6 max-w-xl">
      <h3 className="font-display text-maroon mb-3">New Plan / Offer</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Plan Name (e.g. 2 Month Offer)" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Price (₹)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input label="Discount (%)" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        <Input label="Duration (days)" type="number" value={days} onChange={(e) => setDays(e.target.value)} />
      </div>
      <Button variant="gold" onClick={create} loading={saving} className="mt-4">Create Plan</Button>
    </div>
  );
}
