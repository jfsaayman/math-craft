# Product Requirements Document: Math Craft

**Version:** 1.0  
**Last Updated:** February 2026  
**Status:** Current Implementation

---

## Executive Summary

Math Craft is a Progressive Web Application (PWA) that gamifies arithmetic practice for children through an engaging Minecraft-themed interface. The application provides timed math challenges across four operations (multiplication, division, addition, subtraction) and rewards players with collectible Minecraft blocks. Built with React and designed for offline-first mobile experiences, Math Craft supports multiple users and tracks individual progress through localStorage.

### Key Highlights
- **Target Audience:** Children aged 6-12 practicing basic arithmetic
- **Platform:** Browser-based PWA (mobile-first, installable)
- **Core Mechanic:** 60-second timed challenges with streak bonuses
- **Unique Value:** Combines education with collectible rewards and Minecraft aesthetics
- **Data Model:** Client-side only (localStorage), no backend required

---

## Problem Statement

### The Challenge
Children need consistent, engaging practice to master arithmetic fundamentals, but traditional drill methods often feel monotonous and lack immediate rewards. Parents and teachers need tools that motivate independent practice while tracking progress.

### Goals
1. **Engagement:** Make arithmetic practice fun and rewarding through gamification
2. **Flexibility:** Allow customization of difficulty (table selection, operation types)
3. **Progress Tracking:** Provide visibility into performance trends and achievements
4. **Accessibility:** Work offline and be installable on any device with a browser
5. **Multi-User Support:** Enable siblings or classmates to maintain separate progress

---

## User Personas

### Primary Persona: Young Learner (Leo, Age 8)
- **Background:** Elementary school student practicing multiplication tables
- **Goals:** Complete math homework, improve test scores, collect all blocks
- **Pain Points:** Gets bored with worksheets, needs instant feedback
- **Usage Pattern:** 10-15 minute sessions after school, prefers mobile/tablet
- **Motivations:** Visual rewards, beating personal high scores, seeing progress

### Secondary Persona: Supportive Parent (Maria, Age 38)
- **Background:** Parent of two elementary-aged children
- **Goals:** Ensure kids practice regularly, monitor progress, minimize screen fights
- **Pain Points:** Needs multi-user support, wants educational content, limited supervision time
- **Usage Pattern:** Sets up accounts, checks stats weekly
- **Motivations:** Educational value, independent play, measurable progress

### Tertiary Persona: Classroom Educator (Mr. Chen, Age 45)
- **Background:** 3rd grade teacher with 25 students
- **Goals:** Supplement in-class instruction, assign engaging homework
- **Pain Points:** Limited class time, diverse skill levels, need for differentiation
- **Usage Pattern:** Recommends app for homework, reviews general patterns
- **Motivations:** Standards alignment, student engagement, minimal setup

---

## Core Features

### 1. User Selection & Management
**Description:** Multi-user support allowing different players to maintain separate progress.

**Details:**
- Pre-configured users: Jake (boy avatar) and Jeanie (girl avatar)
- Simple one-tap user selection at app launch
- User switching via "Switch Hero" button from home screen
- Persistent user session until manually switched

**User Stories:**
- As a parent, I can set up separate accounts for my two children so their progress doesn't mix
- As a child, I can easily select my profile to see my own blocks and scores

### 2. Customizable Practice Settings
**Description:** Players choose which operations and multiplication/division tables to practice.

**Details:**
- **Operations:** Multiply (×), Divide (÷), Add (+), Subtract (-)
- **Table Selection:** Choose any combination of tables 1-12
- Quick actions: "Select All" and "Clear All" buttons
- Settings persist during session, reset between users
- Visual toggle buttons with clear selected/unselected states
- At least one operation must remain selected

**User Stories:**
- As a student, I can focus on just the 5 and 10 times tables I'm struggling with
- As a learner, I can practice mixed operations once I've mastered individual tables

### 3. 60-Second Timed Challenge
**Description:** Fast-paced gameplay mode where players answer as many problems as possible in 60 seconds.

**Details:**
- Fixed 60-second countdown timer displayed prominently
- Problems generated dynamically based on selected settings
- Immediate feedback (visual "correct" or "wrong" indicators)
- On-screen numeric keypad for efficient input on touch devices
- Auto-advance to next problem upon correct answer
- Incorrect answers reset streak but allow immediate retry

**Game Rules:**
- Base score: 10 points per correct answer
- Streak bonus: +2 points for each consecutive correct answer
- No point deductions for incorrect answers
- Timer continues during incorrect attempts

