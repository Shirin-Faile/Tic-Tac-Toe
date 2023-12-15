$(() => {

    let currentPlayer, gameBoard, gameActive, turnCount, wins, losses;

    wins = { 'X': 0, 'O': 0};
    losses = { 'X': 0, 'O': 0};
    
    const initializeGame = () => {
        currentPlayer = 'X'
        gameBoard = Array(9).fill('');
        gameActive = true;
        turnCount = 0;
        updateScoreboard();
        createGameBoard();
        updateGameInfo();
        $('.square').on('click', handleSquareClick);
        $('#replay-button').show();
    };

    const createGameBoard = () => {
        const board = $('#game-board');
        board.empty();
        for (let i = 0; i < 9; i++) {
            board.append(`<div class="square" data-index="${i}"></div>`);
        }
    };

    const updateGameInfo = () => {
        $('#game-info').text(`Player ${currentPlayer}'s turn`);
    };

    const checkWin = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]   
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
                announceWinner();
                return true;
            }
        }

        if (turnCount === 9) {
            announceDraw();
            return true;
        }
        return false;
    };

    const announceWinner = () => {
        gameActive = false;
        $('.square').off('click');
        $('#game-info').text(`Player ${currentPlayer} wins!`);
        wins[currentPlayer]++;
        losses[currentPlayer === 'X' ? 'O' : 'X']++;
        updateScoreboard();
    };

    const announceDraw = () => {
        gameActive = false;
        $('.square').off('click');
        $('#game-info').text("It's a draw!");
        losses.X++;
        losses.O++;
        updateScoreboard();
    };

    const handleSquareClick = (event) => {
        const index = $(event.currentTarget).data('index');
        if (gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer;
            $(event.currentTarget).text(currentPlayer);
            turnCount++;
    
            if (!checkWin()) {
                switchPlayer();
                updateGameInfo();
            }
        }
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };

    const updateScoreboard = () => {
        $('#scoreboard').text(`Wins: X - ${wins['X']}, O - ${wins['O']} | Losses: X - ${losses['X']}, O - ${losses['O']}`);
    };

    $('#replay-button').on('click', initializeGame);

    initializeGame();

});