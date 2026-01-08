/**
 * Game class - main controller for Minesweeper
 *
 * Game state data structure:
 * - difficulty: current difficulty setting
 * - board: Board instance
 * - status: Game.STATUS.NOT_STARTED | IN_PROGRESS | WON | LOST
 * - startTime: timestamp when game started
 * - elapsedTime: seconds elapsed
 * - timerInterval: interval ID for timer
 * - onStateChange: callback for state transitions
 */
class Game {
    // Game status constants
    static STATUS = {
        NOT_STARTED: 'not-started',
        IN_PROGRESS: 'in-progress',
        WON: 'won',
        LOST: 'lost'
    };

    // Difficulty configurations
    static DIFFICULTIES = {
        beginner: { rows: 9, cols: 9, mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert: { rows: 16, cols: 30, mines: 99 }
    };

    /**
     * Create a new Game instance
     * @param {function} onStateChange - optional callback(newStatus, oldStatus)
     */
    constructor(onStateChange = null) {
        this.difficulty = 'beginner';
        this.board = null;
        this.status = Game.STATUS.NOT_STARTED;
        this.startTime = null;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.onStateChange = onStateChange;
    }

    /**
     * Start a new game with given difficulty
     * @param {string} difficulty - 'beginner', 'intermediate', or 'expert'
     */
    newGame(difficulty = this.difficulty) {
        this.stopTimer();
        this.difficulty = difficulty;
        const config = Game.DIFFICULTIES[difficulty];
        this.board = new Board(config.rows, config.cols, config.mines);
        this.setStatus(Game.STATUS.NOT_STARTED);
        this.startTime = null;
        this.elapsedTime = 0;
    }

    /**
     * Set game status and trigger callback
     * @param {string} newStatus - new game status
     */
    setStatus(newStatus) {
        const oldStatus = this.status;
        if (oldStatus !== newStatus) {
            this.status = newStatus;
            if (this.onStateChange) {
                this.onStateChange(newStatus, oldStatus);
            }
        }
    }

    /**
     * Check if game is over (won or lost)
     * @returns {boolean}
     */
    isGameOver() {
        return this.status === Game.STATUS.WON || this.status === Game.STATUS.LOST;
    }

    /**
     * Check if game is in progress
     * @returns {boolean}
     */
    isPlaying() {
        return this.status === Game.STATUS.IN_PROGRESS;
    }

    /**
     * Check if game hasn't started yet
     * @returns {boolean}
     */
    isNotStarted() {
        return this.status === Game.STATUS.NOT_STARTED;
    }

    /**
     * Handle cell click (reveal)
     * @param {number} row
     * @param {number} col
     * @returns {object} result with revealed cells and game status
     */
    handleClick(row, col) {
        if (this.isGameOver()) {
            return { revealed: [], status: this.status };
        }

        const cell = this.board.getCell(row, col);
        if (!cell || cell.isFlagged) {
            return { revealed: [], status: this.status };
        }

        // First click - place mines and start timer
        if (this.isNotStarted()) {
            this.board.placeMines(row, col);
            this.setStatus(Game.STATUS.IN_PROGRESS);
            this.startTimer();
        }

        // Reveal cell
        const revealed = this.board.revealCell(row, col);

        // Check for mine hit
        if (cell.hasMine) {
            this.setStatus(Game.STATUS.LOST);
            this.stopTimer();
            const mines = this.board.revealAllMines();
            return { revealed: mines, status: this.status, hitMine: cell };
        }

        // Check for win
        if (this.board.countUnrevealedSafe() === 0) {
            this.setStatus(Game.STATUS.WON);
            this.stopTimer();
        }

        return { revealed, status: this.status };
    }

    /**
     * Handle right-click (flag toggle)
     * @param {number} row
     * @param {number} col
     * @returns {object} result with cell and flag state
     */
    handleRightClick(row, col) {
        if (this.isGameOver()) {
            return { cell: null, flagged: false };
        }

        const cell = this.board.getCell(row, col);
        if (!cell || cell.isRevealed) {
            return { cell: null, flagged: false };
        }

        const flagged = cell.toggleFlag();
        return { cell, flagged };
    }

    /**
     * Get remaining mine count (mines - flags)
     * @returns {number}
     */
    getRemainingMines() {
        if (!this.board) return 0;
        const config = Game.DIFFICULTIES[this.difficulty];
        return config.mines - this.board.countFlags();
    }

    /**
     * Start the game timer
     */
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        }, 1000);
    }

    /**
     * Stop the game timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Get current game state for UI
     * @returns {object}
     */
    getState() {
        return {
            difficulty: this.difficulty,
            status: this.status,
            elapsedTime: this.elapsedTime,
            remainingMines: this.getRemainingMines(),
            board: this.board
        };
    }
}