**Problem Generation Rules:**
- One operand always drawn from selected tables
- For tables < 11: second operand capped at 10
- For tables ≥ 11: second operand can be 1-12
- Division: ensures integer results (e.g., 24 ÷ 6 = 4)
- Subtraction: ensures positive results (e.g., 15 - 7 = 8)
- Multiplication/Addition: operand order randomized

**User Stories:**
- As a competitive child, I want to beat my previous high score with streak bonuses
- As a learner, I want immediate feedback so I know if I'm on the right track
- As a student, I want a fair challenge that doesn't include problems I haven't learned yet

### 4. Collectible Block Rewards
**Description:** After each game session, players choose one collectible Minecraft block from three random options.

**Details:**
- **Rarity Tiers:**
  - **Common:** Grass Block, Crafting Table, Dried Kelp Block, Water
  - **Rare:** Gold Ore, Powder Snow, Sticky Piston, Redstone Lamp
  - **Epic:** TNT, Obsidian
  - **Legendary:** Diamond Ore

- **Reward Flow:**
  1. Game ends (60 seconds expires)
  2. Score displayed with session stats
  3. Three random blocks presented
  4. Player selects one block
  5. Block added to inventory
  6. Confetti animation plays

- Players can collect multiple copies of the same block
- No rarity weighting in selection (equal probability)

**User Stories:**
- As a child, I want to collect all the rare blocks to complete my collection
- As a player, I feel rewarded after every session regardless of my score
- As a collector, I want to see how many of each block I own

### 5. Block Collection Viewer
**Description:** Dedicated screen showing all available blocks with unlock status and counts.

**Details:**
- Grid layout of all 11 unique blocks
- Visual differentiation: unlocked (full color) vs locked (grayscale with "?")
- Count badge showing quantity owned (e.g., "x3")
- Rarity indicator color-coded:
  - Common: Gray background
  - Rare: Yellow background
  - Epic: Purple background
  - Legendary: Blue background
- Navigation back to home screen

**User Stories:**
- As a collector, I can see which blocks I still need to unlock
- As a player, I can admire my progress and collection growth over time

### 6. Statistics & Progress Tracking
**Description:** Performance metrics displayed on home screen with historical tracking.

**Details:**
- **Today's Stats:**
  - Games played today
  - Total points earned today
  - Operation breakdown (games per operation type)

- **Overall Stats:**
  - Total games played (lifetime)
  - Total points earned (lifetime)
  - Operation breakdown (lifetime)

- **High Scores:**
  - Saved with game mode description (e.g., "× 2,5,10")
  - Date/time stamped
  - Sorted by score (highest first)

- **Game History:**
  - Last 500 games stored per user
  - Records include: score, date, mode, operation details

**User Stories:**
- As a student, I can see that I've played 15 games today and feel accomplished
- As a parent, I can review my child's practice habits and focus areas
- As a competitive player, I want to see my all-time high score displayed

### 7. Progressive Web App (PWA)
**Description:** Installable, offline-capable application functioning like a native app.

**Details:**
- **Installation:**
  - "Add to Home Screen" support on iOS/Android
  - Custom app icon and splash screen
  - Standalone display mode (no browser chrome)

- **Offline Support:**
  - Service worker caches all assets
  - Full gameplay functionality without internet
  - Google Fonts cached for offline use

- **Performance:**
  - Instant loading after initial install
  - No network delays during gameplay
  - Smooth animations (60 FPS target)

**User Stories:**
- As a mobile user, I can install Math Craft and launch it like any other app
- As a player on a road trip, I can practice math without internet connection
- As a parent, I don't worry about data usage or connectivity issues

---

## Functional Requirements

### FR-1: User Management
- **FR-1.1:** System shall support exactly two users: Jake and Jeanie
- **FR-1.2:** User selection shall persist across sessions until manually changed
- **FR-1.3:** All data (scores, blocks, history) shall be isolated per user
- **FR-1.4:** User avatar and name shall display on home screen
- **FR-1.5:** User switching shall be accessible from home screen

### FR-2: Game Configuration
- **FR-2.1:** System shall support four operations: multiply, divide, add, subtract
- **FR-2.2:** At least one operation must be selected to start a game
- **FR-2.3:** System shall support table selection from 1-12
- **FR-2.4:** Selected settings shall be passed to game via URL parameters
- **FR-2.5:** Default selections: [2, 5, 10] tables, multiply operation

