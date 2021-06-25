const createBoard = function() {
	const board = {
		row1:new Array(3),
		row2:new Array(3),
		row3:new Array(3)
	}
	const update = function(value, row, position) {
		board[row][position] = value;
	}
	const clear = function() {
		board.row1 = new Array(3);
		board.row2 = new Array(3);
		board.row3 = new Array(3);
	}
	const checkWin = function() {
		const fullRow = function() {
			for(row in board) {
				if(board[row][0] !== undefined &&
				   board[row][0] === board[row][1] &&
				   board[row][0] === board[row][2]) {
					return true;
				}
			}
			return false;
		}

		const fullColumn = function() {
			return board.row1.some((item, index) => item === board.row2[index] && item === board.row3[index])
		}
		const fullDiag = function() {
			if (board.row1[0] !== undefined &&
			    board.row1[0] === board.row2[1] && board.row1[0] === board.row3[2] ||
			    board.row1[2] !== undefined &&
			    board.row1[2] === board.row2[1] && board.row1[2] === board.row3[0]) {
				return true;
			}else {
				return false;
			}
		}

		return [fullRow(), fullColumn(), fullDiag()].includes(true);

	}
	const isFull = function() {
		for (row in board) {
			if (!(board[row].findIndex(position=> position === undefined) === -1)) {return false};
		}
		return true;
	}

	const takenPosition = function(row, position) {
		if (board[row][position] === undefined) {
			return false;
		} else {
			return true;
		}
	}

	return {update, clear, checkWin, isFull}

}




const controlDisplay = function() {

	const selectors = function() {
		const grid = document.querySelectorAll('.square');
		const overlay = document.querySelector('.overlay');
		const restartBtn = document.querySelector('.restart')
		const player_display = document.querySelector('.players');
		const resultMsg = document.querySelector('.msg');
		return {grid, overlay, restartBtn, player_display, resultMsg};
	}
	
	let {grid, overlay, restartBtn, player_display, resultMsg} = selectors();

	const update = function(value, square) {
		square.innerText = value;
	}
	const clearGrid = function() {
		grid.forEach(square => square.innerText ='');
	}
	const clearAll = function() {
		grid.forEach(square => square.innerText = '');
		overlay.style.display = 'none';
		restartBtn.style.display='none';
		player_display.innerText='Choose your weapon!';
	}
	
	const showPlayers  = function(p1, p2) {
		player_display.innerText = `P1: ${p1.value.toUpperCase()} vs P2: ${p2.value.toUpperCase()}`
		
	}

	const result = function(winner) {
		overlay.style.display='flex';

		if(!winner) {
			resultMsg.innerText = `It's a tie!`;
		} else {
			resultMsg.innerText = `Player ${winner} wins!`
		}
		restartBtn.style.display='block';
		restartBtn.addEventListener('click', game.restart);
	}

	return {update, clearGrid, clearAll, result, showPlayers}

}




const runGame = function() {

	let p1;
	let p2;
	let currentPlayer;

// starting point for p-v-cpu functionality

/*	const cpuPlay = function(value) {
		let row = 'row' + (Math.floor(Math.random() * 3) + 1);
		let position = Math.floor(Math.random() * 3);

		while (gameBoard.takenPosition(row, position)) {
			let row = 'row' + (Math.floor(Math.random() * 3) + 1);
			let position = Math.floor(Math.random() * 3);
		}
		gameBoard.update(value, row, position);

		let square = document.querySelector(`.${row}, #\\${position}`)
		display.update(value, square)
		square.removeEventListener('click', round)
	}
*/
	const start = function(e) {
		gameBoard.clear();
		display.clearGrid();
		p1 = Player(1, e.target.id);
		if(p1.value === 'x') {
			p2 = Player(2, 'o');
		}else {
			p2 = Player(2, 'x');
		}
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.addEventListener('click', round));

		currentPlayer = p1;
		display.showPlayers(p1, p2);
	}

	const end = function() {
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.removeEventListener('click', round));
	}

	const restart = function(){
		gameBoard.clear();
		display.clearAll();
	}

	const round = function(e) {
		let square = e.target;
		let row = e.target.classList[1]
		let position = e.target.id;
		let value = currentPlayer.value;

		gameBoard.update(value, row, position);
		display.update(value, square);
		square.removeEventListener('click', round);

		if(gameBoard.checkWin()) {
			return win(currentPlayer.num);
		}

		if(gameBoard.isFull()) {
			return tie();
		}

		if(currentPlayer === p1) {
			currentPlayer = p2;
		} else {
			currentPlayer = p1;
		}
	}

	const win = function(player) {
		end();
		display.result(player);
	}
	const tie = function() {
		end();
		display.result();
	}

	return {start, restart, round, win, tie};
}

const Player = function(num, value) {
	return {num, value}
}

const gameBoard = createBoard();
const game = runGame();
const display = controlDisplay();

const options = document.querySelectorAll('.option');
options.forEach(option => option.addEventListener('click', game.start));
