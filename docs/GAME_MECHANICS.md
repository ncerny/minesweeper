# Minesweeper Game Mechanics Specification

## Grid Configurations

### Difficulty Levels

| Difficulty   | Rows | Columns | Mines | Mine Density |
|-------------|------|---------|-------|--------------|
| Beginner    | 9    | 9       | 10    | 12.3%        |
| Intermediate| 16   | 16      | 40    | 15.6%        |
| Expert      | 16   | 30      | 99    | 20.6%        |

These values match the classic Windows Minesweeper standards.

## Cell States

Each cell can be in one of the following states:

- **Hidden**: Default state, contents unknown to player
- **Revealed**: Cell has been uncovered, showing either a number or empty
- **Flagged**: Player has marked this cell as containing a mine
- **Exploded**: A mine that was clicked (game over state)

## Mine Placement

### Initial Board Generation

1. Create empty grid with all cells hidden
2. Mines are placed AFTER the first click (see First-Click Safety)
3. Mine positions are randomly distributed

### First-Click Safety

The first click is always safe:

1. When player clicks first cell, that cell (and optionally its 8 neighbors) cannot contain mines
2. After first click, randomly place mines in remaining valid positions
3. Calculate adjacent mine counts for all cells

This ensures the player always gets at least one safe reveal on their first click.

## Number Display

When a cell is revealed:

- **Empty (0 adjacent mines)**: Display nothing, trigger cascade reveal
- **1-8**: Display the count of adjacent mines in that cell
- **Mine**: Game over (if revealed by player click)

### Adjacent Cell Calculation

A cell's "adjacent" cells are the 8 surrounding cells (orthogonal + diagonal):
```
[NW] [N] [NE]
[W]  [X] [E]
[SW] [S] [SE]
```

Edge and corner cells have fewer adjacent cells (5 for edges, 3 for corners).

## Reveal Mechanics

### Single Cell Reveal

When clicking a hidden cell:

1. If cell contains mine → LOSE (game over)
2. If cell has adjacent mines → reveal number
3. If cell has no adjacent mines → cascade reveal

### Cascade Reveal (Flood Fill)

When revealing a cell with 0 adjacent mines:

1. Reveal the clicked cell (shows empty)
2. Recursively reveal all adjacent hidden cells
3. Stop recursion at cells that have adjacent mines (but still reveal them)
4. Never reveal flagged cells during cascade

Algorithm: Breadth-first or depth-first flood fill from the clicked cell.

### Chord Reveal (Optional Feature)

When clicking a revealed number cell:

1. Count adjacent flagged cells
2. If flag count equals the cell's number:
   - Reveal all adjacent non-flagged hidden cells
3. If any revealed cell is a mine → LOSE
4. If flag count doesn't match → no action

## Flagging Mechanics

### Flag Placement

- Right-click on hidden cell → toggle flag
- Cannot flag revealed cells
- Maximum flags = total mine count (optional limit)

### Flag Counter

- Display: Total mines - placed flags
- Can go negative if player places too many flags
- Does not indicate correctness of flag placement

## Timer

- Starts on first click
- Counts up in seconds
- Stops on win or lose
- Maximum display: 999 seconds

## Win Condition

The game is won when:

- All non-mine cells are revealed
- Flags are NOT required for winning (only reveals matter)

## Lose Condition

The game is lost when:

- Player clicks (left-click) on a mine
- Chord reveal uncovers a mine

### Game Over Display

On lose:
- Reveal all mines
- Mark incorrectly flagged cells (cells flagged that aren't mines)
- Highlight the clicked mine differently (exploded state)

## Game Reset

New game button or difficulty change:

1. Reset timer to 0
2. Reset flag counter to mine count
3. Generate new hidden grid
4. Mines placed on first click (not immediately)

## Input Handling

### Left Click

- On hidden cell: reveal
- On revealed number: chord reveal (if flags match)
- On flagged cell: no action

### Right Click

- On hidden cell: toggle flag
- On revealed cell: no action
- On flagged cell: remove flag

### Middle Click (Optional)

- Same as chord reveal on number cells
