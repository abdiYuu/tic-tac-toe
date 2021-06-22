const createBoard = function() {
	const board = new Array(9)

	const update = function(value, position) {
		board.splice(position, 1, value);
	}
	const clear = function() {
		board = new Array(9);
	}
	const hasLine = function() {
		let row = board.some((space, index) => space === board[index-1] && space === board[index+1])
		let column = board.some((space, index) => space === board[index-3] && space === board[index+3])
		let diag = board.some((space, index) => space === board[index-4] && space === board[index+4])
		
		if([row, column, diag].includes(true)) {return true};
		return false;
	}
	const isFull = function() {
		return (board.findIndex(position => position === undefined) === -1) ? true : false;
	}
	return {update, clear, hasLine, isFull, board}

}



const controlDisplay = function() {

	const update = function(value, position) {
		position.innerText = value;
	}

	return {update}

}

const runGame = function() {

	let player;

	const start = function(e){
		player = Player(e.target.id).value;
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.addEventListener('click', round));

	}

	const end = function() {
		const grid = document.querySelectorAll('.square');
		grid.forEach(square => square.removeEventListener('click', round));
	}

	const restart = {};

	const round = function(e) {
		let position = e.target;
		let index = e.target.id

		gameBoard.update(player, index)
		position.removeEventListener('click', round);

		let square = e.target;
		display.update(player, position);

		if(gameBoard.hasLine()) {
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

