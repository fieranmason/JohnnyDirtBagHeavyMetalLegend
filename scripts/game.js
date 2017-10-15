var guidoDialogueText="Johnny: Hey Guido! I'm pretty hung over and I wanna guitar\n" +
									"Guido: Well Johnny, I've got this six string with 5 strings\n" +
									"on it... 20 bucks\n" +
									"Johnny: Fuck Guido, I've only got 25 bucks and theres a\n" +
									"kegger on tonight at Fred's place that's gonna cost me 10\n";
var guidoChoiceText="A: Imma make a market place that people \n" +
									"can use on the cmputer to buy the shit they want in some kinda \n" +
									"auction forum thing - cost (not living in the 80s)\n" +
									"B: How about I work a few hours and give you 15? cost - 15 bucks\n" +
									"C: Can I put it on credit? I promise I'll payya next week? \n" +
									"cost - Someone might break your legs.\n";

var fredDialogueText="Johnny: Hey Fred! That was an awesome kegger the other night. You were so wasted!\n" +
										"Fred: Yeah man ... I totally spaced and forgot about my orthodontist appointment in the morning\n" +
										"Johnny: Don't worry about your ears man, partying is more important\n" +
										"Fred: Yeah that's what my hangovers tellin me too.\n" +
										"Johnny: Hey Fred... I'm startin up a metal band. I just bought my Fender and I'm gonna be a legend.\n" +
										"wanna join my band?\n" +
										"Fred: ahh man, if I buy a guitar or some drums I won't be able to buy beer.\n" +
										"That would be lame, you should ask your other friends.\n";
var fredChoiceText="A:Use your computer to talk to your friends friends and \n" +
										"broadcast a casting call to your social network.\n" +
										"cost - not living in the 80s\n" +
										"B:Put in the hard work to talk to everyone who knows anyone\n"+
										"C:Go home and pout about how lame your friends are, smoke a J and crack a brewski.\n"

var tourDialogueText="Johnny: Man. If I wanna go on tour I'm gonna need a place to stay in LA.\n";

var tourChoiceText="A:Use your computer to talk to find an unoccupied house in a city you have to fly to.\n" +
										"you could even have a kegger there.\n" +
										"cost - not living in the 80s\n" +
										"B:Pay too much money for a hotel.\n" +
										"C:Look at classifieds in a paper that's two weeks old because its not local.\n";

var airportDialogueText="Flight Attendant: Welcome to the city of angels - the local time is 15 minutes to stardom.\n" +
													"Johnny: This is killer man, I've torally made it! Now we just need to get to our gig.\n";

var airportChoiceText="A:Use an app on the smart phone you don't have to call a stranger with a van to give\n" +
 												"you and your band a lift to your gig\n" +
												"cost - not living in the 80s\n" +
												"B:Hire the guy you met on the plane.\n" +
												"C:Stick our your thumb\n";

function progressivePrint(string, index, selector, callback, fcallback) {
	var delay=0;

	if(string.charAt(index)=='.') {
		delay=1;
	} else {
		delay=1;
	}

	if(string.charAt(index)=='\n') {
		$(selector).append("<br>");
	}

	$(selector).append(string[index++]);

	if(index<string.length) {
		setTimeout( function() {
			callback(string, index, selector, callback, fcallback);
		}, delay);
	} else {
		if(fcallback) {
			fcallback();
		} else {
			return;
		}

	}
}


function addSprite(selector, sprite, scale) {
	$(selector).append('<img id="' + sprite + '" src="./imgs/' + sprite + '.png" height="' + scale + '%"/>');
	return $('#' + sprite);
}

var left = 37;
var up = 38;
var right = 39;
var down = 40;
var stopped = 0;
var johnnySpeed = 3;

var johnnyHor = 0;
var johnnyVer = 0;

var johnny;
var guido;
var fred;
var phone;
var airport;

function startGame() {

	$('#canvas').css({position: 'relative'});
	var Johnny = "Johnny";


	johnny = addSprite('#canvas', "Johnny", 10);
	guido = addSprite('#canvas', "Guido", 10);

	$("#Johnny").offset({top:0, left:0});
	$("#Guido").offset({top: 100, left: 150});

	$(window).on('keyup', function(e) {
			var key = e.which;

			switch (key) {
				case left:
				case up:
				case right:
				case down:
					johnnyHor = 0;
					johnnyVer = 0;
					break;
				default:
			}
		});

	$(window).on('keydown', function (e) {
		var key = e.which;

		switch (key) {
			case left:
				johnnyHor = -johnnySpeed;
				johnnyVer = 0;
				console.log('left');
				break;
			case up:
				johnnyHor = 0;
				johnnyVer = -johnnySpeed;
				console.log('up');
				break;
			case right:
				johnnyHor = johnnySpeed;
				johnnyVer = 0;
				console.log('right');
				break;
			case down:
				johnnyHor = 0;
				johnnyVer = johnnySpeed;
				console.log('down');
				break;
			default :
				console.log(key);
				break;
		}
	});


	gameLoopGuido();

}

