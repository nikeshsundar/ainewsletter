# AI Personal Digest (AI-Powered Newsletter SaaS)

This is a complete, production-ready SaaS application built with **Next.js 14 (App Router)** and **Tailwind CSS**. It allows users to subscribe with their email and select interest topics to receive a daily personalized news digest written by AI (OpenAI GPT-4o-mini) based on fresh search results (GNews API), sent using Resend, and scheduled with Vercel Cron Jobs.

---

## 📁 Project Structure

```text
/
├── app/
│   ├── api/
│   │   ├── send-newsletter/
│   │   │   └── route.ts        # Cron endpoint: fetches news -> writes digest -> sends emails
│   │   └── subscribe/
│   │       └── route.ts        # Saves/updates subscriber email and selected topics in Supabase
│   ├── layout.tsx              # Root HTML template, metadata, and fonts
│   └── page.tsx                # Premium landing page with hero banner & features
├── components/
│   └── SubscribeForm.tsx       # Subscription form client component (with validation & success states)
├── lib/
│   ├── fetchNews.ts            # Queries GNews API with caching to save API quota
│   ├── generateNewsletter.ts   # Connects to OpenAI and uses GPT-4o-mini to draft digests in HTML
│   ├── sendEmail.ts            # Envelopes newsletter in responsive CSS template and sends via Resend
│   └── supabase.ts             # Initialises Supabase clients (standard & bypass-RLS admin)
├── .env.local                  # Local environment configuration keys (git-ignored)
├── schema.sql                  # Supabase database schema for the subscribers table
├── vercel.json                 # Vercel Cron Job configuration scheduler
└── package.json                # Project dependencies and run commands
```

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 14 (App Router, TypeScript)
*   **Styling**: Tailwind CSS & Lucide Icons
*   **Database**: Supabase (PostgreSQL)
*   **News Ingestion**: GNews API
*   **AI Writing**: OpenAI API (GPT-4o-mini model)
*   **Delivery Service**: Resend
*   **Scheduler**: Vercel Cron Jobs

---

## 🚀 Setup & Local Installation

### 1. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com) and open your project.
2. Navigate to the **SQL Editor** -> click **New Query**.
3. Paste the contents of `schema.sql` (found in the root folder) and run the script:
   ```sql
   -- Create subscribers table
   CREATE TABLE subscribers (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     topics TEXT[] NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
     is_active BOOLEAN DEFAULT true NOT NULL
   );

   -- Enable Row Level Security (RLS)
   ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow public inserts
   CREATE POLICY "Allow public insert of subscriptions" 
   ON subscribers FOR INSERT WITH CHECK (true);
   ```

### 2. Configure Environment Variables
Create or edit the `.env.local` file in the root folder with the following variables:

```env
# GNews API Key
NEWS_API_KEY=4ece2ed448b597aa823b10796b4ce0bd

# Resend API Key
RESEND_API_KEY=re_68FMZ5Vs_CpXVAW7gffqgVbNG86NsvQz2

# OpenAI API Key
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Vercel Cron Secret (for local request authentication testing)
CRON_SECRET=super_secret_local_cron_token
```

### 3. Run Development Server
Install dependencies and run the development environment:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page.

---

## 🧪 Testing the Application

### 1. Test Subscriber Form
*   Open the landing page in a browser.
*   Type your email, check 2 or 3 topics, and hit **Subscribe for Free**.
*   A success card should confirm your registration. Check your Supabase database table `subscribers` to confirm the row has been added.

### 2. Manual End-to-End Delivery Pipeline Test
You can trigger a dry-run test of the GNews -> GPT-4o-mini -> Resend pipeline directly by hitting the newsletter API endpoint with test flags. Make sure your local server is running, then open this URL in your browser:
```http
http://localhost:3000/api/send-newsletter?test=true&test_email=your-verified-email@domain.com&topics=AI,Tech,Science
```
*   *Replace `your-verified-email@domain.com` with the email connected to your Resend account (or verified domain).*
*   The page will return a JSON summary showing a successful delivery, and you should receive a beautifully styled HTML newsletter in your inbox shortly.

---

## ☁️ Vercel Deployment

1. Commit all files to a repository on GitHub.
2. Create a new project on Vercel and import your repository.
3. Add all variables listed in your `.env.local` to Vercel's **Environment Variables** panel.
4. Deploy the project.
5. Vercel reads `vercel.json` and automatically sets up a daily cron job scheduled for **7 AM IST / 1:30 AM UTC** calling the `/api/send-newsletter` endpoint.
