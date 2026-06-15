import { z } from "zod";

// Profile form ki validation. Har field ka apna rule taaki galat data na jaye.
// Jaise: naam me sirf akshar, height/weight number range me, job title me number na chale.

// Sirf akshar aur space (number/symbol nahi) — naam, sheher, education jaise fields ke liye.
const onlyLetters = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `${label} must be at least 2 characters`)
    .regex(/^[A-Za-z\u0900-\u097F\s.]+$/, `${label} can only contain letters`);

export const profileSchema = z.object({
  name: onlyLetters("Name").max(100),

  gender: z.enum(["MALE", "FEMALE"], { errorMap: () => ({ message: "Please select gender" }) }),

  // Date of birth — khaali na ho, aur umar 18 se 80 ke beech ho.
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => {
      const age = (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18 && age <= 80;
    }, "Age must be between 18 and 80 years"),

  motherTongue: onlyLetters("Mother tongue").max(50),

  caste: onlyLetters("Caste").max(50),

  // Gotra ab zaroori hai (optional nahi).
  gotra: onlyLetters("Gotra").max(50),

  // Height cm me — 120 se 250 ke beech.
  height: z.coerce
    .number({ invalid_type_error: "Height is required (in cm)" })
    .min(120, "Height must be between 120 and 250 cm")
    .max(250, "Height must be between 120 and 250 cm"),

  // Weight kg me — 30 se 200 ke beech.
  weight: z.coerce
    .number({ invalid_type_error: "Weight is required (in kg)" })
    .min(30, "Weight must be between 30 and 200 kg")
    .max(200, "Weight must be between 30 and 200 kg"),

  education: onlyLetters("Education").max(100),

  // Job title zaroori, aur sirf akshar (12 jaisa number na chale).
  jobTitle: onlyLetters("Job title").max(100),

  // Company zaroori, kam se kam 2 akshar.
  companyName: z.string().trim().min(2, "Please enter a valid company name").max(100),

  state: onlyLetters("State").max(50),

  city: onlyLetters("City").max(50),

  // Annual income zaroori, 0 se zyada number.
  annualIncome: z.coerce
    .number({ invalid_type_error: "Income is required (numbers only)" })
    .min(0, "Please enter a valid income"),

  // Ye optional hain (dropdown se aate hain, khaali ho sakte hain).
  maritalStatus: z.string().optional(),
  religion: z.string().optional(),
  manglikStatus: z.string().optional(),
  diet: z.string().optional(),
  professionType: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
