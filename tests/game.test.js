/**
 * Minesweeper Game Logic Tests
 *
 * Run these tests by opening tests/index.html in a browser
 * or by using Node.js with appropriate module loading
 */

// Simple test framework
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
    tests.push({ name, fn });
}

function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
    }
}

function assertTrue(value, message = '') {
    if (!value) {
        throw new Error(`${message}\nExpected truthy value, got: ${value}`);
    }
}

function assertFalse(value, message = '') {
    if (value) {
        throw new Error(`${message}\nExpected falsy value, got: ${value}`);
    }
}

function runTests() {
    console.log('Running Minesweeper Tests...\n');

    for (const t of tests) {
        try {
            t.fn();
            passed++;
            console.log(`✓ ${t.name}`);
        } catch (e) {
            failed++;
            console.log(`✗ ${t.name}`);
            console.log(`  ${e.message}\n`);
        }
    }

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    return failed === 0;
}

// ===================
// Cell Tests
// ===================

test('Cell: initializes with correct defaults', () => {
    const cell = new Cell(2, 3);
    assertEqual(cell.row, 2);
    assertEqual(cell.col, 3);
    assertFalse(cell.hasMine);
    assertFalse(cell.isRevealed);
    assertFalse(cell.isFlagged);
    assertEqual(cell.adjacentMines, 0);
});

test('Cell: placeMine sets hasMine', () => {
    const cell = new Cell(0, 0);
    cell.placeMine();
    assertTrue(cell.hasMine);
});

test('Cell: reveal returns true on first reveal', () => {
    const cell = new Cell(0, 0);
    assertTrue(cell.reveal());
    assertTrue(cell.isRevealed);
});

test('Cell: reveal returns false if already revealed', () => {
    const cell = new Cell(0, 0);
    cell.reveal();
    assertFalse(cell.reveal());
});

test('Cell: reveal returns false if flagged', () => {
    const cell = new Cell(0, 0);
    cell.toggleFlag();
    assertFalse(cell.reveal());
    assertFalse(cell.isRevealed);
});

test('Cell: toggleFlag toggles flag state', () => {
    const cell = new Cell(0, 0);
    assertFalse(cell.isFlagged);
    cell.toggleFlag();
    assertTrue(cell.isFlagged);
    cell.toggleFlag();
    assertFalse(cell.isFlagged);
});

test('Cell: toggleFlag returns current flag state if revealed', () => {
    const cell = new Cell(0, 0);
    cell.reveal();
    assertFalse(cell.toggleFlag());
    assertFalse(cell.isFlagged);
});

test('Cell: isEmpty returns true for cell with no mine and no adjacent mines', () => {
    const cell = new Cell(0, 0);
    assertTrue(cell.isEmpty());
});

test('Cell: isEmpty returns false if has mine', () => {
    const cell = new Cell(0, 0);
    cell.placeMine();
    assertFalse(cell.isEmpty());
});

test('Cell: isEmpty returns false if has adjacent mines', () => {
    const cell = new Cell(0, 0);
    cell.setAdjacentMines(3);
    assertFalse(cell.isEmpty());
});

// ===================
// Board Tests
// ===================

test('Board: initializes with correct dimensions', () => {
    const board = new Board(9, 9, 10);
    assertEqual(board.rows, 9);
    assertEqual(board.cols, 9);
    assertEqual(board.mineCount, 10);
    assertFalse(board.minesPlaced);
});

test('Board: creates grid with correct size', () => {
    const board = new Board(5, 7, 5);
    assertEqual(board.grid.length, 5);
    assertEqual(board.grid[0].length, 7);
});

test('Board: getCell returns correct cell', () => {
    const board = new Board(5, 5, 3);
    const cell = board.getCell(2, 3);
    assertEqual(cell.row, 2);
    assertEqual(cell.col, 3);
});

test('Board: getCell returns null for invalid coordinates', () => {
    const board = new Board(5, 5, 3);
    assertEqual(board.getCell(-1, 0), null);
    assertEqual(board.getCell(0, -1), null);
    assertEqual(board.getCell(5, 0), null);
    assertEqual(board.getCell(0, 5), null);
});

