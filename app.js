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
				if(!(row.every(position => position === 'o' || position === 'x'))) {return false};
			}
			return true;
		}

		const fullColumn = function() {
			if (board.row1.some((item, index) => item === board.row2[index] && item === board.row3[index])) {return true};
			return false;
		}
		const fullDiag = function() {
			if (board.row1[1] === board.row2[2] && board.row1[1] === board.row3[3] ||
			    board.row1[3] === board.row2[2] && board.row1[3] === board.row3[1]) {
				return true;
			}else {
				return false;
			}
		}

	}
	const isFull = function() {
		for (let row of Object.keys(board)) {
			if (row.findIndex(position=> position === undefined) === -1) {return true};
		}
		return false;
	}
	return {update, clear, checkWin, isFull, board}

}



const controlDisplay = function() {

	const update = function(value, position) {
		position.innerText = value;
	}

	const clear = function() {
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.innerText = '');
	}

	return {update, clear}

}

const runGame = function() {

	let player;

	const start = function(e){
		player = Player(e.target.id).value;
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.addEventListener('click', round));

		btns.forEach(btn => btn.removeEventListener('click', game.start));
	}

	const end = function() {
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.removeEventListener('click', round));
	}

	const restart = function(){
		gameBoard.clear();
		display.clear();
	}

	const round = function(e) {
		let position = e.target;
		let index = e.target.id

		gameBoard.update(player, index)
		position.removeEventListener('click', round);

		let square = e.target;
		display.update(player, position);

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
		console.log(`Player ${player} wins!`);
	}
	const tie = function() {
		end();
		console.log(`It's a tie!`);
	}

	return {start, restart, round, win, tie};
}

const Player = function(value) {
	return {value}
}

const gameBoard = createBoard();
const game = runGame();
const display = controlDisplay();


const btns = document.querySelectorAll('.btn');
btns.forEach(btn => btn.addEventListener('click', game.start));

