# Minesweeper

Classic Minesweeper game replica.

## Technical Architecture

### Technology Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Build**: None required - static files only
- **Dependencies**: Zero external dependencies

### File Structure

```
minesweeper/
├── index.html          # Entry point, game layout
├── css/
│   └── style.css       # All styles (grid, cells, status)
├── js/
│   ├── cell.js         # Cell class - individual grid cell
│   ├── board.js        # Board class - grid management
│   ├── game.js         # Game class - main controller
│   └── ui.js           # UI module - DOM interactions
└── README.md
```

### Data Structures

#### Cell
```javascript
{
    row: number,           // Grid row position
    col: number,           // Grid column position
    hasMine: boolean,      // Contains a mine
    isRevealed: boolean,   // Has been uncovered
    isFlagged: boolean,    // Player flagged this cell
    adjacentMines: number  // Count of neighboring mines (0-8)
}
```

#### Board
```javascript
{
    rows: number,          // Grid height
    cols: number,          // Grid width
    mineCount: number,     // Total mines
    grid: Cell[][],        // 2D array of cells
    minesPlaced: boolean   // Mines placed (for first-click safety)
}
```

#### Game State
```javascript
{
    difficulty: string,    // 'beginner' | 'intermediate' | 'expert'
    board: Board,          // Current board instance
    status: string,        // 'idle' | 'playing' | 'won' | 'lost'
    startTime: number,     // Game start timestamp
    elapsedTime: number,   // Seconds elapsed
    timerInterval: number  // Timer interval ID
}
```

### Difficulty Settings

| Level        | Grid Size | Mines |
|--------------|-----------|-------|
| Beginner     | 9×9       | 10    |
| Intermediate | 16×16     | 40    |
| Expert       | 16×30     | 99    |

### Key Features

- **First-click safety**: Mines placed after first click, avoiding clicked cell
- **Cascade reveal**: Empty cells auto-reveal neighbors
- **Flag system**: Right-click to mark suspected mines
- **Win detection**: All non-mine cells revealed
- **Lose detection**: Mine cell clicked

## Running

Open `index.html` in a web browser. No server required.
