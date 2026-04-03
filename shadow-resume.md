# Shadow Resume — Mitch Bozentka

> Last updated: 2026-04-01

The goal: reframe my actual work history into a consulting portfolio that positions me as someone who builds AI workflow systems for small service businesses — not a golf instructor who codes on the side.

---

## The One-Paragraph Pitch

I build AI-powered business systems for small service companies. For the last two years, I've used my day job — running operations at a university golf club — as a live testing ground. I automated my own financial pipeline, built lead capture systems for CPA firms, deployed an autonomous AI agent with its own Lightning wallet, and shipped 10+ production apps. I'm a full-stack developer (React, Node, Supabase, PostgreSQL) who also runs a Bitcoin full node and builds Lightning Network tools. I'm looking for a role where I do this for other people's businesses, Monday through Friday.

---

## Portfolio Inventory

### Tier 1: Lead With These

**1. Personal Financial Operating System (FINos)**
- Automated investment dashboard pipeline — one command pulls Fidelity CSV exports, fetches live BTC price via Strike API, generates Chart.js + React/Recharts dashboards
- Monthly financial analysis engine — Python script that parses transactions, compares against budget targets, calculates true savings rate including hidden savings (401k, DCA)
- Spending analytics dashboard (React/JSX)
- Strike API integration for live BTC + USD balance tracking
- Cold storage transaction logging
- Master transaction ledger with deduplication logic
- **Stack:** Python, React, Chart.js, Recharts, Vite, Strike API, Fidelity CSV pipeline
- **Maturity:** Production for personal use. Runs regularly. Real data flowing through it.
- **Case study frame:** "Financial Intelligence System" — automated pipeline that ingests bank exports, fetches live asset prices via API, calculates true savings rate, and generates interactive dashboards. Real-time portfolio visibility. Monthly analysis in seconds instead of hours.

**2. CPA Lead Capture Automation (CPACRM)**
- Contact form → auto-reply email + notification system (Vercel serverless + Resend)
- Prospect research pipeline — 100+ businesses scraped, tiered, scored by pain signals from Google reviews
- Outreach intelligence sheets with review-backed opening lines
- 3-tier productized service offering designed and priced ($500-750/mo entry)
- Roleplay-tested objection handling
- **Stack:** Node.js, Vercel Serverless Functions, Resend, static HTML
- **Maturity:** Demo built and deployable. Not yet deployed to a real client. Prospect lists built but outreach not started.
- **Case study frame:** "Lead Capture Automation for Professional Services" — 43% of small firms automate less than 25% of their processes. Most miss leads because nobody answers the phone or responds to the contact form for 48+ hours. Zero-cost stack (Vercel + Resend free tiers). Under $500/mo to implement.

**3. OpenClaw — Autonomous AI Agent on VPS**
- AI agent running on a VPS with its own Bitcoin Lightning wallet via Nostr Wallet Connect
- Agent has a budget and autonomously pays for its own API calls over Lightning
- Live and running as of 2026-04-01
- **Stack:** OpenClaw, VPS, Nostr Wallet Connect, Lightning Network
- **Maturity:** Running in production right now.
- **Case study frame:** "Self-Funding AI Agent Infrastructure" — a working implementation of autonomous agent economics. Machine-to-machine payments over Lightning. Most people are writing blog posts about this theoretically. I have one running.
- **Why this matters:** Bridges AI and Bitcoin/Lightning — the two target worlds. Demonstrates L402-adjacent protocol knowledge, agent architecture, and infrastructure deployment.

**4. bozentka.com — Personal Site**
- Next.js 14 + Tailwind + TypeScript, deployed on Vercel
- Projects page showcasing 7+ apps
- Blog infrastructure (MDX), newsletter signup (Beehiiv), contact form
- Schedule page (Google Calendar embed), Nostr integration, Bitcoin node status page
- **Maturity:** Live and deployed. Currently leads with "PGA Golf Professional" — needs reframe to lead with builder identity.

### Tier 2: Strong Supporting Evidence

**5. Bitcoin/Lightning Projects (15+ apps)**
- **Mempool.radio** — live sonification of the Bitcoin mempool. Steel drums for every broadcasted transaction. Deployed on Vercel.
- **Unspent** — UTXO tracker/visualizer. Deployed.
- **Bitcoin Retirement Planner** — DCA strategies, declining-CAGR modeling, withdrawal approaches
- **Bitcoin Standard Financial Model** — Strike fee tiers, scenario modeling, cost-basis tracking
- **Longhorn Ledger** — Strokes Gained calculator (Supabase + Next.js). Deployed.
- **Lightning POS** — Lightning Network point-of-sale system (Vite + React)
- **Fortuna, Stock-Swiper, stockchart, horizon60, BTCsim, wealth_app** — various finance tools
- **Stack across all:** React, Vite, Next.js, Supabase, TypeScript, Tailwind
- **Maturity:** Several deployed on Vercel. Others are local working builds.

**6. AI Workflow Architecture (MPBos)**
- Skill-based AI system with persistent memory, automated daily briefings, financial analysis triggers, schedule imports, and structured reflection workflows
- Google Workspace CLI integrations — Gmail, Calendar, Drive automation
- Trigger.dev background job automation (active development)
- **Case study frame:** A working model for how AI agents should integrate into a small business's daily operations. Not a chatbot — a system.

**7. Technical Analysis Tool**
- Python-based stock/crypto analyst with data fetching, technical indicators, news sentiment analysis, and synthesis
- **Stack:** Python, Alpha Vantage API
- **Maturity:** Working locally.

