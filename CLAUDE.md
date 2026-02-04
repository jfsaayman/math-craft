# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Development server on port 5000
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview production build
npm run check    # TypeScript type checking
```

## Architecture

This is a client-side PWA built with React and Vite. All data is stored in localStorage.

### Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Shadcn UI (New York style), Wouter for routing
- **PWA**: vite-plugin-pwa with Workbox for offline support
- **Build**: Vite builds static files to `dist/`

### Project Structure
```
client/src/
├── pages/           # Route components (Home, Game, Collection, UserSelection)
├── components/ui/   # Shadcn UI components
├── components/game/ # Game-specific components (Keypad)
├── lib/
│   ├── game-logic.ts  # Problem generation for multiply/divide/add/subtract
│   └── storage.ts     # LocalStorage API with multi-user support
└── hooks/           # Custom React hooks
```

### Path Aliases
- `@/*` → `client/src/*`

### Data Flow
- Game state and user data are stored in localStorage (client-side)
- Multi-user support via `getCurrentUser()` / `setCurrentUser()` in `storage.ts`
- Users are hardcoded: Jake and Jeanie (defined in `USERS` array in `storage.ts`)

### Game Logic
The `game-logic.ts` module generates math problems with these rules:
- Operations: multiply, divide, add, subtract
- Selected tables determine one operand (1-12)
- For tables < 11, the second operand is capped at 10
- Division/subtraction ensure integer positive results

### Styling
- Pixel art aesthetic
- Custom pixelated font via `font-display` class
- Pixel shadow effects: `shadow-[4px_4px_0_...]`

### PWA Features
- Offline support via service worker
- Installable on mobile devices ("Add to Home Screen")
- Caches Google Fonts for offline use