### FR-3: Gameplay
- **FR-3.1:** Timer shall count down from 60 seconds
- **FR-3.2:** Problems shall generate according to documented rules
- **FR-3.3:** Input shall accept numeric values only (0-9 digits)
- **FR-3.4:** Correct answers shall:
  - Award 10 + (streak × 2) points
  - Increment streak counter
  - Advance to next problem immediately
  - Show "correct" visual feedback (green flash)
- **FR-3.5:** Incorrect answers shall:
  - Reset streak to 0
  - Award no points
  - Keep same problem
  - Show "wrong" visual feedback (red flash)
- **FR-3.6:** Game shall end when timer reaches 0
- **FR-3.7:** Game cannot be paused or restarted mid-session

### FR-4: Rewards
- **FR-4.1:** System shall present 3 random blocks after game completion
- **FR-4.2:** Player shall select exactly one block
- **FR-4.3:** Selected block shall be added to inventory immediately
- **FR-4.4:** Confetti animation shall play upon selection
- **FR-4.5:** Block selection screen shall not be skippable

### FR-5: Data Persistence
- **FR-5.1:** All data shall persist in browser localStorage
- **FR-5.2:** Data keys shall be prefixed with "math-craft-"
- **FR-5.3:** Stored data types:
  - Current user ID
  - High scores (all users combined, filtered by userId)
  - Game history (all users combined, filtered by userId)
  - Inventory (all users combined, filtered by userId)
- **FR-5.4:** History shall be capped at 500 entries per user
- **FR-5.5:** Data shall survive browser restarts and app updates

### FR-6: Statistics
- **FR-6.1:** System shall calculate today's stats by filtering history for current date
- **FR-6.2:** Operation breakdown shall count games containing each operation
- **FR-6.3:** Stats shall update immediately after game completion
- **FR-6.4:** Stats shall be user-specific (isolated per player)

---

## Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1:** App shall load in < 3 seconds on 3G connection (initial visit)
- **NFR-1.2:** App shall load instantly from cache (subsequent visits)
- **NFR-1.3:** UI shall maintain 60 FPS during animations
- **NFR-1.4:** Input response time shall be < 100ms
- **NFR-1.5:** Problem generation shall be < 10ms

### NFR-2: Usability
- **NFR-2.1:** Target age: 6-12 years old (no reading required for gameplay)
- **NFR-2.2:** All interactive elements shall be touch-friendly (min 44x44px)
- **NFR-2.3:** Visual feedback shall be immediate and obvious
- **NFR-2.4:** No confirmation dialogs during gameplay flow
- **NFR-2.5:** Navigation shall be intuitive with clear "Back" buttons

### NFR-3: Accessibility
- **NFR-3.1:** Color shall not be the only means of conveying information
- **NFR-3.2:** Text contrast shall meet WCAG AA standards
- **NFR-3.3:** Font sizes shall be readable on mobile devices (min 14px body text)
- **NFR-3.4:** Pixel art assets shall remain crisp (no interpolation/smoothing)

### NFR-4: Reliability
- **NFR-4.1:** App shall function 100% offline after initial load
- **NFR-4.2:** Data loss shall not occur during normal operation
- **NFR-4.3:** Invalid localStorage data shall not crash the app
- **NFR-4.4:** Service worker shall update automatically in background

### NFR-5: Compatibility
- **NFR-5.1:** Supported browsers: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **NFR-5.2:** Supported devices: iOS 14+, Android 8+, desktop browsers
- **NFR-5.3:** Viewport range: 320px - 2560px width
- **NFR-5.4:** Orientation: portrait preferred, landscape supported

### NFR-6: Security & Privacy
- **NFR-6.1:** No user data shall be transmitted to external servers
- **NFR-6.2:** No analytics or tracking shall be implemented
- **NFR-6.3:** No user authentication required
- **NFR-6.4:** LocalStorage data accessible only to same origin

---

## Technical Specifications

### Architecture
**Type:** Single-Page Application (SPA) with client-side routing  
**Pattern:** Component-based React architecture  
**State Management:** React hooks (useState, useEffect)  
**Data Layer:** Browser localStorage (synchronous API)

### Technology Stack

#### Frontend Framework
- **React 19.2.0:** UI library with latest hooks and features
- **Wouter 3.3.5:** Lightweight client-side routing
- **Framer Motion 12.x:** Animation library for smooth transitions

#### Styling
- **Tailwind CSS 4.x:** Utility-first CSS framework
- **Shadcn UI:** Pre-built accessible component library (New York variant)
- **Custom Pixel Font:** Minecraft-style display font

