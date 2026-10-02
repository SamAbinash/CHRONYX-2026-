# CHRONYX 2026 - Official Symposium Website & Registration Flow

**AI & Data Science Symposium**  
Organized by the **Department of Artificial Intelligence and Data Science**,  
**Jaya Sakthi Engineering College**, Thiruninravur – 602024, Thiruvallur District, Tamil Nadu.  
**Date:** 10-10-2026 | **Starting Time:** 9:00 A.M | **Venue:** College Campus  
**Theme:** *INNOVATE – ANALYZE – AUTOMATE*

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📝 Complete Registration Flow

### 1. Registration Entry Points
The registration section is directly accessible from:
- **Navbar:** "Register Pass" button (desktop & mobile menu drawer)
- **Hero:** "Register Now" primary CTA button
- **Event Cards:** "Register" button on all 10 event cards (pre-selects the event in the form)
- **Event Details Modal:** "Register" button inside event details popup
- **Floating Action Button:** "Register Pass" quick-access trigger
- **Footer:** "Register Pass" navigation link

### 2. Registration Form Sections
The form is organized into clean, intuitive step sections:
1. **Participant Details:**
   - Full Name *
   - Email *
   - Mobile / WhatsApp Number * (10-digit validation)
   - College / Institution *
   - Department *
   - Year of Study * (I, II, III, IV Year)
2. **Event Selection:**
   - Categories: Technical & Non-Technical
   - 9 Technical Events (Mystery Code, Datathon, DeepFake Detection, Project Expo, Vibe Coding, Spider Building, Tool Finder, Visual Cipher, Mind Matrix)
   - 1 Non-Technical Event (E-Sports)
   - Active event badge indicators with one-click remove option
   - **Team / Member Details:** Flexible member addition without invented size restrictions. Allows entering Team Name, adding individual teammates (Name, Email, Mobile), and providing flexible notes.
3. **Payment Section:**
   - Heading: **PAYMENT**
   - Subtext: *"Scan the official UPI QR to complete payment."*
   - Placeholder Box: **OFFICIAL UPI QR WILL BE ADDED HERE** (no fake credentials/amounts)
   - Fields:
     - Transaction ID / UTR * (validated for length and non-empty)
     - Payment Screenshot * (validated for image file formats: PNG, JPG, JPEG, WEBP; live thumbnail preview)
     - Display: *"Please upload a clear screenshot of your successful payment."*
4. **Declaration:**
   - Checkbox *: *"I confirm that the information provided is correct."*
5. **Submit:**
   - Button: **SUBMIT REGISTRATION**
   - Full client-side validation prevents empty/invalid submissions.

### 3. Success Screen
Upon valid submission:
- Celebratory confetti animation triggers.
- Transitions to dedicated **REGISTRATION SUBMITTED** screen.
- Message: *"Your CHRONYX 2026 registration has been submitted successfully."*
- Generates a sequential demo Registration ID: `CHX26-0001`, `CHX26-0002`, `CHX26-0005`, etc.
- Displays:
  - Registration ID
  - Participant Name
  - Selected Event(s)
  - Payment Status: **Payment Verification Pending**
- Actions:
  - **Save Registration Details** (opens print/save view)
  - **Check Verification Status** (scrolls to status terminal and pre-fills ID)
  - **Back to Home**

### 4. Check Status Integration
- Connected to `localStorage` store.
- Search by **Registration ID** (e.g., `CHX26-0005` or sample test IDs `CHX26-0001` to `CHX26-0004`).
- Statuses:
  - `Payment Verification Pending` (default for new submissions)
  - `Submitted`
  - `Confirmed`
  - `Rejected`
- Displays Participant Name, Selected Events, Institution, and verification timestamp.
