/**
 * UI module - handles DOM interactions and rendering
 *
 * Features:
 * - Grid rendering with classic 3D cell style
 * - Face button with state emojis
 * - LED-style mine counter and timer
 * - Cell press animation
 * - Wrong flag indicators on game over
 */
(function() {
    // Face states
    const FACE = {
        playing: '😊',
        clicking: '😮',
        won: '😎',
        lost: '💀'
    };

    // DOM elements
    const boardEl = document.getElementById('board');
    const difficultyEl = document.getElementById('difficulty');
    const faceBtnEl = document.getElementById('face-btn');
    const mineCountEl = document.querySelector('#mine-count span');
    const timerEl = document.querySelector('#timer span');
    const statusEl = document.getElementById('game-status');

    // Game instance
    const game = new Game();

    // Currently pressed cell (for animation)
    let pressedCell = null;

    /**
     * Initialize the game UI
     */
    function init() {
        faceBtnEl.addEventListener('click', startNewGame);
        difficultyEl.addEventListener('change', startNewGame);

        // Global mouse up to reset face
        document.addEventListener('mouseup', handleGlobalMouseUp);

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
        updateFace(FACE.playing);
    }

    /**
     * Render the game board
     */
    function renderBoard() {
        const board = game.board;
        boardEl.innerHTML = '';
        boardEl.style.gridTemplateColumns = `repeat(${board.cols}, var(--cell-size))`;

        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.cols; col++) {
                const cellEl = document.createElement('div');
                cellEl.className = 'cell';
                cellEl.dataset.row = row;
                cellEl.dataset.col = col;
                cellEl.setAttribute('role', 'gridcell');
                cellEl.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}, hidden`);

                cellEl.addEventListener('click', handleCellClick);
                cellEl.addEventListener('contextmenu', handleCellRightClick);
                cellEl.addEventListener('mousedown', handleCellMouseDown);
                cellEl.addEventListener('mouseup', handleCellMouseUp);
                cellEl.addEventListener('mouseleave', handleCellMouseLeave);

                boardEl.appendChild(cellEl);
            }
        }
    }

    /**
     * Handle mouse down on cell (press animation)
     * @param {MouseEvent} e
     */
    function handleCellMouseDown(e) {
        if (e.button !== 0) return; // Only left click
        if (game.status === 'won' || game.status === 'lost') return;

        const cell = game.board.getCell(
            parseInt(e.target.dataset.row),
            parseInt(e.target.dataset.col)
        );

        if (cell && !cell.isRevealed && !cell.isFlagged) {
            e.target.classList.add('pressed');
            pressedCell = e.target;
            updateFace(FACE.clicking);
        }
    }

    /**
     * Handle mouse up on cell
     * @param {MouseEvent} e
     */
    function handleCellMouseUp(e) {
        if (pressedCell) {
            pressedCell.classList.remove('pressed');
            pressedCell = null;
        }

        if (game.status !== 'won' && game.status !== 'lost') {
            updateFace(FACE.playing);
        }
    }

    /**
     * Handle mouse leaving cell (cancel press)
     * @param {MouseEvent} e
     */
    function handleCellMouseLeave(e) {
        if (pressedCell === e.target) {
            e.target.classList.remove('pressed');
            if (game.status !== 'won' && game.status !== 'lost') {
                updateFace(FACE.playing);
            }
        }
    }

    /**
     * Handle global mouse up (reset face if clicking stopped elsewhere)
     * @param {MouseEvent} e
     */
    function handleGlobalMouseUp(e) {
        if (pressedCell) {
            pressedCell.classList.remove('pressed');
            pressedCell = null;
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
            showWrongFlags();
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
            cellEl.setAttribute('aria-label',
                `Row ${cell.row + 1}, Column ${cell.col + 1}, ` +
                (cell.hasMine ? 'mine' : cell.adjacentMines > 0 ? `${cell.adjacentMines} adjacent mines` : 'empty')
            );

            if (cell.hasMine) {
                cellEl.classList.add('mine');
                cellEl.textContent = '💣';
            } else if (cell.adjacentMines > 0) {
                cellEl.classList.add(`adjacent-${cell.adjacentMines}`);
                cellEl.textContent = cell.adjacentMines;
            } else {
                cellEl.textContent = '';
            }
        } else if (cell.isFlagged) {
            cellEl.classList.add('flagged');
            cellEl.textContent = '🚩';
            cellEl.setAttribute('aria-label',
                `Row ${cell.row + 1}, Column ${cell.col + 1}, flagged`
            );
        } else {
            cellEl.textContent = '';
            cellEl.setAttribute('aria-label',
                `Row ${cell.row + 1}, Column ${cell.col + 1}, hidden`
            );
        }
    }

    /**
     * Show wrong flags after game over
     */
    function showWrongFlags() {
        const board = game.board;
        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.cols; col++) {
                const cell = board.getCell(row, col);
                if (cell.isFlagged && !cell.hasMine) {
                    const cellEl = getCellElement(row, col);
                    cellEl.classList.add('wrong-flag');
                    cellEl.classList.add('revealed');
                    cellEl.innerHTML = '💣<span style="position:absolute;color:red;font-size:20px;">✕</span>';
                    cellEl.style.position = 'relative';
                }
            }
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
     * Update face button emoji
     * @param {string} face
     */
    function updateFace(face) {
        faceBtnEl.textContent = face;
    }

    /**
     * Format number as 3-digit LED display
     * @param {number} num
     * @returns {string}
     */
    function formatLED(num) {
        if (num < 0) {
            // Show negative with minus sign
            return '-' + String(Math.abs(num)).padStart(2, '0').slice(0, 2);
        }
        return String(Math.min(num, 999)).padStart(3, '0');
    }

    /**
     * Update status bar
     */
    function updateStatus() {
        const state = game.getState();
        mineCountEl.textContent = formatLED(state.remainingMines);
        timerEl.textContent = formatLED(state.elapsedTime);

        switch (state.status) {
            case 'won':
                statusEl.textContent = 'You Win!';
                statusEl.className = 'win';
                updateFace(FACE.won);
                break;
            case 'lost':
                statusEl.textContent = 'Game Over';
                statusEl.className = 'lose';
                updateFace(FACE.lost);
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
        timerEl.textContent = formatLED(state.elapsedTime);
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
