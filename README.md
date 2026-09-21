# Hasini's birthday invitation

A 3D, animated birthday invitation built with Next.js, three.js and Motion.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
```

## What to edit

| I want to change | File |
| --- | --- |
| Party date, venue, menu, who it is from | `src/lib/invite.ts` |
| Any photo or the 3D cake model | `src/lib/assets.ts` |

Add `?to=Name` to the URL to greet a specific guest ("Riya, Hasini is turning...").

## Layout

```
assets/originals/        full-size source images (not served)
public/
  models/cake.glb        3D cake
  photos/
    hasini/              portrait.png (hero) and frame-1..5.webp (3D photo graph)
    dishes/              chicken biryani, egg rice, non-veg
    group/friends.jpeg   polaroid
src/
  app/                   layout, page (section order), global styles
  lib/                   invite.ts (text/date) and assets.ts (files)
  components/
    sections/            Hero, Marquee (crossed tapes), InviteCard, Feast, Cake,
                         PhotoGraph, Polaroid
    fx/                  Intro, Confetti, Balloons3D, Bling (crown + sash), Spices,
                         SplitText, Reveal, ScrollBar
```

The page reads top to bottom in `src/app/page.tsx`.
