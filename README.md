# Matrimonial Frontend (Web) — Var Kanya Parichay Kendra

Next.js + TypeScript + Tailwind CSS

## Run karne ke steps (VS Code)

1. Is folder ko VS Code me kholo (File > Open Folder)
2. Terminal kholo (Ctrl + ~)
3. Commands chalao:

```bash
npm install --legacy-peer-deps   # saare packages (ek baar, 1-2 min)
npm run dev      # http://localhost:3000
```

## Zaroori
- Backend chalu hona chahiye: http://localhost:8000
- API URL .env.local me set hai (NEXT_PUBLIC_API_URL=http://localhost:8000)

## Naya kya hai
- Saara code ab type-safe hai (kahin bhi 'any' nahi)
- Comments simple Hindi me
- Admin panel:
  - Make Admin / Remove Admin (sirf super admin ko dikhta hai)
  - Add Profile (admin khud member ka profile banaye) -> /admin/add-profile
  - Manage Plans (price/discount bina code badlo) -> /admin/plans
- My Profile: zaroori field khaali ho to niche "required", save par "saved successfully"
- Har list pe skeleton loading, button par loading wheel, error par toast

## Build (production)
```bash
npm run build
npm start
```
