# Product Requirements Document (PRD)

**Product Title:** Internal Reference & Employment Validation Tool (Open Source Edition)

**Owner:** [Hiring/HR Operations Team / Open Source Maintainers]

**Purpose:**
To build an internal tool that allows hiring teams to collect, verify, and assess references and employment history of job candidates. This tool aims to ensure that candidates:

1. Provide credible referees.
2. Have factual employment history.
3. Are not employed in overlapping roles.
4. Have exited past roles professionally and ethically.
5. Have not made false claims about their achievements or responsibilities.

**Scope:**
This tool is for internal use but will be designed as an open source project so that other organizations can self-host and benefit from it. Core features will be modular, privacy-respecting, and documented to support community contribution and usage.

---

## 1. User Personas

**a. Hiring Manager / Recruiter**
- Views submitted references
- Assesses integrity and employment validation results

**b. Candidate**
- Authenticates using LinkedIn OAuth (via Clerk or other pluggable provider) before submission
- Submits prior employment details, referees, and self-declared achievements
- Cannot access the internal portal; views only the submission form

**c. Referee**
- Receives structured form and submits reference for candidate
- Link to referee form is manually sent by HR

**d. Admin (Internal Tool Access)**
- Internal HR team member with access to the admin dashboard

**e. Open Source Contributor/User**
- Installs, configures, and deploys their own version of the tool
- Can customize integrations and authentication methods
- Contributes to core or plugin development via GitHub

---

## 2. Key Features

### 2.1 Candidate Submission Module
- Candidate authenticates via LinkedIn OAuth using Clerk or community-contributed alternatives
- Form to input past employers, job titles, dates of employment
- Upload supporting documents (CV, pay slips, offer letters if needed)
- Add referee details (name, role, company, email)
- List key achievements or responsibilities claimed by the candidate
- After submission, the candidate cannot return to view or edit the portal

### 2.2 Referee Validation
- System checks referee email domain against stated employer
- Auto-flags free domains (e.g., Gmail) unless manually approved
- LinkedIn cross-verification (optional)

### 2.3 Reference Form (Sent to Referee)
- HR manually sends referee form link to each referee
- Standardized questions:
  - What was your working relationship with the candidate?
  - What was their role and duration of employment?
  - Would you rehire this candidate?
  - Did they return all company property?
  - Did they leave on good terms and act with integrity?
  - Do the candidate's listed achievements align with their actual responsibilities?
  - Any concerns about professionalism, behavior, or conduct?
- Optional open comments field

### 2.4 AI Summary & Scoring
- Summarize references using OpenAI or other pluggable NLP API
- Generate 4 scores:
  - Credibility Score (Is the referee relevant and verified?)
  - Integrity & Exit Score (Did they leave on good terms?)
  - Achievement Validation Score (Did the referee confirm the candidate's claimed impact?)
  - Rehire Score (Would the referee rehire them?)

### 2.5 Dual Employment Risk Check
- Candidate states current employment status
- Uploads optional proof (paystub, bank screenshot)
- LinkedIn profile parsing (for date overlap, multiple jobs)
- Flag if:
  - Currently employed full-time elsewhere
  - Inconsistent LinkedIn / self-declaration

### 2.6 Dashboard for Hiring Manager
- Candidate snapshot:
  - Employment timeline with verification results
  - Reference summaries and scores
  - Claimed achievements and referee validation
  - Flags (e.g., unverifiable referee, overlapping jobs, unverified claims)
- Status tracker: Pending, In Review, Completed

---

## 3. Non-Functional Requirements

- Candidate-facing form is isolated; no portal access post-submission
- OAuth pluggability (default Clerk; allow community to contribute others)
- Referee link manually distributed by HR
- Admin dashboard restricted to internal HR team
- All forms and data encrypted at rest and in transit
- Referee link expires in 7 days; resend option available
- Audit trail for all form submissions and edits
- Modular configuration via `.env` or admin panel for ease of deployment

---

## 4. Tech Stack (Suggested)

- **Frontend:** Next.js + Tailwind
- **Backend:** Supabase or Firebase
- **Email:** Resend or Postmark
- **AI/NLP:** OpenAI API (optional override)
- **OAuth:** LinkedIn via Clerk (or configurable alternative)
- **Optional Integrations:** Clearbit, Hunter.io
- **Hosting:** Vercel, Netlify, Railway, or Docker
- **Open Source Hosting:** GitHub with MIT License or equivalent

---

## 5. Timeline

- Week 1-2: Design UI/UX, database schema
- Week 3-4: Candidate submission with OAuth and referee form
- Week 5: AI summarization + scoring
- Week 6: Dashboard and access controls
- Week 7: Open source documentation and launch

---

## 6. Success Criteria

- 100% of candidates have referee responses within 3 days
- > 90% of referees are from credible domains
- Ability to flag dual employment in >50% of risky cases
- Hiring manager reports >80% satisfaction using summary dashboard
- At least 75% of candidate achievements are confirmed by referees or flagged
- Open source project receives 10+ deployments or forks within first 3 months

---

## 7. Future Considerations (Post-MVP)

- Peer flagging system for integrity post-hire
- Background check integrations (e.g. Certn, Checkr)
- Slack/Email alerts for flagged references
- Auto-scheduling reference calls if needed
- Plugin system for NLP scoring
- Multilingual support
- Admin role management and audit exports

---

## 8. Developer Experience & Open Source Contribution

- Include a `CONTRIBUTING.md` with setup, code style guide, and pull request instructions
- Provide `.env.example`, mock data, and seed scripts to enable quick local setup
- Modularize key logic such as `authProvider.ts` and `nlpProvider.ts` for easy substitution
- Use GitHub Actions for linting, testing, and preview deployment
- Document deployment paths for Vercel, Netlify, and Docker in `/docs/deploy.md`
- Label issues with `good first issue`, `help wanted`, and `bug` to promote community engagement
- Maintain a roadmap and changelog for contributors 