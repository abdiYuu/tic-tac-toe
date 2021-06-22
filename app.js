const createBoard = function() {
	const board = new Array(9)

	const update = function(value, position) {
		board.splice(position, 1, value);
	}
	const clear = function() {
		board = new Array(9);
	}
	const checkWin = function() {
		let row = board.some((space, index) => space === board[index-1] && space === board[index+1])
		let column = board.some((space, index) => space === board[index-3] && space === board[index+3])
		let diag = board.some((space, index) => space === board[index-4] && space === board[index+4])
		return row;
	}

	return {update, clear, checkWin}

}

gameBoard = createBoard();


