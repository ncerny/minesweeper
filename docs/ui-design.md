# Minesweeper UI/UX Design Specification

## Overview

Classic Minesweeper game interface with modern, clean aesthetics. The design prioritizes clarity, accessibility, and responsive behavior across devices.

---

## 1. Visual Design System

### 1.1 Color Palette

```
Primary Colors:
  --bg-primary:     #c0c0c0    /* Classic gray background */
  --bg-secondary:   #808080    /* Darker gray for borders */
  --bg-light:       #ffffff    /* Raised edge highlight */
  --bg-dark:        #404040    /* Sunken edge shadow */

Cell Colors:
  --cell-hidden:    #c0c0c0    /* Unrevealed cell */
  --cell-revealed:  #d0d0d0    /* Revealed empty cell */
  --cell-flagged:   #c0c0c0    /* Flagged cell (same as hidden) */
  --cell-mine:      #ff0000    /* Exploded mine background */
  --cell-mine-hit:  #ff4444    /* Mine that was clicked */

Number Colors (revealed cell counts):
  --num-1:          #0000ff    /* Blue */
  --num-2:          #008000    /* Green */
  --num-3:          #ff0000    /* Red */
  --num-4:          #000080    /* Navy */
  --num-5:          #800000    /* Maroon */
  --num-6:          #008080    /* Teal */
  --num-7:          #000000    /* Black */
  --num-8:          #808080    /* Gray */

Status Colors:
  --status-win:     #00ff00    /* Win state indicator */
  --status-lose:    #ff0000    /* Lose state indicator */
```

### 1.2 Typography

```
Font Stack:
  --font-primary:   'Segoe UI', -apple-system, sans-serif
  --font-mono:      'Consolas', 'Courier New', monospace

Sizes:
  --text-counter:   24px       /* Mine counter, timer */
  --text-cell:      16px       /* Cell numbers */
  --text-button:    14px       /* Buttons, labels */
  --text-small:     12px       /* Difficulty options */

Weights:
  --weight-normal:  400
  --weight-bold:    700
```

### 1.3 Dimensions

```
Cell Sizing:
  --cell-size:      30px       /* Default cell dimension */
  --cell-size-sm:   24px       /* Small screen cells */
  --cell-border:    3px        /* 3D border width */

Spacing:
  --gap-cells:      0px        /* No gap between cells */
  --padding-header: 12px       /* Header padding */
  --padding-game:   16px       /* Game container padding */
  --border-game:    10px       /* Outer border width */

Grid Sizes (default difficulty levels):
  Beginner:     9x9,   10 mines
  Intermediate: 16x16, 40 mines
  Expert:       30x16, 99 mines
```

---

## 2. Component Layout

### 2.1 Overall Structure

```
┌─────────────────────────────────────────────┐
│                   HEADER                     │
│  ┌─────────┐    ┌─────┐    ┌─────────┐      │
│  │  MINES  │    │ 😊  │    │  TIMER  │      │
│  │   010   │    └─────┘    │   000   │      │
│  └─────────┘               └─────────┘      │
├─────────────────────────────────────────────┤
│              DIFFICULTY BAR                  │
│  [ Beginner ] [ Intermediate ] [ Expert ]   │
├─────────────────────────────────────────────┤
│                                             │
│                  GRID                       │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┐              │
│  │  │  │  │  │  │  │  │  │  │              │
│  ├──┼──┼──┼──┼──┼──┼──┼──┼──┤              │
│  │  │  │  │  │  │  │  │  │  │              │
│  ├──┼──┼──┼──┼──┼──┼──┼──┼──┤              │
│  │  │  │  │  │  │  │  │  │  │              │
│  └──┴──┴──┴──┴──┴──┴──┴──┴──┘              │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.2 Header Component

```
Width: 100% of game container
Height: 60px
Layout: Flexbox, justify-content: space-between

Elements:
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─────────────┐    ┌────┐    ┌──────────┐ │
│  │ MINE COUNTER│    │FACE│    │  TIMER   │ │
│  │    010      │    │ 😊 │    │   000    │ │
│  └─────────────┘    └────┘    └──────────┘ │
│                                             │
└─────────────────────────────────────────────┘

Mine Counter:
  - 3-digit LED-style display
  - Shows: total mines - flagged cells
  - Color: Red digits on black background
  - Can go negative (shows "-" prefix)

Face Button (New Game):
  - 40x40px clickable button
  - States: 😊 (playing), 😮 (clicking), 😎 (won), 💀 (lost)
  - Click to restart game

Timer:
  - 3-digit LED-style display
  - Starts on first cell click
  - Stops on win/lose
  - Max: 999 seconds
  - Color: Red digits on black background
```

### 2.3 Difficulty Selector

```
Position: Below header, above grid
Layout: Horizontal button group

