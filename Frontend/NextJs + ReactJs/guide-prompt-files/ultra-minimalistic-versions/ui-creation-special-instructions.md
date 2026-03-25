# Special Instructions version A

- Classes: `cn()` grouping · no hardcoded sizes (`w-96` not `w-[400px]`) · full classes in `ui/` components only
- Colors: globals.css only — add missing colors there, never use Tailwind built-ins
- Components: prefer `shadcn` (`pnpm dlx shadcn add <>`) → `/components/ui` → new component as last resort
- Icons: `lucide-react` · Images: add placeholder + tell me the `public/` path · One component per file

# Special Instructions version B

Styling: use `cn` for grouping classes · no Tailwind built-in colors (use `globals.css`, add missing ones there) · no hardcoded sizes like `w-[400px]`, prefer utility scale equivalents · UI must be responsive.  
Components: prefer shadcn (`pnpm dlx shadcn add <>`) → then `/components/ui` → only create new if neither fits · full Tailwind classes belong in `ui` components, not feature components · keep each component in its own file.  
Misc: icons via `lucide-react` · if an image is needed, place it in code and tell me the exact `public/` path to add it.
