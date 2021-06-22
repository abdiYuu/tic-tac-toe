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

}

const runGame = function() {
	const start = function(){
		const grid = document.querySelectorAll('.square')
		grid.forEach(square => square.addEventListener('click', round));
	}
	const restart = {};

	const round = function(e) {
		let position = Number(e.target.id);
		gameBoard.update('x', position)
		e.target.removeEventListener('click', round);
	}

	const win = {}
	const tie = {}

	return {start, restart, round, win, tie};
}



const gameBoard = createBoard();
const game = createGame();
const display = controlDisplay();

