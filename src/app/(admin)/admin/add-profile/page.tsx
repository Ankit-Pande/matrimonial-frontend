"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { adminApi } from "@/lib/api/admin.api";
import { getApiError } from "@/lib/api/client";
import { profileSchema, ProfileFormValues } from "@/lib/profileSchema";
import { RELIGIONS, MARITAL_STATUS, PROFESSION, MANGLIK, DIET } from "@/config/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { BulkImport } from "./BulkImport";

// Admin walk-in member ka profile khud banata hai. Phone optional —
// na ho to bureau-record ban jata hai (login nahi, sirf listing).
export default function AdminAddProfile() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string | number>>({});
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const setField = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async () => {
    setMsg("");
    const result = profileSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      const first = result.error.issues[0]?.path[0] as string;
      if (first) document.getElementById(`afield-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSaving(true);
    try {
      const payload: ProfileFormValues & { phone?: string } = result.data;
      if (phone.trim()) payload.phone = phone.trim();
      const res = await adminApi.addProfile(payload);
      // Profile ban gaya — ab photo (agar chuni hai) us user pe upload karo.
      if (photo && res.user?.id) {
        await adminApi.addProfilePhoto(res.user.id, photo);
      }
      router.push("/admin/users");
    } catch (err) {
      setMsg(getApiError(err));
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl md:text-3xl text-maroon mb-1">Add Profile</h1>
      <p className="text-muted text-sm mb-6">Create a profile for a walk-in member. Phone is optional.</p>
      {msg && <p className="text-red-600 text-sm mb-4">{msg}</p>}

      {/* Photo - form ke upar, round. Profile banne ke baad upload hoti hai. */}
      <div className="flex flex-col items-center mb-6">
        <label className="w-24 h-24 rounded-full border-2 border-dashed border-line grid place-items-center cursor-pointer text-muted hover:border-gold hover:text-gold-dark transition-colors overflow-hidden">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Selected" className="w-full h-full object-cover" />
          ) : (
            <Camera size={24} />
          )}
          <input type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
        </label>
        <p className="text-xs text-muted mt-2">Tap to add member photo (optional)</p>
      </div>

      <div className="card p-5 grid sm:grid-cols-2 gap-4">
        <Input wrapperId="afield-name" label="Full Name" error={errors.name}
          value={(form.name as string) ?? ""} onChange={(e) => setField("name", e.target.value)} />
        <Input label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Select wrapperId="afield-gender" label="Gender" error={errors.gender} placeholder="Select"
          options={[{ value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }]}
          value={(form.gender as string) ?? ""} onChange={(e) => setField("gender", e.target.value)} />
        <Input wrapperId="afield-dob" label="Date of Birth" type="date" error={errors.dob}
          value={(form.dob as string) ?? ""} onChange={(e) => setField("dob", e.target.value)} />
        <Select label="Marital Status" placeholder="Select" options={MARITAL_STATUS}
          value={(form.maritalStatus as string) ?? ""} onChange={(e) => setField("maritalStatus", e.target.value)} />
        <Input wrapperId="afield-motherTongue" label="Mother Tongue" error={errors.motherTongue}
          value={(form.motherTongue as string) ?? ""} onChange={(e) => setField("motherTongue", e.target.value)} />
        <Select label="Religion" placeholder="Select" options={RELIGIONS}
          value={(form.religion as string) ?? ""} onChange={(e) => setField("religion", e.target.value)} />
        <Input wrapperId="afield-caste" label="Caste" error={errors.caste}
          value={(form.caste as string) ?? ""} onChange={(e) => setField("caste", e.target.value)} />
        <Input wrapperId="afield-gotra" label="Gotra" error={errors.gotra}
          value={(form.gotra as string) ?? ""} onChange={(e) => setField("gotra", e.target.value)} />
        <Select label="Manglik" placeholder="Select" options={MANGLIK}
          value={(form.manglikStatus as string) ?? ""} onChange={(e) => setField("manglikStatus", e.target.value)} />
        <Select label="Diet" placeholder="Select" options={DIET}
          value={(form.diet as string) ?? ""} onChange={(e) => setField("diet", e.target.value)} />
        <Input wrapperId="afield-height" label="Height (cm)" type="number" error={errors.height}
          value={(form.height as string) ?? ""} onChange={(e) => setField("height", e.target.value)} />
        <Input wrapperId="afield-weight" label="Weight (kg)" type="number" error={errors.weight}
          value={(form.weight as string) ?? ""} onChange={(e) => setField("weight", e.target.value)} />
        <Input wrapperId="afield-education" label="Education" error={errors.education}
          value={(form.education as string) ?? ""} onChange={(e) => setField("education", e.target.value)} />
        <Select label="Profession Type" placeholder="Select" options={PROFESSION}
          value={(form.professionType as string) ?? ""} onChange={(e) => setField("professionType", e.target.value)} />
        <Input wrapperId="afield-jobTitle" label="Job Title" error={errors.jobTitle}
          value={(form.jobTitle as string) ?? ""} onChange={(e) => setField("jobTitle", e.target.value)} />
        <Input wrapperId="afield-companyName" label="Company Name" error={errors.companyName}
          value={(form.companyName as string) ?? ""} onChange={(e) => setField("companyName", e.target.value)} />
        <Input wrapperId="afield-annualIncome" label="Annual Income (₹)" type="number" error={errors.annualIncome}
          value={(form.annualIncome as string) ?? ""} onChange={(e) => setField("annualIncome", e.target.value)} />
        <Input wrapperId="afield-state" label="State" error={errors.state}
          value={(form.state as string) ?? ""} onChange={(e) => setField("state", e.target.value)} />
        <Input wrapperId="afield-city" label="City" error={errors.city}
          value={(form.city as string) ?? ""} onChange={(e) => setField("city", e.target.value)} />
      </div>

      <Button onClick={save} loading={saving} className="mt-5 w-full sm:w-auto">
        Create Profile
      </Button>

      {/* Bahut saare profile ek saath - CSV upload */}
      <BulkImport />
    </div>
  );
}
