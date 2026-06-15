// Backend se jo data aata hai uske types. Inse TypeScript galti pakad leta hai.

// User ka role - ab 3 tarah ke (super admin sabse upar).
export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

// Login ke baad mila user.
export interface AuthUser {
  id: string;
  phone: string;
  role: Role;
}

// Login API ka jawab.
export interface LoginResponse {
  success: boolean;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Ek profile ka pura data (backend ke field naam ke hisaab se).
export interface Profile {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  dob?: string;
  age?: number;
  height?: number | null;
  weight?: number | null;
  religion?: string | null;
  caste?: string | null;
  gotra?: string | null;
  manglikStatus?: string;
  diet?: string | null;
  maritalStatus?: string;
  motherTongue?: string;
  education?: string;
  professionType?: string;
  jobTitle?: string | null;
  companyName?: string | null;
  annualIncome?: number | null;
  city?: string | null;
  state?: string | null;
  aboutMe?: string | null;
  photos?: string[];
  photoLocked?: boolean;
  contactNumber?: string | null;
  contactLocked?: boolean;
  isPremiumMember?: boolean;
  partnerPreference?: PartnerPreference | null;
  familyDetails?: FamilyDetails | null;
}

// Profile banate/edit karte waqt jo bhejte hain (id/age backend deta hai, wo nahi bhejte).
export type ProfileInput = Partial<
  Omit<Profile, "id" | "age" | "photoLocked" | "contactLocked">
>;

export interface PartnerPreference {
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  preferredCaste?: string;
  preferredCity?: string;
  notes?: string;
}

export interface FamilyDetails {
  fatherName?: string;
  fatherStatus?: string;
  motherName?: string;
  motherStatus?: string;
  totalBrothers?: number;
  marriedBrothers?: number;
  totalSisters?: number;
  marriedSisters?: number;
  familyValues?: string;
  familyIncome?: number;
  nativePlace?: string;
}

// Bheja/mila interest.
export interface Interest {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  fromUser?: InterestUser;
  toUser?: InterestUser;
}

interface InterestUser {
  id: string;
  profile?: { name: string; photos: string[] };
}

// Membership plan (price paise me aata hai backend se).
export interface Plan {
  id: string;
  name: string;
  pricePaise: number;
  discountPercent: number;
  finalPricePaise: number;
  durationDays: number;
  isActive?: boolean;
}

// User ka premium status.
export interface Membership {
  isPremium: boolean;
  subscriptionExpiresAt: string | null;
}

// ---------- Admin panel ke types ----------

// Admin dashboard ki ginti.
export interface AdminStats {
  total: number;
  premium: number;
  pending: number;
  blocked: number;
}

// Admin users list me ek user.
export interface AdminUser {
  id: string;
  phone: string;
  role: Role;
  isApproved: boolean;
  isBlocked: boolean;
  isPremium: boolean;
  createdAt: string;
  profile: { name: string; city: string | null; gender: string } | null;
}
