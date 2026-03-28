# Task

Convert the provided static Tailwind HTML page into the following Next.js routes:

[page routes]

Refer to project structure and conventions from `./agent_docs/project-structure.md`.

---

# Core Goal

Transform static HTML into a **dynamic, responsive layout** using grids and flexboxes. Preserve the original layout structure where possible, but upgrade HTML elements to semantic/native equivalents and replace custom UI with shadcn components (sheet, select, dropdown, modal, etc.).

---

# Rules

Structure: one component per file · full Tailwind classes in `/components/ui` only, not in feature components · prefer `/components/ui` reusable components; only create new if none fit · for multi-variant components (e.g. Button), extend existing variants before adding new ones.  
Styling: group similar classes with `cn()` · no Tailwind built-in colors — use `globals.css` variables, add missing ones there · avoid hardcoded sizes (`w-[400px]`), prefer Tailwind scale (`w-96`). if encountered any place for image then
Assets: SVG icons → find `lucide-react` equivalent; if none exists, extract SVG into its own component file.  
Installs: use `pnpm dlx shadcn add <>` for any shadcn component, never create the file manually.

# Html Markups

# Relevant Colors
