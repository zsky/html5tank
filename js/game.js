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
    var stepSize = 12;
    var mapWidth = 32;
    var mapHeight = 32;
    var playerNum;
    var playerOne;
    var playerTwo;
    var map=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1],
             [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1],
             [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1],
             [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1],
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
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1]];

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
        this.bX = 0;  // the position x of the bullet 
        this.bY = 0;  // the position y of the bullet
        this.bR = 0;  // the radius of the bullet
        this.bvX = 0;  // the velocity x of the bullet
        this.bvY = 0;  // the velocity y of the bullet
	};
	
	// Class that defines grids to draw
    var Grid = function(x,y,width,height,type){
		this.x = x;
		this.y = y;
        this.width = width;
        this.height = height;
		this.type = type;
    }
    
    // load the map
    function loadMap(){
        for(var i=0;i<mapWidth;i++){
            for(var j=0;j<mapHeight;j++){
                switch(map[j][i]){
                    case 1:
                        context.fillStyle = "#ac6c53";
                        context.fillRect(i*stepSize,j*stepSize,stepSize,stepSize);
                        grids.push(new Grid(i*stepSize,j*stepSize,stepSize,stepSize,1));
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
	
    // update the map
    function updateMap(){
        var gridsLen = grids.length;
        for(var i=0;i<gridsLen;i++){
            gridA = grids[i];
            context.fillStyle = "#ac6c53";
            context.fillRect(gridA.x,gridA.y,stepSize,stepSize);
        }
    }

    function updateBullets(){
        var tanksLen = tanks.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            tankA.bX +=tankA.bvX;
            tankA.bY +=tankA.bvY;

            context.fillStyle = "rgb(200, 200, 200)";
            context.beginPath();
            context.arc(tankA.bX,tankA.bY,tankA.bR, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
        }
    }

	// Reset and start the game
	function startGame() {
        
        playGame = true;
        loadMap();
        // players 
        playerOne = new Tank(10*stepSize,28*stepSize,stepSize,"player",1,"S","U",1,300);
        tanks.push(playerOne);
        if(playerNum==2){
            playerTwo = new Tank(canvasWidth/2,canvasHeight/2,stepSize,"player",1,"S","U",1,300);
            tanks.push(playerTwo);
        }
        //enemies
        for(var i=0;i<4;i++){
            tanks.push(new Tank(8*i*stepSize,0,stepSize,"enemy",1,"S","D",1,300));
        }


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
                    if(playerOne.bR != 0){
                        break;
                    }
                    if(playerOne.bulletDire == "L"){
                        playerOne.bX = playerOne.x;
                        playerOne.bY = playerOne.y + 2*stepSize;
                        playerOne.bR = 0.5*stepSize;
                        playerOne.bvX = -10;
                        playerOne.bvY = 0;
                     }else if(playerOne.bulletDire == "R"){
                        playerOne.bX = playerOne.x + 4*stepSize;
                        playerOne.bY = playerOne.y + 2*stepSize;
                        playerOne.bR = 0.5*stepSize;
                        playerOne.bvX = 10;
                        playerOne.bvY = 0;
                     }else if(playerOne.bulletDire == "U"){
                        playerOne.bX = playerOne.x + 2*stepSize;
                        playerOne.bY = playerOne.y;
                        playerOne.bR = 0.5*stepSize;
                        playerOne.bvX = 0;
                        playerOne.bvY = -10;
                     }else if(playerOne.bulletDire == "D"){
                        playerOne.bX = playerOne.x + 2*stepSize;
                        playerOne.bY = playerOne.y + 4*stepSize;
                        playerOne.bR = 0.5*stepSize;
                        playerOne.bvX = 0;
                        playerOne.bvY = 10;
                     }
                    break;
                default:
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
     //   oneStart.on("click",function(e){
      //      e.preventDefault;
            uiStart.hide();
            playerNum = 1;
            startGame();
     //   });
	};
	
	// Animation loop that does all the fun stuff
	function animate() {		
		// Clear
		context.clearRect(0, 0, canvasWidth, canvasHeight);
	    updateMap();	

        //  collision detection
        tankGrid();
        bulletGrid();
        tankTank();
    //    bulletBullet();
     //   tankBullet();

        // update bullets
        updateBullets();
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
            context.fillRect(tanksA.x,tanksA.y,4*stepSize,4*stepSize);

            // bullet cylinder to draw
            context.fillStyle = "#4d2323";
            switch(tanksA.bulletDire){
                case "U":
                    context.fillRect(tanksA.x+1.5*stepSize,tanksA.y-stepSize,1*stepSize,3*stepSize);
                    break;
                case "D":
                    context.fillRect(tanksA.x+1.5*stepSize,tanksA.y+2*stepSize,1*stepSize,3*stepSize);
                    break;
                case "L":
                    context.fillRect(tanksA.x-1*stepSize,tanksA.y+1.5*stepSize,3*stepSize,1*stepSize);
                    break;
                case "R":
                    context.fillRect(tanksA.x+2*stepSize,tanksA.y+1.5*stepSize,3*stepSize,1*stepSize);
                    break;
            }
                    
        }

		if (playGame) {
			// Run the animation loop again in 33 milliseconds
			setTimeout(animate, 33);
		};
	};
	

       // functions that deal with the collision
    function tankGrid() {
        var tanksLen = tanks.length;
        var gridsLen = grids.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            for(var j=0;j<gridsLen;j++){
                var gridA = grids[j];
                if(tankA.x>gridA.x && tankA.x-gridA.x < stepSize+tankA.v && Math.abs(tankA.y-gridA.y+1.5*stepSize)<2.5*stepSize && tankA.direction == "L"){
                    tankA.x = gridA.x + stepSize;
                    tankA.direction = "S";
                }else if(tankA.x<gridA.x && gridA.x-tankA.x < 4*stepSize+tankA.v && Math.abs(tankA.y-gridA.y+1.5*stepSize)<2.5*stepSize && tankA.direction == "R"){
                    tankA.x = gridA.x - 4*stepSize;
                    tankA.direction = "S";
                }else if(tankA.y>gridA.y && tankA.y-gridA.y < stepSize+tankA.v && Math.abs(tankA.x-gridA.x+1.5*stepSize)<2.5*stepSize && tankA.direction == "U"){
                    tankA.y = gridA.y + stepSize;
                    tankA.direction = "S";
                }else if(tankA.y<gridA.y && gridA.y-tankA.y < 4*stepSize+tankA.v && Math.abs(tankA.x-gridA.x+1.5*stepSize)<2.5*stepSize && tankA.direction == "D"){
                    tankA.y = gridA.y - 4*stepSize;
                    tankA.direction = "S";
                };
            }
            // boundary detection of bullets
                if(tankA.x < tankA.v && tankA.direction == "L"){
                    tankA.x = 0;
                    tankA.direction = "S";
                }else if(tankA.x > canvasWidth-4*stepSize-tankA.v && tankA.direction == "R"){
                    tankA.x = canvasWidth-4*stepSize; 
                    tankA.direction = "S";
                }else if(tankA.y < tankA.v && tankA.direction == "U"){
                    tankA.y = 0;
                    tankA.direction = "S";
                }else if(tankA.y > canvasHeight-4*stepSize-tankA.v && tankA.direction == "D"){
                    tankA.y = canvasHeight-4*stepSize;
                    tankA.direction = "S";
                };
            

        }
    }


    function bulletGrid(){
        var tanksLen = tanks.length;
        var gridsLen = grids.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            if(tankA.bR == 0)  return;

            for(var j=gridsLen-1;j>-1;j--){
                var gridA = grids[j];
                if( Math.abs(tankA.bX-gridA.x-0.5*stepSize)<stepSize && Math.abs(tankA.bY-gridA.y-0.5*stepSize)<1.5*stepSize){  
                    if(tankA.bulletDire == "L"|| tankA.bulletDire == "R"){
                        grids.splice(j,1);
                        tankA.bR = 0;
                    }
              }
                if( Math.abs(tankA.bY-gridA.y-0.5*stepSize)<stepSize && Math.abs(tankA.bX-gridA.x-0.5*stepSize)<1.5*stepSize){  
                    if(tankA.bulletDire == "U"|| tankA.bulletDire == "D"){
                        grids.splice(j,1);
                        tankA.bR = 0;
                    }
              }
            }
            // boundary detection of bullets
            if(tankA.bX < 0 || tankA.bX > canvasWidth || tankA.bY <0 || tankA.bY > canvasHeight){
                tankA.bR = 0;
            }
        }

    }


    function tankTank(){
        var tanksLen = tanks.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            for(var j=i+1;j<tanksLen;j++){
                var tankB = tanks[j];
            }
        }
    }





















	init();




});