┌──────────────────────────────────────────┐
│  [Beginner]  [Intermediate]  [Expert]    │
└──────────────────────────────────────────┘

Button States:
  - Default: Raised 3D appearance
  - Selected: Sunken 3D appearance
  - Hover: Slight highlight

Changing difficulty resets the game.
```

### 2.4 Grid Component

```
Container:
  - Sunken 3D border (inset appearance)
  - Background: --bg-secondary
  - Padding: 3px

Cell Grid:
  - CSS Grid layout
  - Grid columns: repeat(COLS, var(--cell-size))
  - Grid rows: repeat(ROWS, var(--cell-size))
  - No gaps between cells
```

---

## 3. Cell State Visualizations

### 3.1 Cell States

```
┌─────────────────────────────────────────────────────────────┐
│  STATE          │  APPEARANCE                               │
├─────────────────┼───────────────────────────────────────────┤
│  Hidden         │  Raised 3D button, solid gray             │
│  Revealed Empty │  Flat, lighter gray, no content           │
│  Revealed 1-8   │  Flat, lighter gray, colored number       │
│  Flagged        │  Raised 3D button + red flag icon 🚩      │
│  Question Mark  │  Raised 3D button + ? symbol (optional)   │
│  Mine (lose)    │  Red background + mine icon 💣            │
│  Mine (reveal)  │  Gray background + mine icon (end game)   │
│  Wrong Flag     │  Mine with X overlay (end game reveal)    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 3D Border Effect (Hidden/Flagged Cells)

```
Classic Minesweeper raised appearance:

    Light (top/left)
    ┌────────────────┐
    │░░░░░░░░░░░░░░░░│
    │░┌────────────┐░│
    │░│            │▓│ ← Dark (right/bottom)
    │░│   CELL     │▓│
    │░│            │▓│
    │░└────────────┘▓│
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
    └────────────────┘

CSS approach:
  border-top: 3px solid var(--bg-light);
  border-left: 3px solid var(--bg-light);
  border-bottom: 3px solid var(--bg-dark);
  border-right: 3px solid var(--bg-dark);
```

### 3.3 Cell Visual Details

```
Hidden Cell:
  ┌─────┐
  │░░░░░│  Raised 3D borders
  │░   ░│  Solid gray fill
  │░░░░░│  Cursor: pointer
  └─────┘

Revealed Empty:
  ┌─────┐
  │     │  Flat border (1px solid #808080)
  │     │  Lighter gray background
  │     │  No content
  └─────┘

Revealed Number:
  ┌─────┐
  │     │  Same as empty
  │  3  │  Centered number (bold, colored)
  │     │  Color based on number (see palette)
  └─────┘

Flagged:
  ┌─────┐
  │░░🚩░│  Raised 3D borders (like hidden)
  │░🚩░░│  Red flag emoji/icon centered
  │░░░░░│  Cursor: pointer
  └─────┘

Mine (clicked - game over):
  ┌─────┐
  │▓▓▓▓▓│  Red background
  │▓ 💣▓│  Mine icon centered
  │▓▓▓▓▓│  This is the mine player clicked
  └─────┘

Mine (revealed - game over):
  ┌─────┐
  │     │  Normal revealed background
  │ 💣  │  Mine icon centered
  │     │  Other mines shown at game end
  └─────┘
```

---

## 4. Interaction Patterns

### 4.1 Mouse/Touch Interactions

```
Left Click on Hidden Cell:
  → Reveal cell
  → If mine: game over (lose)
  → If empty (0 neighbors): flood-fill reveal adjacent
  → If number: show number

Right Click on Hidden Cell:
  → Toggle flag (unflagged → flagged → unflagged)
  → Update mine counter

Left Click on Revealed Number:
  → "Chord" action (if adjacent flags = number)
  → Reveal all unflagged adjacent hidden cells
  → If any revealed cell is mine: game over

Left Click on Face Button:
  → Start new game with current difficulty

Mouse Down on Hidden Cell:
  → Show "pressed" state (sunken appearance)
  → Face changes to 😮

Mouse Up (not on same cell):
  → Restore cell to normal hidden state
  → Face returns to 😊

Touch (mobile):
  → Tap = reveal
  → Long press = flag
```

### 4.2 Keyboard Interactions (Accessibility)

```
Tab:        Move focus between cells
Enter:      Reveal focused cell
Space:      Toggle flag on focused cell
Arrow Keys: Navigate grid
R:          Restart game
1/2/3:      Select difficulty (Beginner/Intermediate/Expert)
```

### 4.3 Visual Feedback

```
Cell Hover (hidden):
  → Subtle brightness increase
  → Cursor: pointer

Cell Press (hidden):
  → Sunken appearance (invert 3D borders)
  → Face: 😮

Cell Focus (keyboard):
  → 2px outline in accent color
  → Visible focus indicator

Button Hover:
  → Slight brightness change
  → Cursor: pointer

Button Active:
  → Sunken appearance
```

