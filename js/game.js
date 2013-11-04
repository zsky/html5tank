$(document).ready(function() {
	var canvas = $("#gameCanvas");
	var context = canvas.get(0).getContext("2d");
	
	// Canvas dimensions
	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();
	
	// Game settings
	var playGame;
    var tanks = new Array(); 
    var grids = new Array();
    var gridWidth = 12;
    var gridHeight =12;
    var mapWidth = 32;
    var mapHeight = 32;
    var playerNum;
    var playerOne;
    var playerTwo;
    var map=[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]];
	
    // keyboard keycodes
    var arrowLeft = 37;
    var arrowUp = 38;
    var arrowRight = 39;
    var arrowDown = 40;
    var space = 32;
	// Game UI
	var ui = $("#gameUI");
	var uiStart = $("#gameStart");
	var uiInfo = $("#gameInfo");
	var uiStat = $("#gameStat");
    var oneStart = $("#onePlayer");
    var twoStart = $("#twoPlayer");
    

	// Class that defines new tanks to draw
	var Tank = function(x, y, v, type, rank, direction,bulletDire,bulletType,bulletTime) {
		this.x = x;
		this.y = y;
        this.v = v;
		this.type = type;
		this.rank = rank;
        this.direction=direction;
		this.bulletDire = bulletDire;// bullet direcition
		this.bulletType = bulletType;// bullet type  
        this.bulletTime = bulletTime;// bullte time lag
	};
	
	// Class that defines grids to draw
    var Grid = function(x,y,width,height,type){
		this.x = x;
		this.y = y;
        this.width = width;
        this.height = height;
		this.type = type;
    }
    // Update the map
    function updateMap(){
        for(var i=0;i<mapWidth;i++){
            for(var j=0;j<mapHeight;j++){
                switch(map[j][i]){
                    case 1:
                        context.fillStyle = "#ac6c53";
                        context.fillRect(i*gridWidth,j*gridHeight,gridWidth,gridHeight);
                        grids.push(new Grid(i*gridWidth,j*gridHeight,gridWidth,gridHeight,1);
                        break;
                    case 2:
                        context.fillStyle = "rgb(100,100,100)";
                        context.fillRect(0,0,120,120);
                        break;
                    case 3:
                        context.fillStyle = "rgb(100,100,100)";
                        context.fillRect(0,0,120,120);
                        break;
                    default:
                }
            }
        }
    };
	
	// Reset and start the game
	function startGame() {
        
        playGame = true;
        // players 
        playerOne = new Tank(canvasWidth/2,canvasHeight/2,10,"player",1,"S","U",1,300);
        tanks.push(playerOne);
        if(playerNum==2){
            playerTwo = new Tank(canvasWidth/2,canvasHeight/2,10,"player",1,"S","U",1,300);
            tanks.push(playerTwo);
        }
        //enemies

        //listen keyborad events
        $(window).keydown(function(e){
            var keyCode = e.keyCode;
            switch(keyCode){
                case arrowLeft:
                    if(playerOne.direction == "S"){
                        playerOne.direction = "L";
                        playerOne.bulletDire = "L";
                    }
                    break;
                case arrowRight:
                    if(playerOne.direction == "S"){
                        playerOne.direction = "R";
                        playerOne.bulletDire = "R";
                    }
                    break;
                case arrowUp:
                    if(playerOne.direction == "S"){
                        playerOne.direction = "U";
                        playerOne.bulletDire = "U";
                    }
                    break;
                case arrowDown:
                    if(playerOne.direction == "S"){
                        playerOne.direction = "D";
                        playerOne.bulletDire = "D";
                    }
                    break;
                case space:
                    break;
            }
        });

        $(window).keyup(function(e){
            var keyCode = e.keyCode;
            switch(keyCode){
                case arrowLeft:
                    if(playerOne.direction == "L"){
                        playerOne.direction = "S";
                    }
                    break;
                case arrowRight:
                    if(playerOne.direction == "R"){
                        playerOne.direction = "S";
                    }
                    break;
                case arrowUp:
                    if(playerOne.direction == "U"){
                        playerOne.direction = "S";
                    }
                    break;
                case arrowDown:
                    if(playerOne.direction == "D"){
                        playerOne.direction = "S";
                    }
                    break;
                case space:
                    break;
            }
        });
		// Start the animation loop
		animate();
	};
	
	// Inititialise the game environment
	function init() {
        oneStart.on("click",function(e){
            e.preventDefault;
            uiStart.hide();
            playerNum = 1;
            startGame();
        });
	};
	
	// Animation loop that does all the fun stuff
	function animate() {		
		// Clear
		context.clearRect(0, 0, canvasWidth, canvasHeight);
	    updateMap();	

        // update Tanks

        var tanksLen = tanks.length;
        for(var i=0;i<tanksLen;i++){
            var tanksA=tanks[i];
                   // draw the tank 
            switch(tanksA.direction){
                case "U":
                    tanksA.y-=tanksA.v;
                    break;
                case "D":
                    tanksA.y+=tanksA.v;
                    break;
                case "L":
                    tanksA.x-=tanksA.v;
                    break;
                case "R":
                    tanksA.x+=tanksA.v;
                    break;
                default:
            }
            context.fillStyle = "#ac8093";
            context.fillRect(tanksA.x,tanksA.y,4*gridWidth,4*gridHeight);

            // bullet cylinder to draw
            context.fillStyle = "#4d2323";
            switch(tanksA.bulletDire){
                case "U":
                    context.fillRect(tanksA.x+1.5*gridWidth,tanksA.y-gridHeight,1*gridWidth,3*gridHeight);
                    break;
                case "D":
                    context.fillRect(tanksA.x+1.5*gridWidth,tanksA.y+2*gridHeight,1*gridWidth,3*gridHeight);
                    break;
                case "L":
                    context.fillRect(tanksA.x-1*gridWidth,tanksA.y+1.5*gridHeight,3*gridWidth,1*gridHeight);
                    break;
                case "R":
                    context.fillRect(tanksA.x+2*gridWidth,tanksA.y+1.5*gridHeight,3*gridWidth,1*gridHeight);
                    break;
            }
                    
        }

           //  collision detection
        tankGrid();
		if (playGame) {
			// Run the animation loop again in 33 milliseconds
			setTimeout(animate, 33);
		};
	};
	
	init();

       // functions that deal with the collision
    function tankGrid() {
        var tanksLen = tanks.length;
        var gridsLen = grids.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            for(var j=0;j<gridsLen;j++){
            }
        }
    }




























});