test('Board: isValidCell returns correct values', () => {
    const board = new Board(5, 5, 3);
    assertTrue(board.isValidCell(0, 0));
    assertTrue(board.isValidCell(4, 4));
    assertFalse(board.isValidCell(-1, 0));
    assertFalse(board.isValidCell(5, 0));
});

test('Board: getNeighbors returns correct count for center cell', () => {
    const board = new Board(5, 5, 3);
    const neighbors = board.getNeighbors(2, 2);
    assertEqual(neighbors.length, 8);
});

test('Board: getNeighbors returns correct count for corner cell', () => {
    const board = new Board(5, 5, 3);
    const neighbors = board.getNeighbors(0, 0);
    assertEqual(neighbors.length, 3);
});

test('Board: getNeighbors returns correct count for edge cell', () => {
    const board = new Board(5, 5, 3);
    const neighbors = board.getNeighbors(0, 2);
    assertEqual(neighbors.length, 5);
});

test('Board: placeMines places correct number of mines', () => {
    const board = new Board(9, 9, 10);
    board.placeMines(4, 4);
    let mineCount = 0;
    for (let row = 0; row < board.rows; row++) {
        for (let col = 0; col < board.cols; col++) {
            if (board.getCell(row, col).hasMine) {
                mineCount++;
            }
        }
    }
    assertEqual(mineCount, 10);
});

test('Board: placeMines respects first-click safety', () => {
    const board = new Board(9, 9, 10);
    const safeRow = 4;
    const safeCol = 4;
    board.placeMines(safeRow, safeCol);

    // First click cell should be safe
    assertFalse(board.getCell(safeRow, safeCol).hasMine);

    // Neighbors should also be safe
    const neighbors = board.getNeighbors(safeRow, safeCol);
    for (const neighbor of neighbors) {
        assertFalse(neighbor.hasMine, `Neighbor at (${neighbor.row}, ${neighbor.col}) should be safe`);
    }
});

test('Board: placeMines only runs once', () => {
    const board = new Board(9, 9, 10);
    board.placeMines(0, 0);
    assertTrue(board.minesPlaced);
    // Calling again should not change anything
    board.placeMines(8, 8);
    // First click cell should still be safe
    assertFalse(board.getCell(0, 0).hasMine);
});

test('Board: revealCell returns revealed cells', () => {
    const board = new Board(3, 3, 0); // No mines
    board.minesPlaced = true; // Skip mine placement
    const revealed = board.revealCell(1, 1);
    assertTrue(revealed.length > 0);
    assertTrue(board.getCell(1, 1).isRevealed);
});

test('Board: revealCell cascades for empty cells', () => {
    const board = new Board(3, 3, 0); // No mines = all empty
    board.minesPlaced = true;
    board.revealCell(1, 1);
    // All cells should be revealed since none have adjacent mines
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            assertTrue(board.getCell(row, col).isRevealed,
                `Cell at (${row}, ${col}) should be revealed`);
        }
    }
});

test('Board: countFlags returns correct count', () => {
    const board = new Board(5, 5, 3);
    assertEqual(board.countFlags(), 0);
    board.getCell(0, 0).toggleFlag();
    board.getCell(1, 1).toggleFlag();
    assertEqual(board.countFlags(), 2);
});

test('Board: countUnrevealedSafe returns correct count', () => {
    const board = new Board(3, 3, 1);
    board.minesPlaced = true;
    board.getCell(0, 0).placeMine();
    assertEqual(board.countUnrevealedSafe(), 8); // 9 cells - 1 mine
    board.getCell(1, 1).reveal();
    assertEqual(board.countUnrevealedSafe(), 7);
});

test('Board: revealAllMines reveals all mines', () => {
    const board = new Board(5, 5, 3);
    board.placeMines(2, 2);
    const mines = board.revealAllMines();
    assertEqual(mines.length, 3);
    for (const mine of mines) {
        assertTrue(mine.hasMine);
        assertTrue(mine.isRevealed);
    }
});

