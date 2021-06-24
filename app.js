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

	return {update, clear, checkWin, isFull, board}

}




const controlDisplay = function() {

	const update = function(value, square) {
		square.innerText = value;
	}

	const clear = function() {
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.innerText = '');
		const overlay = document.querySelector('.overlay');
		overlay.style.display = 'none';
		const restart = document.querySelector('.restart');
		restart.style.display='none';
	}
	
	const currentPlayer  = function() {
	}

	const result = function(winner) {
		const overlay = document.querySelector('.overlay');
		const msg = document.querySelector('.msg')
		const restart = document.querySelector('.restart')

		overlay.style.display='flex';

		if(!winner) {
			msg.innerText = `It's a tie!`;
		} else {
			msg.innerText = `${winner.toUpperCase()} wins!`
		}
		restart.style.display='block';
		restart.addEventListener('click', game.restart);
	}

	return {update, clear, result}

}




const runGame = function() {

	let player;

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
	const initialize = function(new_state, old_state=null){
		const options  = document.querySelectorAll('.option');
		if (old_state !== null) {
			options.forEach(option => option.removeEventListener('click', old_state));
		}
		options.forEach(option => option.addEventListener('click', new_state));
	}


	const start = function(e){
		player = Player('human', e.target.id).value;
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.addEventListener('click', round));

		initialize(restart, start);
	}

	const end = function() {
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.removeEventListener('click', round));
	}

	const restart = function(){
		gameBoard.clear();
		display.clear();
		initialize(start, restart);
	}

	const round = function(e) {
		let square = e.target;
		let row = e.target.classList[1]
		let position = e.target.id;
		let value = player;

		gameBoard.update(value, row, position);
		display.update(value, square);
		square.removeEventListener('click', round);

		if(gameBoard.checkWin()) {
			return win(player);
		}

		if(gameBoard.isFull()) {
			return tie();
		}

		if(player === 'x') {
			player = 'o';
		} else {
			player = 'x';
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

	return {initialize, start, restart, round, win, tie};
}

const Player = function(type, value) {
	return {type, value}
}

const gameBoard = createBoard();
const game = runGame();
const display = controlDisplay();

game.initialize(game.start);
