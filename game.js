var message="Hello World!";


function progressivePrint(string, index, callback) {
	var delay=0;
	
	if(string.charAt(index)==' ') {
		delay=750;
	} else {
		delay=150;
	}

	$('#canvas').before(string[index++]);

	if(index<string.length) {
		setTimeout( function() {
			callback(string, index, callback);
		}, delay);
	} else {
		return;
	}
}

function startGame() {
	progressivePrint(message, 0, progressivePrint);
}
