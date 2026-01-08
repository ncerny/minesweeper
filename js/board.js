/**
 * Board class - manages the Minesweeper grid
 *
 * Data structure:
 * - rows, cols: grid dimensions
 * - mineCount: total mines on board
 * - grid: 2D array of Cell objects
 * - minesPlaced: whether mines have been placed (for first-click safety)
 */
class Board {
    constructor(rows, cols, mineCount) {
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        this.grid = [];
        this.minesPlaced = false;
        this.initGrid();
    }

    /**
     * Initialize empty grid with Cell objects
     */
    initGrid() {
        this.grid = [];
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = new Cell(row, col);
            }
        }
    }

    /**
     * Place mines randomly, avoiding the first-clicked cell and its neighbors
     * @param {number} safeRow - row of first click (safe zone center)
     * @param {number} safeCol - col of first click (safe zone center)
     */
    placeMines(safeRow, safeCol) {
        if (this.minesPlaced) return;

        const safeZone = this.getNeighbors(safeRow, safeCol);
        safeZone.push(this.grid[safeRow][safeCol]);

        let placed = 0;
        while (placed < this.mineCount) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            const cell = this.grid[row][col];

            // Skip if already has mine or is in safe zone
            if (cell.hasMine || safeZone.includes(cell)) {
                continue;
            }

            cell.placeMine();
            placed++;
        }

        this.calculateAdjacentMines();
        this.minesPlaced = true;
    }

    /**
     * Calculate adjacent mine counts for all cells
     */
    calculateAdjacentMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                if (!cell.hasMine) {
                    const neighbors = this.getNeighbors(row, col);
                    const mineCount = neighbors.filter(n => n.hasMine).length;
                    cell.setAdjacentMines(mineCount);
                }
            }
        }
    }

    /**
     * Get all neighboring cells (up to 8)
     * @param {number} row
     * @param {number} col
     * @returns {Cell[]}
     */
    getNeighbors(row, col) {
        const neighbors = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isValidCell(newRow, newCol)) {
                    neighbors.push(this.grid[newRow][newCol]);
                }
            }
        }
        return neighbors;
    }

    /**
     * Check if coordinates are within grid bounds
     * @param {number} row
     * @param {number} col
     * @returns {boolean}
     */
    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    /**
     * Get cell at position
     * @param {number} row
     * @param {number} col
     * @returns {Cell|null}
     */
    getCell(row, col) {
        if (!this.isValidCell(row, col)) return null;
        return this.grid[row][col];
    }

    /**
     * Reveal a cell and cascade if empty
     * @param {number} row
     * @param {number} col
     * @returns {Cell[]} array of revealed cells
     */
    revealCell(row, col) {
        const cell = this.getCell(row, col);
        if (!cell || !cell.reveal()) {
            return [];
        }

        const revealed = [cell];

        // Cascade reveal for empty cells
        if (cell.isEmpty()) {
            const neighbors = this.getNeighbors(row, col);
            for (const neighbor of neighbors) {
                if (!neighbor.isRevealed && !neighbor.isFlagged) {
                    revealed.push(...this.revealCell(neighbor.row, neighbor.col));
                }
            }
        }

        return revealed;
    }

    /**
     * Count unrevealed cells that don't have mines
     * @returns {number}
     */
    countUnrevealedSafe() {
        let count = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                if (!cell.isRevealed && !cell.hasMine) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Count flagged cells
     * @returns {number}
     */
    countFlags() {
        let count = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col].isFlagged) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Reveal all mines (for game over)
     * @returns {Cell[]} array of mine cells
     */
    revealAllMines() {
        const mines = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                if (cell.hasMine) {
                    cell.isRevealed = true;
                    mines.push(cell);
                }
            }
        }
        return mines;
    }
}