var guidoDialogue = false;
var fredDialogue = false;
var tourDialogue = false;
var airportDialogue = false;

function endGuidoLevel(){
		$("#Guido").remove();
		$("#GuidoDialogue").remove();
		startFredLevel();
}

function startFredLevel() {
	fred = addSprite('#canvas', "Fred", 10);
	gameLoopFred();
}

function endFredLevel() {
		$("#Fred").remove();
		$("#FredDialogue").remove();
		startTourLevel();
}


function startTourLevel() {
	phone = addSprite("#canvas", "Tour", 10);
	gameLoopTour();
}

function endTourLevel() {
		$("#Tour").remove();
		$("#TourDialogue").remove();
		startAirportLevel();
}

function startAirportLevel() {
	airport = addSprite("#canvas", "Airport", 20);
	gameLoopAirport();
}

function endAirportLevel() {
	$("#Airport").remove();
	$("#AirportDialogue").remove();

	progressivePrint("Johnny's show was amazing and he became a HEAVY METAL LEGEND", 0, "#canvas", progressivePrint);
}

function gameLoopGuido() {
	var passedGuido = false;

	goJohnny();

	if(collision(johnny, guido) && !guidoDialogue) {
		guidoDialogue = true;
		$('#canvas').append("<div id='GuidoDialogue'></div>");

		progressivePrint(guidoDialogueText, 0, '#GuidoDialogue', progressivePrint,

			function choiceDialogue1() {
				progressivePrint(guidoChoiceText, 0, "#GuidoDialogue", progressivePrint,
					function captureGuidoDialogueChoice() {
						$(window).on('keydown', function getGuidoChoice(e) {
							var key = e.which;
							console.log('key: ' + key);

							switch(key) {
								case 65:
									progressivePrint("Johnny: living in the eighties is bogus\n", 0, "#GuidoDialogue", progressivePrint);
									//play sound
									break;
								case 66:
									progressivePrint("Guido: You're a good kid Johnny - heres some free strings to get you started\n", 0, "#GuidoDialogue", progressivePrint, endGuidoLevel);
									$(window).off('keydown', getGuidoChoice);
									passedGuido = true;
									//play sound
									break;
								case 67:
									//cutscene
								progressivePrint("Johnny: that kegger was awesome, but my head is pounding ---- what day is it?...\n" +
																	"*knock* *knock* *knock*\n" +
																	"Johnny: hey dude, who are you?\n" +
																	"Rando: My name is Nails Pretty Boy Johnson.\n" +
																	"Nails: You got Guido's money?\n" +
																	"Johnny: Nah man, shit I totally spaced. I'll have it next week\n" +
																	"Nails: Guido said you told him the same thing last week\n" +
																	"Nails: The BILL IS DUE Johnny\n" +
																	"Johnny: Nooooo --- screaming\n", 0, "#GuidoDialogue", progressivePrint);
																	//play sound
								break;
							}
						});
					});
			}
		);
	}

	if(!passedGuido) {
		setTimeout( function () {
			gameLoopGuido();
		}, 25);
	}
}

function gameLoopFred() {
	var passedFred = false;

	goJohnny();

	if(collision(johnny, fred) && !fredDialogue) {
		fredDialogue = true;
		$('#canvas').append("<div id='FredDialogue'></div>");

		progressivePrint(fredDialogueText, 0, '#FredDialogue', progressivePrint,
			function choiceDialogue2() {
				progressivePrint(fredChoiceText, 0, "#FredDialogue", progressivePrint,
					function captureFredDialogueChoice() {
						$(window).on('keydown', function getFredChoice(e) {
							var key = e.which;
							console.log('key: ' + key);

							switch(key) {
								case 65:
									progressivePrint("Johnny: the eighties suck I wish I had that Delorian so I could go to the future and live there\n", 0, "#FredDialogue", progressivePrint);
									//play sound
									break;
								case 66:
									progressivePrint("... six weeks later Johnny and is heavy metal heros have their first practice in his mom's garage\n", 0, "#FredDialogue", progressivePrint, endFredLevel);
									$(window).off('keydown', getFredChoice);
									passedFred = true;
									//play sound
									break;
								case 67:
									//cutscene
									progressivePrint("...six years later - Johnny: Man I'm such a hoser, I still haven't moved out of my moms basement.\n" +
								 									"I have to steal from dad and my friends cuz I can't even afford my own weed\n", 0, "#FredDialogue", progressivePrint);
																	//play sound
								break;
							}
						});
					});
			});
	}

	if(!passedFred) {
		setTimeout( function () {
			gameLoopFred();
		}, 25);
	}
}


