(function( afable, undefined ){

  'use strict';

  let KEYS = { SPACE : 32 }, STATES = { INTRO : 0, TALK : 1, WALK : 2 };

  let game, t, dt, newTime, frameTime, currTime, accumulator;
  let talker, convos;
  let keyboard, keysDown;
  let canvas, ctx;



  /**
   * init
   */
  (function init() {

    game = { state: STATES.TALK, stopGameLoop: 0, pauseTime: 0 };
    t = 0, dt = 1/240, currTime = performance.now(), accumulator = 0;
    talker = { lastTime: 0, delay: 1 };
    convos = { curr: '', count: 0, dialogCount: 0, dialog: [
      { text: "Hi.  I'm JOHNNY DIRTBAGS. And I want to be a rockstar!!!",
        img: './img/idle.gif' },
      { text: 'Look, I get to wherever I need to go because of ME.',
        img: './img/run.gif' },
      { text: 'There are a few things I need to do before I can succeed',
        img: './img/ledge grab.gif' },
      { text: '... ANd I blame all my problems on this god-forsaken era...',
        img: './img/mid air.gif' },
      { text: 'So whaddya say ..? Want to help me get to the top..?',
        img: './img/idle.gif' },
      { text: undefined, img: '../img/idle.gif' },
    ], wait: false, audio: new Audio( './audio/typewriter.mp3') };
    convos.isDone = function() {
      if ( convos.dialog[ convos.dialogCount ].text === undefined ) {
        return true;
      }
      return false;
    }

    // init handle keyboard input
    keyboard = {

      keys : {},
      keyPress : function( e ) {
        if ( this.keys[e.keyCode] > 0 ) { return; }
        this.keys[e.keyCode] = e.timeStamp || ( performance.now() );
        e.stopPropagation();
      },

      keyRelease: function( e ) {
        this.keys[e.keyCode] = 0;
        e.stopPropagation();
      }

    };
    keysDown = {};

    // add keyboard event listeners and bind 'this' to keyboard
    window.addEventListener( 'keydown', keyboard.keyPress.bind( keyboard ), false );
    window.addEventListener( 'keyup', keyboard.keyRelease.bind( keyboard ), false );

    // setup canvas height & width to viewport screen and on resize
    canvas = document.getElementsByTagName( 'canvas' )[0];
    ctx = canvas.getContext( '2d' );
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    window.addEventListener( 'resize', onWindowResize, false );

    // start a rAF for gameloop
    requestAnimationFrame( gameloop );

  }());



  /**
   * game loop
   */
  function gameloop() {

    game.stopGameLoop = requestAnimationFrame( gameloop );

    newTime = performance.now();
    frameTime = newTime - currTime;
    frameTime *= 0.001; //need frame time in seconds
    currTime = newTime;

    accumulator += frameTime;

    if ( game.pauseTime > 0 ) {
      game.pauseTime -= accumulator;
      return;
    }

    while ( accumulator >= dt ) {

      // handle inputs, physics, and draw
      handleInputs( game.state, t, dt );
      updatePhysics( game.state, t, dt );

      accumulator -= dt;
      t += dt;

    }

    draw( game.state, t, frameTime );

    // swap between TALK and WALK states
    game.state = ( convos.isDone() )? STATES.WALK : STATES.TALK;
    console.log( game.state );

  }



  /**
   * handle inputs
   */
  function handleInputs( state, t, dt ) {

    if ( keyboard.keys[KEYS.SPACE] )  {
      console.log( 'space downnnnn' );

      // only fire once on each keydown (undefined or 0)
      if ( !keysDown[KEYS.SPACE] ) {

        if ( state === STATES.INTRO ) {
          console.log( 'SPACE pressed during intro!' );
        }

        if ( state === STATES.TALK ) {
          // convo waiting on input... to proceed
          if ( convos.wait ) {
            convos.wait = !convos.wait;
            document.getElementsByTagName( 'i' )[0]
              .classList.toggle( 'blink' );

            // increment if not very last dialog
            console.log( convos.dialog[convos.dialogCount] );
            if ( !convos.isDone() ) {
              convos.dialogCount++;
            }

          } else {
          // otherwise convo still talking... rush it
            convos.count = convos.curr.length-1;
          }



        }


      }

    }

    // keep track of key presses for fire once per keypress
    keysDown[KEYS.SPACE] = keyboard.keys[KEYS.SPACE];

  }



  /**
   * update physics
   */
  function updatePhysics( state, t, dt ) {
  }



  /**
   * draw
   */
  function draw( state, t, frameTime ) {

    if ( state === STATES.TALK ) {
      bantr( { delay : 0.1,
               text : convos.dialog[convos.dialogCount].text
      });
    }

    if ( state === STATES.WALK ) {
      let img = document.getElementById( 'talkie-img' );
      if ( img.style.opacity === '1' ) {
        img.classList.add( 'fade-out' );
      }
      let box = document.getElementById( 'talkie-box' );
      if ( box.style.opacity === '1' ) {
        box.classList.add( 'fade-out' );
      }
    }

  }



  /**
   * retain canvas full screen to viewport on resize
   */
  function onWindowResize() {

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    draw( game.state, t, frameTime );

  }



  function bantr( ops ) {

    let delay = ( ops.delay )? ops.delay : talker.delay;
    let text = ( ops.text )? ops.text : '';

    // wait for input to proceed to next convo
    if ( convos.wait ) { return; }

    // setup new conversation
    if ( convos.count === 0 ) {
      convos.curr = text;
      let img = document.getElementById( 'talkie-img' );
      img.src = convos.dialog[convos.dialogCount].img;
      img.style.height= '66%';
      img.style.width = 'auto';

      game.pauseTime += 10;
    }

    // print out each letter of current TALK
    if ( talker.lastTime + delay < t ) {

      // increment letter
      convos.count++;
      let p = document.getElementById( 'talkie' );
      p.firstChild.textContent = convos.curr.substr( 0, convos.count );

      // play audio while printing
      convos.audio.play();

      talker.lastTime = t;
    }

    // close off finished conversations and wait for input
    if ( convos.count === convos.curr.length ) {
      convos.count = 0;
      convos.wait = true;
      document.getElementsByTagName( 'i' )[0]
        .classList.toggle( 'blink' );

    }

  }

}( window.afable = window.afable || {} ));
