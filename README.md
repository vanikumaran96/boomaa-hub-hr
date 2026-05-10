# Boomaa HRMS — AI-Powered HR Management Information System

> Hackathon submission · Built with **Lovable** (React + Vite + Tailwind + TypeScript) · Powered by **Lovable Cloud** & **Lovable AI Gateway**

A production-style HR Management Information System for **Boomaa Consultants**, a recruitment & staffing firm. It digitises the entire employee lifecycle — from candidate sourcing to placement billing to monthly payroll — and uses AI to remove the single most time-consuming task in recruitment: **resume screening**.

**Live demo:** https://boomaa-hub-hr.lovable.app

---

## 1. The Problem

Boomaa Consultants (and most mid-sized staffing firms in India) run their operations on a patchwork of Excel sheets, WhatsApp groups and paper files:

- Recruiters manually read **50–200 resumes per role** to shortlist candidates.
- Placement fees, invoices and candidate status live in disconnected spreadsheets.
- Monthly payroll for placed employees requires re-keying attendance, computing payable days, and generating Word payslips one by one.
- Branch managers have **no real-time visibility** into pipeline, revenue or attrition.

Result: senior recruiters spend ~60% of their week on data entry instead of talking to candidates and clients.

## 2. Where AI Adds Leverage (and Where It Doesn't)

| Workflow | AI? | Why |
|---|---|---|
| **Resume ↔ JD matching** | ✅ Yes | Subjective, fuzzy, repetitive — perfect LLM territory. |
| **Structured screening output** (score, matched/missing skills, concerns) | ✅ Yes — function calling | Forces deterministic JSON the UI can render. |
| **Payroll math** (payable days, gross, net) | ❌ No | Pure arithmetic — must be 100% reproducible and auditable. |
| **Invoice / fee calculation** | ❌ No | Client contracts are deterministic (% or flat). AI would only add risk. |
| **Dashboard analytics** | ❌ No | Aggregations belong in code, not a model. |

**Principle:** Use AI for judgement, use code for truth.

## 3. The AI System

A single hardened Edge Function: `supabase/functions/screen-resume`.

```
Resume (PDF/DOCX text) + Job Description
            │
            ▼
   Lovable AI Gateway (google/gemini-2.5-flash)
            │
            ▼
   Tool call: submit_screening({
     matchScore, recommendation,
     matchedSkills[], missingSkills[],
     strengths[], concerns[], yearsOfExperience
   })
            │
            ▼
   Rendered as a recruiter-friendly card in the UI
```

Hardening:
- **JWT-validated** — `supabase.auth.getClaims(token)` rejects unauthenticated calls (401).
- **Input validation** — minimum length checks on resume + JD.
- **Forced structured output** via `tool_choice` so the UI never has to parse free-form text.
- **Graceful 429 / 402 handling** for rate-limit and credit-exhaustion cases.

## 4. End-to-End Modules

| Module | Route | What it does |
|---|---|---|
| **Dashboard** | `/dashboard` | KPIs: headcount, active placements, MTD revenue, pipeline. |
| **Employees** | `/employees` | Directory of working & former staff with bank/PAN/UAN details. |
| **Attendance** | `/attendance` | Per-employee monthly grid (P / L / WO / NA / A). |
| **Payroll** | `/payroll` | Auto-computes payable days from attendance, generates **DOCX payslips** (`docx` + `file-saver`), exports CSV. |
| **Recruitment** | `/recruitment` | Kanban (sourced → interview → placed) + **AI Resume Screener**. |
| **Clients** | `/clients` | Hiring clients, fee structure (flat or %), invoice status. |
| **Invoices** | `/invoices` | Placement ledger with billing status & financial summary. |

A **3-minute Demo Mode** (floating button bottom-right) walks judges through the three flagship flows: AI screening → payslip generation → analytics.

## 5. Tech Stack

- **Frontend:** React 18, Vite 5, TypeScript 5, Tailwind CSS, shadcn/ui, Lucide icons
- **Backend:** Lovable Cloud (Supabase) — Postgres, Auth, Edge Functions (Deno)
- **AI:** Lovable AI Gateway → `google/gemini-2.5-flash` with function calling
- **Docs:** `docx` + `file-saver` for client-side payslip generation
- **Auth:** Supabase email/password with session-based route guards

## 6. Project Structure

```
src/
├── components/
│   ├── AppLayout.tsx          # Auth-guarded shell
│   ├── AppSidebar.tsx
│   ├── ResumeScreener.tsx     # PDF/DOCX upload → AI screening UI
│   └── DemoMode.tsx           # 3-minute guided judge tour
├── pages/                     # One file per module
├── utils/generatePayslipDocx.ts
├── data/sampleData.ts         # Synthetic-style demo data
└── integrations/supabase/     # Auto-generated client (do not edit)
supabase/
└── functions/screen-resume/   # JWT-protected AI edge function
```

## 7. Setup (Local)

Requires Node 18+ and npm.

```sh
git clone <YOUR_REPO_URL>
cd <repo>
npm install
npm run dev
```

The app connects to the hosted Lovable Cloud backend automatically via `.env` (auto-generated — do not edit). No Supabase account or API key required.

## 8. How to Demo (for Judges)

### A. Auth (30 sec)
1. Open the app → you land on the **Sign In / Sign Up** card.
2. Click **Sign Up**, enter any email (e.g. `judge@boomaa.com`) and a password ≥ 8 chars.
3. Switch to **Sign In** and log in. You're now session-authenticated against Lovable Cloud.

### B. AI Resume Screening (60 sec)
1. Go to **Recruitment** → click **AI Screen Resume**.
2. Upload a PDF/DOCX resume (or paste text) and a job description.
3. Watch the edge function return a structured **match score, matched/missing skills, strengths, concerns** in ~3 seconds.

### C. Payroll → DOCX Payslip (45 sec)
1. Go to **Payroll** → pick any month.
2. Review the auto-computed **payable days / gross / net** (derived from the Attendance grid).
3. Click **Download Payslip** on any row → a formatted Word `.docx` is generated client-side.

### D. Pipeline & Revenue (45 sec)
1. **Recruitment** → drag a candidate from *Interview* to *Placed* — an invoice line is created automatically using the client's fee rule.
2. **Invoices** → see the new placement and updated MTD revenue.
3. **Dashboard** → KPIs reflect the change.

### E. Guided Demo Mode
Click the **▶ Demo** button (bottom-right) for an automated 3-minute tour of the above.

## 9. Security Posture

- ✅ Real Supabase authentication (no client-side credential checks)
- ✅ Edge function validates JWT on every call
- ✅ No hardcoded credentials in the bundle
- ⚠️  Sample employee data uses realistic-looking names for demo polish — clearly marked as demo data; not real PII

## 10. What's Next

- Role-based access (`admin` / `branch_manager`) via a `user_roles` table
- Bulk resume screening (parallel function calls with rate-limit backoff)
- Offer-letter generation (mirrors the payslip DOCX pipeline)
- WhatsApp Business API for candidate status nudges

---

**Built in Lovable** · React · Vite · Tailwind · Lovable Cloud · Lovable AI Gateway