// ===================
// Game Tests
// ===================

test('Game: initializes with default state', () => {
    const game = new Game();
    assertEqual(game.status, 'idle');
    assertEqual(game.difficulty, 'beginner');
});

test('Game: newGame creates board with correct difficulty', () => {
    const game = new Game();
    game.newGame('beginner');
    assertEqual(game.board.rows, 9);
    assertEqual(game.board.cols, 9);
    assertEqual(game.board.mineCount, 10);

    game.newGame('intermediate');
    assertEqual(game.board.rows, 16);
    assertEqual(game.board.cols, 16);
    assertEqual(game.board.mineCount, 40);

    game.newGame('expert');
    assertEqual(game.board.rows, 16);
    assertEqual(game.board.cols, 30);
    assertEqual(game.board.mineCount, 99);
});

test('Game: newGame resets state', () => {
    const game = new Game();
    game.newGame('beginner');
    assertEqual(game.status, 'idle');
    assertEqual(game.elapsedTime, 0);
});

test('Game: handleClick starts game on first click', () => {
    const game = new Game();
    game.newGame('beginner');
    assertEqual(game.status, 'idle');
    game.handleClick(4, 4);
    assertEqual(game.status, 'playing');
    assertTrue(game.board.minesPlaced);
});

test('Game: handleClick ignores flagged cells', () => {
    const game = new Game();
    game.newGame('beginner');
    game.board.getCell(0, 0).toggleFlag();
    const result = game.handleClick(0, 0);
    assertEqual(result.revealed.length, 0);
});

test('Game: handleRightClick toggles flag', () => {
    const game = new Game();
    game.newGame('beginner');
    const result1 = game.handleRightClick(0, 0);
    assertTrue(result1.flagged);
    assertTrue(game.board.getCell(0, 0).isFlagged);

    const result2 = game.handleRightClick(0, 0);
    assertFalse(result2.flagged);
    assertFalse(game.board.getCell(0, 0).isFlagged);
});

test('Game: handleRightClick ignores revealed cells', () => {
    const game = new Game();
    game.newGame('beginner');
    game.handleClick(4, 4); // Start game
    const cell = game.board.getCell(4, 4);
    if (cell.isRevealed) {
        const result = game.handleRightClick(4, 4);
        assertEqual(result.cell, null);
    }
});

test('Game: getRemainingMines calculates correctly', () => {
    const game = new Game();
    game.newGame('beginner');
    assertEqual(game.getRemainingMines(), 10);
    game.board.getCell(0, 0).toggleFlag();
    assertEqual(game.getRemainingMines(), 9);
    game.board.getCell(1, 1).toggleFlag();
    assertEqual(game.getRemainingMines(), 8);
});

test('Game: getState returns correct state object', () => {
    const game = new Game();
    game.newGame('intermediate');
    const state = game.getState();
    assertEqual(state.difficulty, 'intermediate');
    assertEqual(state.status, 'idle');
    assertEqual(state.elapsedTime, 0);
    assertEqual(state.remainingMines, 40);
    assertTrue(state.board !== null);
});

test('Game: win detection works', () => {
    const game = new Game();
    game.newGame('beginner');
    // Reveal first cell to place mines
    game.handleClick(0, 0);

    // Reveal all non-mine cells
    for (let row = 0; row < game.board.rows; row++) {
        for (let col = 0; col < game.board.cols; col++) {
            const cell = game.board.getCell(row, col);
            if (!cell.hasMine && !cell.isRevealed) {
                game.handleClick(row, col);
            }
        }
    }

    assertEqual(game.status, 'won');
});

test('Game: lose detection works', () => {
    const game = new Game();
    game.newGame('beginner');
    // First click to place mines
    game.handleClick(4, 4);

    // Find a mine and click it
    for (let row = 0; row < game.board.rows; row++) {
        for (let col = 0; col < game.board.cols; col++) {
            const cell = game.board.getCell(row, col);
            if (cell.hasMine) {
                game.handleClick(row, col);
                assertEqual(game.status, 'lost');
                return;
            }
        }
    }
});

// Run tests
runTests();
