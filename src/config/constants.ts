// App-wide constants. API URL env se (web: localhost:8000, prod: real domain).
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Search filter options (dropdowns ke liye).
export const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist"];
export const MARITAL_STATUS = [
  { value: "NEVER_MARRIED", label: "Never Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "AWAITING_DIVORCE", label: "Awaiting Divorce" },
];
export const PROFESSION = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "BUSINESS", label: "Business" },
  { value: "PRIVATE", label: "Private" },
  { value: "NOT_WORKING", label: "Not Working" },
];
export const MANGLIK = [
  { value: "MANGLIK", label: "Manglik" },
  { value: "NON_MANGLIK", label: "Non-Manglik" },
  { value: "ANSHIK_MANGLIK", label: "Anshik Manglik" },
  { value: "DONT_KNOW", label: "Don't Know" },
];
export const DIET = [
  { value: "VEG", label: "Vegetarian" },
  { value: "NON_VEG", label: "Non-Vegetarian" },
  { value: "EGGETARIAN", label: "Eggetarian" },
];
