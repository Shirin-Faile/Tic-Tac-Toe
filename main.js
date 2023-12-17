$(() => {

    let currentPlayer, gameBoard, gameActive, turnCount, wins, losses, isAIPlayer;
    let isMuted = false;

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
        if (isAIPlayer && currentPlayer === 'O' && gameActive) {
            makeAIMove();
        } else {
            $('#player-info').text(`Player ${currentPlayer}'s turn`);
        }
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
        $('#player-info').text(`Player ${currentPlayer} wins!`);
        wins[currentPlayer]++;
        losses[currentPlayer === 'X' ? 'O' : 'X']++;
        updateScoreboard();
    };

    const announceDraw = () => {
        gameActive = false;
        $('.square').off('click');
        $('#player-info').text("It's a draw!");
        losses.X++;
        losses.O++;
        updateScoreboard();
    };

    const handleSquareClick = (event) => {
        const index = $(event.currentTarget).data('index');
        if (gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer;
            $(event.currentTarget).addClass('animate');
            $(event.currentTarget).text(currentPlayer);
            turnCount++;

            playClickSound();
    
            if (!checkWin()) {
                switchPlayer();
                updateGameInfo();
            }

            setTimeout(() => {
                $(event.currentTarget).removeClass('animate');
            }, 200);

        }
    };

    const playClickSound = () => {
        if (!isMuted) {
            const clickSound = new Audio('./clickeffect/cork-85200.mp3');
            clickSound.volume = 0.1;
            clickSound.play();
        }
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };

    const updateScoreboard = () => {
        const scoreboardElement = $('#scoreboard');
        
        const scoreboardText = `
            <p>Wins: X - ${wins['X']}, O - ${wins['O']}</p>
            <p>Losses: X - ${losses['X']}, O - ${losses['O']}</p>`;
    
        scoreboardElement.html(scoreboardText);
    };

    $('#replay-button').on('click', initializeGame);

    const toggleMute = () => {
        isMuted = !isMuted;
        const muteButton = $('#muteButton');

        if (isMuted) {
            muteButton.html('<img src="./clickeffect/icons8-no-audio-30.png" alt="muted">');
        } else {
            muteButton.html('<img src="./clickeffect/icons8-audio-30.png" alt="unmuted">');
        }
    };

    const makeAIMove = () => {
        const availableMoves = [];
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                availableMoves.push(i);
            }
        }
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        gameBoard[randomMove] = 'O';
        $(`.square[data-index="${randomMove}"]`).addClass('animate');
        $(`.square[data-index="${randomMove}"]`).text('O');
        turnCount++;
        playClickSound();

        if (!checkWin()) {
            switchPlayer();
            updateGameInfo();
        }
        setTimeout(() => {
            $(`.square[data-index="${randomMove}"]`).removeClass('animate');
        }, 200);
    };

    const createAIButton = () => {
        const aiButton = $('<button id="toggleAIButton"><img id="aiIcon" src="./clickeffect/two-players.png" alt="2-player"></button>');
        
        aiButton.on('click', () => {
            isAIPlayer = !isAIPlayer;
            updateAIButtonIcon();
        });
    
        $('#player-info').after(aiButton);
    };
    
    const updateAIButtonIcon = () => {
        const aiIcon = $('#aiIcon');
        const newIconSrc = isAIPlayer ? './clickeffect/ai.png' : './clickeffect/two-players.png';
        
        aiIcon.attr('src', newIconSrc);
        aiIcon.attr('alt', isAIPlayer ? 'AI' : '2-player');
    };
    createAIButton();

    $('#replay-button').on('click', initializeGame);
    $('#muteButton').on('click', toggleMute);

    initializeGame();
});