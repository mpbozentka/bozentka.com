# GEMINI.md - Project Context & Source of Truth

## Background
**Mitch Bozentka**, PGA Professional and Independent Developer. Assistant Golf Professional at UTGC.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Content:** MDX
- **Deployment:** Vercel
- **Integrations:** Beehiiv API

## The Sovereign Pro Newsletter
A hybrid resource for golf professionals focused on building digital assets, technical development, and personal wealth tracking.

## Active Projects
- **Swingstr:** Full-Stack golf swing analysis software.
- **Longhorn Ledger:** In-round Strokes Gained calculator for UTGC.
- **Mempool.radio:** A sonified, real-time Bitcoin visualizer.
- **Vault:** Centralized financial source of truth.

## Brand Identity (bozentka.com)
### Aesthetic
High-Contrast Editorial. Clean, spacious, and sophisticated with a "Builder" edge.

### Color Palette
- **Brand Orange:** `#F26522` (Primary CTAs and accents)
- **Deep Navy/Black:** `#0F172A` (Primary serif headings)
- **Neutral Gray:** `#64748B` (Subheadings and metadata)
- **Background:** `#FFFFFF` (Light mode) / `#F8FAFC` (Card backgrounds)

### Typography
- **Headings:** Elegant, high-contrast Serif (e.g., Playfair Display) for a "Long-form Essay" feel.
- **UI/Labels:** Clean, geometric Sans-serif (e.g., Inter or Geist) for technical clarity.

### Tone
High-agency, technical, philosophical, and professional.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
