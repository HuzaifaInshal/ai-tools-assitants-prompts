# Task

You will be provided with static Tailwind HTML pages your job will be to convert into the provided Next.js routes and features.

Refer to project structure and conventions from `./agent_docs/project-structure.md`.

---

# Core Goal

Transform static HTML into a **dynamic, responsive layout** using grids and flexboxes. Preserve the original layout structure where possible, but upgrade HTML elements to semantic/native equivalents and replace custom UI with radix components (sheet, select, dropdown, modal, etc.).

---

# Rules

Structure: one component per file · prefer `/components/ui` reusable components; only create new if none fit in the same folder · for multi-variant components (e.g. Button), extend existing variants before adding new ones.  
Styling: group similar classes with `cn()` · no Tailwind built-in colors — use `globals.css` variables, add missing ones there · avoid hardcoded sizes (`w-[400px]`), prefer Tailwind scale (`w-96`). if encountered any place for image then · add global styles (ui based that can be used across entire web) in `/styles/ui`
Assets: SVG icons → find `lucide-react` equivalent; if none exists, extract SVG into its own component file.

# Html Markups and Routes

# Relevant Colors
