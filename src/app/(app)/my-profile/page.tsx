"use client";
import { useEffect, useState, useRef } from "react";
import { userApi } from "@/lib/api/user.api";
import { getApiError } from "@/lib/api/client";
import { profileSchema } from "@/lib/profileSchema";
import { Skeleton } from "@/components/ui/Skeleton";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RELIGIONS, MARITAL_STATUS, PROFESSION, MANGLIK, DIET } from "@/config/constants";
import type { ProfileInput } from "@/types";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<ProfileInput>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  // Naye profile me chuni photo yahan hold hoti hai — Create ke baad auto-upload.
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Page khulte hi apna profile lao. Na mile to naya banana hai.
  useEffect(() => {
    userApi
      .getMyProfile()
      .then((p) => setProfile(p))
      .catch(() => setIsNew(true))
      .finally(() => setLoading(false));
  }, []);

  // Field badle to value set karo aur us field ka error hata do.
  const setField = (key: string, value: string | number) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setSuccessMsg("");
  };

  // Save dabane par - pehle zod se poori validation, phir API.
  const handleSave = async () => {
    setSuccessMsg("");

    // Zod se check karo. Galat ho to har field ka error niche dikhega.
    const result = profileSchema.safeParse(profile);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      // Pehle galat/khaali field tak seedha pahunchao aur highlight ke liye focus.
      const firstField = result.error.issues[0]?.path[0] as string;
      if (firstField) {
        document.getElementById(`field-${firstField}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setSuccessMsg("");
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      const payload = result.data as ProfileInput;
      if (isNew) {
        await userApi.createProfile(payload);
        // Pehle se chuni photo ab upload karo.
        if (pendingPhoto) {
          const res = await userApi.uploadPhoto(pendingPhoto);
          setProfile((prev) => ({ ...prev, photos: res.photos }));
          setPendingPhoto(null);
          setPendingPreview("");
        }
        setIsNew(false);
        setSuccessMsg("Profile created successfully!");
        setTimeout(() => photoRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        await userApi.updateProfile(payload);
        setSuccessMsg("Profile saved successfully!");
      }
    } catch (err) {
      setSuccessMsg(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  // Photo chuno -> Cloudinary upload -> nayi list profile me daal do.
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Profile abhi bana nahi — photo hold karo, Create ke baad upload hogi.
    if (isNew) {
      setPendingPhoto(file);
      setPendingPreview(URL.createObjectURL(file));
      return;
    }
    setPhotoBusy(true);
    try {
      const res = await userApi.uploadPhoto(file);
      setProfile((prev) => ({ ...prev, photos: res.photos }));
    } catch (err) {
      setSuccessMsg(getApiError(err));
    } finally {
      setPhotoBusy(false);
    }
  };

  // Photo hatao.
  const handleDeletePhoto = async (url: string) => {
    setPhotoBusy(true);
    try {
      const res = await userApi.deletePhoto(url);
      setProfile((prev) => ({ ...prev, photos: res.photos }));
    } catch (err) {
      setSuccessMsg(getApiError(err));
    } finally {
      setPhotoBusy(false);
    }
  };

  // Profile load hone tak skeleton dikhao.
  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl md:text-3xl text-maroon mb-1">
        {isNew ? "Create Profile" : "My Profile"}
      </h1>
      <p className="text-muted text-sm mb-5">
        {isNew ? "Fill your details to get started." : "Update your details anytime."}
      </p>

      {/* Photo - sabse upar, round avatar. Click karke gallery se chuno. */}
      <div ref={photoRef} className="flex flex-col items-center mb-6">
        {isNew ? (
          <>
            {/* Profile banne se pehle bhi photo chun sakte hain — preview yahan dikhta hai. */}
            <label className="w-28 h-28 rounded-full border-2 border-dashed border-line grid place-items-center cursor-pointer text-muted hover:border-gold hover:text-gold-dark transition-colors overflow-hidden">
              {pendingPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pendingPreview} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <Camera size={26} />
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
            <p className="text-xs text-muted mt-2">{pendingPreview ? "Photo will be uploaded after you create your profile" : "Tap camera to add photo"}</p>
          </>
        ) : (
          <>
            <div className="flex gap-3 flex-wrap justify-center items-center">
              {profile.photos?.map((url) => (
                <div key={url} className="relative w-24 h-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gold" />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(url)}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white grid place-items-center hover:bg-red-600"
                    aria-label="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {/* Upload icon - gallery direct khulega */}
              <label className="w-24 h-24 rounded-full border-2 border-dashed border-line grid place-items-center cursor-pointer text-muted hover:border-gold hover:text-gold-dark transition-colors">
                {photoBusy ? (
                  <span className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                ) : (
                  <Camera size={26} />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={photoBusy} />
              </label>
            </div>
            <p className="text-xs text-muted mt-2">Tap camera to add photo</p>
          </>
        )}
      </div>

      <Section title="Basic Details">
        <Input
          wrapperId="field-name"
          label="Full Name"
          value={profile.name ?? ""}
          error={errors.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <Select
          wrapperId="field-gender"
          label="Gender"
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
          ]}
          placeholder="Select"
          value={profile.gender ?? ""}
          error={errors.gender}
          onChange={(e) => setField("gender", e.target.value)}
        />
        <Input
          wrapperId="field-dob"
          label="Date of Birth"
          type="date"
          value={profile.dob?.slice(0, 10) ?? ""}
          error={errors.dob}
          onChange={(e) => setField("dob", e.target.value)}
        />
        <Input
          wrapperId="field-motherTongue"
          label="Mother Tongue"
          value={profile.motherTongue ?? ""}
          error={errors.motherTongue}
          onChange={(e) => setField("motherTongue", e.target.value)}
        />
        <Select
          wrapperId="field-maritalStatus"
          label="Marital Status"
          options={MARITAL_STATUS}
          placeholder="Select"
          value={profile.maritalStatus ?? ""}
          onChange={(e) => setField("maritalStatus", e.target.value)}
        />
      </Section>

      <Section title="Religion & Culture">
        <Select
          wrapperId="field-religion"
          label="Religion"
          options={RELIGIONS}
          placeholder="Select"
          value={profile.religion ?? ""}
          onChange={(e) => setField("religion", e.target.value)}
        />
        <Input
          wrapperId="field-caste"
          label="Caste"
          value={profile.caste ?? ""}
          error={errors.caste}
          onChange={(e) => setField("caste", e.target.value)}
        />
        <Input
          wrapperId="field-gotra"
          label="Gotra"
          value={profile.gotra ?? ""}
          error={errors.gotra}
          onChange={(e) => setField("gotra", e.target.value)}
        />
        <Select
          wrapperId="field-manglikStatus"
          label="Manglik"
          options={MANGLIK}
          placeholder="Select"
          value={profile.manglikStatus ?? ""}
          onChange={(e) => setField("manglikStatus", e.target.value)}
        />
        <Select
          wrapperId="field-diet"
          label="Diet"
          options={DIET}
          placeholder="Select"
          value={profile.diet ?? ""}
          onChange={(e) => setField("diet", e.target.value)}
        />
      </Section>

      <Section title="Physical & Professional">
        <Input
          wrapperId="field-height"
          label="Height (cm)"
          type="number"
          value={profile.height ?? ""}
          error={errors.height}
          onChange={(e) => setField("height", e.target.value)}
        />
        <Input
          wrapperId="field-weight"
          label="Weight (kg)"
          type="number"
          value={profile.weight ?? ""}
          error={errors.weight}
          onChange={(e) => setField("weight", e.target.value)}
        />
        <Input
          wrapperId="field-education"
          label="Education"
          value={profile.education ?? ""}
          error={errors.education}
          onChange={(e) => setField("education", e.target.value)}
        />
        <Select
          wrapperId="field-professionType"
          label="Profession Type"
          options={PROFESSION}
          placeholder="Select"
          value={profile.professionType ?? ""}
          onChange={(e) => setField("professionType", e.target.value)}
        />
        <Input
          wrapperId="field-jobTitle"
          label="Job Title"
          value={profile.jobTitle ?? ""}
          error={errors.jobTitle}
          onChange={(e) => setField("jobTitle", e.target.value)}
        />
        <Input
          wrapperId="field-companyName"
          label="Company"
          value={profile.companyName ?? ""}
          error={errors.companyName}
          onChange={(e) => setField("companyName", e.target.value)}
        />
        <Input
          wrapperId="field-annualIncome"
          label="Annual Income in Rs"
          type="number"
          value={profile.annualIncome ?? ""}
          error={errors.annualIncome}
          onChange={(e) => setField("annualIncome", e.target.value)}
        />
      </Section>

      <Section title="Location">
        <Input
          wrapperId="field-state"
          label="State"
          value={profile.state ?? ""}
          error={errors.state}
          onChange={(e) => setField("state", e.target.value)}
        />
        <Input
          wrapperId="field-city"
          label="City"
          value={profile.city ?? ""}
          error={errors.city}
          onChange={(e) => setField("city", e.target.value)}
        />
      </Section>

      <Button variant="gold" className="w-full" loading={saving} onClick={handleSave}>
        {isNew ? "Create Profile" : "Save Changes"}
      </Button>

      {/* Success ya error message - Save button ke theek niche */}
      {successMsg && (
        <p className="text-center text-sm mt-3 text-maroon font-medium">{successMsg}</p>
      )}
    </div>
  );
}

// Form ka ek section (heading + grid).
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 mb-5">
      <h3 className="font-display text-maroon mb-4 gold-line">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}
