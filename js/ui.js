/**
 * UI module - handles DOM interactions and rendering
 *
 * Connects Game logic to the HTML interface
 */
(function() {
    // DOM elements
    const boardEl = document.getElementById('board');
    const difficultyEl = document.getElementById('difficulty');
    const newGameBtn = document.getElementById('new-game');
    const mineCountEl = document.querySelector('#mine-count span');
    const timerEl = document.querySelector('#timer span');
    const statusEl = document.getElementById('game-status');

    // Game instance
    const game = new Game();

    /**
     * Initialize the game UI
     */
    function init() {
        newGameBtn.addEventListener('click', startNewGame);
        difficultyEl.addEventListener('change', startNewGame);
        startNewGame();
    }

    /**
     * Start a new game
     */
    function startNewGame() {
        const difficulty = difficultyEl.value;
        game.newGame(difficulty);
        renderBoard();
        updateStatus();
    }

    /**
     * Render the game board
     */
    function renderBoard() {
        const board = game.board;
        boardEl.innerHTML = '';
        boardEl.style.gridTemplateColumns = `repeat(${board.cols}, 30px)`;

        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.cols; col++) {
                const cellEl = document.createElement('div');
                cellEl.className = 'cell';
                cellEl.dataset.row = row;
                cellEl.dataset.col = col;

                cellEl.addEventListener('click', handleCellClick);
                cellEl.addEventListener('contextmenu', handleCellRightClick);

                boardEl.appendChild(cellEl);
            }
        }
    }

    /**
     * Handle left click on cell
     * @param {Event} e
     */
    function handleCellClick(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const result = game.handleClick(row, col);

        for (const cell of result.revealed) {
            updateCellDisplay(cell);
        }

        if (result.hitMine) {
            const hitEl = getCellElement(result.hitMine.row, result.hitMine.col);
            hitEl.classList.add('hit');
        }

        updateStatus();
    }

    /**
     * Handle right click on cell (flag)
     * @param {Event} e
     */
    function handleCellRightClick(e) {
        e.preventDefault();
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const result = game.handleRightClick(row, col);

        if (result.cell) {
            updateCellDisplay(result.cell);
        }

        updateStatus();
    }

    /**
     * Update a cell's display
     * @param {Cell} cell
     */
    function updateCellDisplay(cell) {
        const cellEl = getCellElement(cell.row, cell.col);
        if (!cellEl) return;

        cellEl.className = 'cell';

        if (cell.isRevealed) {
            cellEl.classList.add('revealed');
            if (cell.hasMine) {
                cellEl.classList.add('mine');
                cellEl.textContent = '💣';
            } else if (cell.adjacentMines > 0) {
                cellEl.classList.add(`adjacent-${cell.adjacentMines}`);
                cellEl.textContent = cell.adjacentMines;
            }
        } else if (cell.isFlagged) {
            cellEl.classList.add('flagged');
            cellEl.textContent = '🚩';
        } else {
            cellEl.textContent = '';
        }
    }

    /**
     * Get DOM element for cell
     * @param {number} row
     * @param {number} col
     * @returns {HTMLElement|null}
     */
    function getCellElement(row, col) {
        return boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    /**
     * Update status bar
     */
    function updateStatus() {
        const state = game.getState();
        mineCountEl.textContent = state.remainingMines;
        timerEl.textContent = state.elapsedTime;

        switch (state.status) {
            case 'won':
                statusEl.textContent = '🎉 You Win!';
                statusEl.className = 'win';
                break;
            case 'lost':
                statusEl.textContent = '💥 Game Over';
                statusEl.className = 'lose';
                break;
            default:
                statusEl.textContent = '';
                statusEl.className = '';
        }
    }

    /**
     * Update timer display (called by interval)
     */
    function updateTimer() {
        const state = game.getState();
        timerEl.textContent = state.elapsedTime;
    }

    // Start timer update interval
    setInterval(updateTimer, 1000);

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