**8. Telegram Bots**
- PhilliesBot, bill_w_bot — Node.js bots
- (Note: The Rex/AI Elite Team multi-agent system never worked out. Don't reference it.)

### Tier 3: Business Operations Evidence

**9. Op36 Curriculum Automation** — Video transcriber for coaching content, program documentation system

**10. Fitting Days** — Club fitting reference tool for golf shop (HTML, internal tool)

**11. Lesson CRM** — React-based student management with email templates

**12. LeadFinder** — Business lead scraping tool (Excel outputs, Austin area)

---

## Skills Inventory

**Full Stack Development**
- React, Next.js, Node.js, TypeScript, Tailwind CSS
- Supabase, PostgreSQL
- Vite, Chart.js, Recharts
- Vercel deployment + serverless functions
- Python (data analysis, automation scripts)

**AI & Automation**
- Claude Code, Claude API (Anthropic)
- Google Gemini ecosystem
- Trigger.dev (background job scheduling)
- OpenClaw (autonomous agent framework)
- AI skill/memory architecture design
- Google Workspace CLI automation (Gmail, Calendar, Drive)

**Bitcoin & Lightning**
- Bitcoin Core full node (running, transaction verification + broadcasting)
- Lightning Network — L402 protocol, Nostr Wallet Connect
- Strike API integration (balances, rates, deposits)
- Breez SDK knowledge
- UTXO management, DCA modeling, cost-basis tracking

**Business & Consulting**
- Prospect research and scoring methodology
- Productized service design (3-tier pricing)
- Objection handling from roleplay testing
- Small business pain point analysis (CPA, law, home services verticals)

---

## Gap Analysis

### Gap 1: Zero deployed client work
Everything is for myself. The CPA automation is a demo, not a case study. One deployed project for a real business changes everything. A freelancer with one client project beats a builder with 20 personal projects.

### Gap 2: bozentka.com tells the wrong story
Currently says "PGA Golf Professional & Independent Developer." Philosophy section says "Vibe coding for fellow golf professionals." Featured project is Swingstr (golf swing analysis). Needs to lead with the builder identity.

### Gap 3: No public writing
Deep knowledge about AI workflows, Bitcoin infrastructure, small business automation. None of it written down publicly. Blog infrastructure exists but appears empty. Writing is how you build credibility without clients.

### Gap 4: GitHub needs context
Repos exist but without READMEs, screenshots, and context, a hiring manager skimming won't understand what they're looking at. Deployed Vercel apps help but someone needs to connect the dots.

### Gap 5: LinkedIn hasn't been reframed
Still reads as golf professional. Every recruiter and potential client checks LinkedIn first.

### Gap 6: No network in the target space
Know golf people. Need to know people in Austin's tech/Bitcoin/AI scene. One warm intro is worth 50 cold emails.

---

## 90-Day Action Plan

### Month 1: Get One Real Client (Weeks 1-4)

This is the only thing that matters right now.

1. **Deploy the CPA contact form automation for a real business.** Pick one from the prospect list. Offer it free or at cost. Frame it as: "I built this, I want to test it on a real firm, no risk to you, I'll set it up and maintain it for 90 days free."
2. **Run the mystery shopper test.** Send inquiry emails to 10-15 CPA firms. Slow responders become pitch targets. Already planned — execute it.
3. **Document everything.** Before/after response times. Screenshot the automation. Get a quote from the owner. This becomes Case Study #1.

### Month 2: Reframe the Public Identity (Weeks 5-8)

4. **Rewrite bozentka.com.** Lead with "I build AI workflow systems for small businesses." Golf becomes one line in the bio. Projects page leads with FINos and CPA automation, not Swingstr.
5. **Write 3 blog posts:**
   - "How I automated my entire financial life with Python and APIs" (FINos story)
   - "Why small service businesses are leaving money on the table" (CPA research)
   - "What running a Bitcoin full node taught me about building systems" (bridges BTC + builder)
6. **Update LinkedIn.** Headline: "AI Workflow Automation | Full-Stack Developer | React, Node.js, Supabase." Reframe UT Golf Club as "Built and deployed AI-powered business tools while managing operations for a university athletic facility."
7. **Clean up GitHub.** READMEs with screenshots for top 5 repos. Pin the best ones.

### Month 3: Build Pipeline (Weeks 9-12)

8. **Expand beyond CPA.** Prospect research already covers law firms, home services, bookkeeping. With one case study, start outreach to 2-3 new verticals.
9. **Get into Austin Bitcoin/tech scene.** Meetups, happy hours, Bitcoin Park Nashville if possible. Need 3-5 people who know what I build.
10. **Consider Anthropic certification.** Claude Certified Architect exam guide is already downloaded. "Anthropic-certified" + "builds real systems with Claude Code" is a differentiator for AI consulting.
11. **Price the first paid engagement.** Based on learnings from the free deployment. CPACRM docs already have the $500-750/mo tier — validate or adjust based on real feedback.

---

## The Framing

The golf job isn't a liability — it's an asset if framed right. "I used a real service business as my R&D lab" is a better origin story than "I learned to code at a bootcamp." But the framing has to be intentional. Right now the public presence tells the golf story. It needs to tell the builder story.

On the surface I look like a golf instructor. The real story is that I've spent two years building production AI systems, shipping apps, and deploying autonomous agents with their own Lightning wallets. The golf job was the lab. Now I'm ready to do this for real.