#### Build Tools
- **Vite 7.x:** Fast development server and build tool
- **TypeScript 5.6.3:** Type safety and IDE support
- **PostCSS:** CSS processing

#### PWA
- **vite-plugin-pwa 1.2.0:** PWA manifest and service worker generation
- **Workbox:** Service worker runtime caching strategies

#### Utilities
- **canvas-confetti:** Reward animation effects
- **lucide-react:** Icon library
- **date-fns:** Date manipulation for stats

### Project Structure
```
client/src/
├── pages/              # Route components
│   ├── Home.tsx        # Main screen (settings, stats, navigation)
│   ├── Game.tsx        # Gameplay screen (timer, problems, keypad)
│   ├── Collection.tsx  # Block inventory viewer
│   ├── UserSelection.tsx  # User picker on launch
│   └── not-found.tsx   # 404 page
├── components/
│   ├── ui/            # Shadcn UI components (Button, Card, etc.)
│   └── game/          # Game-specific components
│       └── Keypad.tsx # Numeric input keypad
├── lib/
│   ├── game-logic.ts  # Problem generation algorithms
│   ├── storage.ts     # localStorage API wrapper
│   └── utils.ts       # Helper functions (cn, etc.)
└── hooks/             # Custom React hooks (if any)
```

### Data Models

#### User
```typescript
interface User {
  id: string;           // 'jake' | 'jeanie'
  name: string;         // Display name
  avatar: string;       // Asset path to avatar image
  gender: 'boy' | 'girl';
}
```

#### Problem
```typescript
interface Problem {
  a: number;           // First operand
  b: number;           // Second operand
  answer: number;      // Correct answer
  operation: Operation; // 'multiply' | 'divide' | 'add' | 'subtract'
  display: string;     // Formatted display (e.g., "5 × 3 = ?")
}
```

#### CollectedBlock
```typescript
interface CollectedBlock {
  id: string;          // UUID
  userId: string;      // Owner user ID
  type: string;        // Block type identifier
  name: string;        // Display name
  date: string;        // ISO 8601 timestamp
}
```

#### HighScore
```typescript
interface HighScore {
  id: string;          // UUID
  userId: string;      // Owner user ID (not in interface, but stored)
  name: string;        // Player name (legacy, matches userId)
  score: number;       // Total points earned
  date: string;        // ISO 8601 timestamp
  mode: string;        // Description (e.g., "× 2,5,10")
}
```

#### GameRecord
```typescript
interface GameRecord {
  id: string;          // UUID
  userId: string;      // Owner user ID (not in interface, but stored)
  score: number;       // Total points earned
  date: string;        // ISO 8601 timestamp
  mode: string;        // Operation type
  details: string;     // Formatted description
}
```

### Routing
```
/                    → Home (requires user selection)
/select-user         → UserSelection
/game?ops=X&tables=Y → Game (with URL params)
/collection          → Collection
/*                   → not-found
```

### Deployment
- **Build Output:** Static files in `dist/` directory
- **Base Path:** Configured for `/math-craft/` (GitHub Pages)
- **Hosting:** Any static file server (GitHub Pages, Netlify, Vercel, S3, etc.)
- **No Server Required:** Fully client-side application

---

## UI/UX Design Principles

### Visual Theme: Minecraft Aesthetic
1. **Pixelated Graphics:**
   - All block images rendered with `image-rendering: pixelated`
   - Custom pixel font for headings (`font-display` class)
   - Sharp edges, no anti-aliasing on game assets

2. **Color Palette:**
   - Stone gray: `#c6c6c6` (primary UI background)
   - Dark gray: `#3f3f3f` (text on light backgrounds)
   - Minecraft grass green: `#4ade80` (theme accent)
   - Black borders: 4px solid for all cards/buttons

3. **Shadow Style:**
   - Drop shadows: `shadow-[4px_4px_0_#000000]` (blocky, offset)
   - Layered depth effect for cards and buttons
   - No soft/blurred shadows

4. **Background:**
   - Full-screen Minecraft-style background image
   - Dark overlay (40% black) for content legibility
   - Fixed positioning (no parallax)

### Interaction Patterns
1. **Immediate Feedback:**
   - Green flash for correct answers
   - Red flash for incorrect answers
   - Sound effects considered but not implemented

2. **Touch-First:**
   - Large buttons (min 44x44px)
   - Numeric keypad for efficient input
   - No hover-dependent functionality