function gameLoopTour() {
	var passedTour = false;

	goJohnny();

	if(collision(johnny, phone) && !tourDialogue) {
		tourDialogue = true;
		$('#canvas').append("<div id='TourDialogue'></div>");


		progressivePrint(tourDialogueText, 0, '#TourDialogue', progressivePrint,
			function choiceDialogue2() {
				progressivePrint(tourChoiceText, 0, "#TourDialogue", progressivePrint,
					function captureTourDialogueChoice() {
						$(window).on('keydown', function getTourChoice(e) {
							var key = e.which;
							console.log('key: ' + key);

							switch(key) {
								case 65:
									progressivePrint("Johnny: the eighties are bunk I should go to school and learn how to build technology solutions\n", 0, "#TourDialogue", progressivePrint);
									//play sound
									break;
								case 66:
									progressivePrint("Johnny: paying for hotels is lame, but I'll never become a Heavy Metal Legend if I don't put\n" +
																		" put myself into a position to be lucky. But for the record I don't belive in luck.\n", 0, "#TourDialogue", progressivePrint, endTourLevel);
									$(window).off('keydown', getTourChoice);
									passedTour = true;
									//play sound
									break;
								case 67:
									//cutscene
									progressivePrint("...six weeks later - Johnny: This is lame, I'll never be a legend, I think I'll just hangmyself with my guitar strap\n", 0, "#TourDialogue", progressivePrint);
																	//play sound
									break;
							}
						});
					});
			});
	}

	if(!passedTour) {
		setTimeout( function () {
			gameLoopTour();
		}, 25);
	}
}


function gameLoopAirport() {
	var passedAirport = false;

	goJohnny();

	if(collision(johnny, airport) && !airportDialogue) {
		airportDialogue = true;
		$('#canvas').append("<div id='AirportDialogue'></div>");


		progressivePrint(airportDialogueText, 0, '#AirportDialogue', progressivePrint,
			function choiceDialogue2() {
				progressivePrint(airportChoiceText, 0, "#AirportDialogue", progressivePrint,
					function captureTourDialogueChoice() {
						$(window).on('keydown', function getAirportChoice(e) {
							var key = e.which;
							console.log('key: ' + key);

							switch(key) {
								case 65:
									progressivePrint("Johnny: I'm done - I going to start an Uber good company\n", 0, "#AirportDialogue", progressivePrint);
									//play sound
									break;
								case 66:
									progressivePrint("Johnny: Well shit - guess I'll have to hire a rody.\n", 0, "#AirportDialogue", progressivePrint, endAirportLevel);
									$(window).off('keydown', getAirportChoice);
									passedAirport = true;
									//play sound
									break;
								case 67:
									//cutscene
									progressivePrint("Johnny: Guess I'll hitch a ride\n" +
																	"Rando: Yeah I can give you a lift\n" +
																	"Johnny: Thanks man\n" +
																	"*slam* *vroom*\n" +
																	"Rando: You're kinda pretty *rubs Johnny's leg*\n" +
																	"Johnny: This isn't cool man\n" +
																	"Perv: Common, this won't hurt a bit\n" +
																	"Johnny: Stoooop\n" +
																	"Perv: RAHHGHGHGHGHGH\n" +
																	"Johnny: *screams*\n", 0, "#AirportDialogue", progressivePrint);
																	//play sound
									break;
							}
						});
					});
			});
	}

	if(!passedAirport) {
		setTimeout( function () {
			gameLoopAirport();
		}, 25);
	}
}

function collision(object1, object2) {
	var offset1 = object1.offset;
	var top1 = offset1.top;
	var left1 = offset1.left;
	var width1

	var offset2 = object2.offset();
	var top2 = offset2.top;
	var left2 = offset2.left;

	var rect1 = {x: object1.offset().left, y: object1.offset().top, width: object1.width(), height: object1.height()}
	var rect2 = {x: object2.offset().left, y: object2.offset().top, width: object2.width(), height: object2.height()}

	if (rect1.x < rect2.x + rect2.width &&
  	rect1.x + rect1.width > rect2.x &&
  	rect1.y < rect2.y + rect2.height &&
  	rect1.height + rect1.y > rect2.y) {
    return true;
	}

	return false;
}


function goJohnny() {
	var offset = $('#Johnny').offset();

	var top = offset.top;

	var left = offset.left;

	$('#Johnny').offset({top:offset.top + johnnyVer, left:offset.left+johnnyHor});
}
