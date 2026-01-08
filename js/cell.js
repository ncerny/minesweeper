/**
 * Cell class - represents a single cell in the Minesweeper grid
 *
 * Data structure:
 * - row, col: position in grid
 * - hasMine: whether this cell contains a mine
 * - isRevealed: whether the cell has been uncovered
 * - isFlagged: whether the player has flagged this cell
 * - adjacentMines: count of mines in neighboring cells (0-8)
 */
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.hasMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjacentMines = 0;
    }

    /**
     * Place a mine in this cell
     */
    placeMine() {
        this.hasMine = true;
    }

    /**
     * Reveal this cell
     * @returns {boolean} true if cell was revealed, false if already revealed or flagged
     */
    reveal() {
        if (this.isRevealed || this.isFlagged) {
            return false;
        }
        this.isRevealed = true;
        return true;
    }

    /**
     * Toggle flag on this cell
     * @returns {boolean} new flag state
     */
    toggleFlag() {
        if (this.isRevealed) {
            return this.isFlagged;
        }
        this.isFlagged = !this.isFlagged;
        return this.isFlagged;
    }

    /**
     * Set the adjacent mine count
     * @param {number} count
     */
    setAdjacentMines(count) {
        this.adjacentMines = count;
    }

    /**
     * Check if this cell is empty (no mine, no adjacent mines)
     * @returns {boolean}
     */
    isEmpty() {
        return !this.hasMine && this.adjacentMines === 0;
    }
}