3. **Minimal Navigation:**
   - Maximum 2 clicks/taps to any feature
   - Persistent "Back" button in top-left
   - No nested menus or modals

4. **Gamification:**
   - Confetti animation on block selection
   - Streak counter prominently displayed
   - High score comparison ("New Record!")

### Accessibility Considerations
- High contrast text on all backgrounds
- Clear icons paired with text labels
- Large touch targets
- No time-sensitive interactions outside gameplay
- Graceful degradation if animations disabled

---

## Success Metrics

### Engagement Metrics
- **Daily Active Users (DAU):** Players launching app per day
- **Session Length:** Average duration per game session (target: 5-15 minutes)
- **Games Per Session:** Number of 60-second games in one sitting (target: 3-5)
- **Return Rate:** % of users returning within 7 days (target: 60%+)

### Learning Metrics
- **Problem Completion Rate:** % of problems answered correctly (target: 70%+)
- **Streak Average:** Average maximum streak per game (target: 5+)
- **Operation Diversity:** % of users practicing multiple operations (target: 40%+)
- **Progression:** Users advancing to higher tables over time

### Collection Metrics
- **Blocks Collected:** Average blocks owned per user
- **Collection Completion:** % of users with all 11 blocks unlocked
- **Game Motivation:** Correlation between collection progress and continued play

### Technical Metrics
- **Installation Rate:** % of visitors adding to home screen
- **Offline Usage:** % of sessions starting without network
- **Load Time:** 95th percentile page load time
- **Error Rate:** % of sessions with JavaScript errors (target: < 0.1%)

### Qualitative Feedback
- Parent/teacher satisfaction surveys
- Child enjoyment ratings
- Feature requests and pain points
- Educational effectiveness (anecdotal)

---

## Dependencies & Constraints

### Dependencies
- **Browser Support:** Requires modern browser with:
  - ES2020+ JavaScript support
  - LocalStorage API
  - Service Worker API (for PWA features)
  - CSS Grid and Flexbox
- **No External Services:** Fully self-contained (no APIs, databases, auth)

### Constraints
1. **No Backend:** All logic and data must be client-side
2. **LocalStorage Limits:** ~5-10 MB per origin (sufficient for current needs)
3. **Fixed User Count:** Hardcoded to 2 users (Jake and Jeanie)
4. **Static Problem Set:** Algorithm-generated, not curated content
5. **No Cloud Sync:** Data tied to single device/browser
6. **No Parental Controls:** No time limits or content restrictions
7. **English Only:** No internationalization (i18n) support

### Assumptions
- Target users have access to modern smartphone or tablet
- Adult assistance available for initial setup/installation
- Math problems follow standard US elementary curriculum
- Internet available for initial app load (then offline thereafter)

---

## Future Considerations (Out of Scope)

The following features are **not** part of the current implementation but may be considered for future versions:

- User-customizable avatars or names
- Additional users beyond Jake and Jeanie
- Sound effects and background music
- Adaptive difficulty (automatic table recommendations)
- Achievements and badges system
- Cross-device cloud sync
- Leaderboards (local or global)
- Practice mode (untimed, with hints)
- Parent dashboard with detailed analytics
- Content expansion (fractions, decimals, word problems)
- Multiplayer challenges
- Customizable game duration

---

## Appendix

### Operation Symbols
- Multiply: × (U+00D7 - Multiplication Sign)
- Divide: ÷ (U+00F7 - Division Sign)
- Add: + (Plus)
- Subtract: − (Minus)

### Block Rarity Distribution
| Rarity | Count | Blocks |
|--------|-------|--------|
| Common | 4 | Grass Block, Crafting Table, Dried Kelp Block, Water |
| Rare | 4 | Gold Ore, Powder Snow, Sticky Piston, Redstone Lamp |
| Epic | 2 | TNT, Obsidian |
| Legendary | 1 | Diamond Ore |
| **Total** | **11** | |

### Scoring Examples
| Streak | Points | Calculation |
|--------|--------|-------------|
| 0 | 10 | 10 + (0 × 2) |
| 1 | 12 | 10 + (1 × 2) |
| 5 | 20 | 10 + (5 × 2) |
| 10 | 30 | 10 + (10 × 2) |

**Maximum Possible Score:** Theoretically unlimited with perfect accuracy  
**Realistic High Score:** 300-400 points (15-20 problems in 60 seconds with streaks)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | System | Initial comprehensive PRD reflecting current implementation |

---

**End of Document**