---

## 5. Game States

### 5.1 State Transitions

```
┌─────────────┐
│   READY     │  Initial state, grid generated
│    😊       │  Timer: 000, not running
└──────┬──────┘
       │ First click
       ▼
┌─────────────┐
│  PLAYING    │  Timer running
│    😊       │  Player revealing cells
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌──────┐ ┌──────┐
│ WIN  │ │ LOSE │
│  😎  │ │  💀  │
└──────┘ └──────┘
```

### 5.2 Win Condition

```
All non-mine cells revealed
  → Timer stops
  → Face: 😎
  → All unflagged mines auto-flagged
  → Cells become non-interactive
```

### 5.3 Lose Condition

```
Mine cell clicked
  → Timer stops
  → Face: 💀
  → Clicked mine: red background
  → All mines revealed
  → Wrong flags: shown with X
  → Cells become non-interactive
```

---

## 6. Responsive Design

### 6.1 Breakpoints

```
Desktop (>768px):
  --cell-size: 30px
  Full difficulty options visible
  Horizontal layout

Tablet (481-768px):
  --cell-size: 28px
  Difficulty as dropdown or icons
  May need horizontal scroll for Expert

Mobile (<480px):
  --cell-size: 24px
  Difficulty as dropdown
  Expert grid: horizontal scroll or zoom
  Consider: Beginner/Intermediate only
```

### 6.2 Touch Adaptations

```
Mobile Touch:
  - Larger tap targets (min 44px touch area)
  - Long-press for flag (with haptic feedback if available)
  - Visual indicator for long-press progress
  - Double-tap disabled (prevents zoom conflicts)

Gesture Hints:
  - First-time tooltip: "Tap to reveal, hold to flag"
  - Dismissable after acknowledgment
```

### 6.3 Container Behavior

```
Min Width: 320px (9 cells * 24px + padding)
Max Width: 1200px (centered on large screens)

Grid Overflow:
  - Expert on mobile: horizontal scroll within container
  - Scroll indicators if content overflows
  - Pinch-to-zoom disabled on game area
```

---

## 7. Accessibility

### 7.1 ARIA Labels

```html
<div role="grid" aria-label="Minesweeper game board">
  <div role="row">
    <button role="gridcell"
            aria-label="Row 1, Column 1, hidden"
            aria-pressed="false">
    </button>
  </div>
</div>

<button aria-label="New game" aria-describedby="game-status">
  😊
</button>

<div id="game-status" aria-live="polite">
  Game in progress. 10 mines remaining.
</div>
```

### 7.2 Screen Reader Announcements

```
On reveal: "Row 3, Column 5, 2 adjacent mines"
On flag:   "Row 3, Column 5, flagged"
On win:    "Congratulations! You won in 45 seconds"
On lose:   "Game over. You hit a mine."
```

### 7.3 Color Contrast

```
All number colors meet WCAG AA contrast ratio (4.5:1)
Alternative: High contrast mode with patterns/shapes
```

---

## 8. Animation & Polish

### 8.1 Transitions

```
Cell reveal:    100ms ease-out (background, border)
Counter update: 50ms (digit flip)
Face change:    immediate (no delay)
Difficulty:     150ms (button state)
```

### 8.2 Win Animation (Optional)

```
Sequential flag animation on remaining mines
Subtle confetti or sparkle effect
Face sunglasses emoji: 😎
```

### 8.3 Lose Animation (Optional)

```
Brief shake on clicked mine
Sequential mine reveal (50ms delay each)
Face skull emoji: 💀
```

---

## 9. Implementation Notes

### 9.1 First Click Safety

The first click should never be a mine. Implementation should either:
- Generate mines after first click (exclude clicked cell)
- Regenerate board if first click would be mine
- Move the mine to another location

### 9.2 LED Display Style

```css
.led-display {
  background: #300;
  color: #f00;
  font-family: 'Digital-7', monospace;
  padding: 4px 8px;
  border: 2px inset #000;
  letter-spacing: 2px;
}
```

### 9.3 Asset Requirements

```
Icons (can use emoji or custom):
  - Mine: 💣 or custom SVG
  - Flag: 🚩 or custom SVG
  - Face states: 😊 😮 😎 💀 or custom sprites

Optional:
  - Custom font for LED display
  - Sound effects (click, flag, win, lose)
```

---

## Summary

This design maintains the classic Minesweeper aesthetic while ensuring modern accessibility and responsive behavior. Key elements:

1. **Classic 3D visual style** with raised/sunken borders
2. **Clear cell states** with distinct visual treatments
3. **Intuitive interactions** matching traditional gameplay
4. **Full accessibility** support with keyboard and screen readers
5. **Responsive design** adapting to all screen sizes
6. **Modern polish** with subtle animations and transitions
