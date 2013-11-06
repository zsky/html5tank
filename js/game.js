$(document).ready(function() {
	var canvas = $("#gameCanvas");
	var context = canvas.get(0).getContext("2d");
	
	// Canvas dimensions
    var stepSize = 12;
    var mapWidth = 44;
    var mapHeight = 44;
	var canvasWidth = mapWidth*stepSize; 
    canvas.attr("width",canvasWidth);
	var canvasHeight = mapHeight*stepSize; 
    canvas.attr("height",canvasHeight);
	// Game settings
	var playGame;
    var tanks = new Array(); 
    var grids = new Array();
    var playerNum;
    var playerOne;
    var playerTwo;
    var level = 0;
        // "S" is "still","L","R","U","D" stand for left,right,up,down
    var directions = ["S","L","R","U","D"]; 
    var map = levelMap[level];
    // enemy settings
    var enemySum = 5;
    var minEnemy = 3;

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
	var Tank = function(x, y, v, type, rank, direction,bulletDire,bulletType,blood) {
		this.x = x;
		this.y = y;
        this.v = v;
		this.type = type;
		this.rank = rank;
        this.blood = blood;
        this.direction=direction;
        this.noHurtTime = 60;  // 60 frames about a second
		this.bulletDire = bulletDire;// bullet direcition
		this.bulletType = bulletType;// bullet type  
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
                        context.fillStyle = "#eeeeee";
                        context.fillRect(i*stepSize,j*stepSize,stepSize,stepSize);
                        grids.push(new Grid(i*stepSize,j*stepSize,stepSize,stepSize,2));
                        break;
                    case 3:
                        context.fillStyle = "#ac6c53";
                        context.fillRect(i*stepSize,j*stepSize,stepSize,stepSize);
                        grids.push(new Grid(i*stepSize,j*stepSize,stepSize,stepSize,3));
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
            switch(gridA.type){
                case 1:
                    context.fillStyle = "#ac6c53";
                    break;
                case 2:
                    context.fillStyle = "#eeeeee";
                    break;
                case 3:
                    context.fillStyle = "#ac6c53";
                    break;
                default:
            }

            context.fillRect(gridA.x,gridA.y,stepSize,stepSize);
        }
    }

    // update the target 
    function updateTarget(){
        context.fillStyle = "rgb(200, 200, 200)";
        context.beginPath();
        context.arc(stepSize*mapWidth/2,stepSize*(mapHeight-4),2*stepSize, 0, Math.PI, false);
        context.closePath();
        context.fill();
        context.fillRect(stepSize*mapWidth/2-0.5*stepSize,stepSize*(mapHeight-2),stepSize,stepSize*2);
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

        // update Tanks
    function updateTanks(){

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
            if(tanksA.type == "player")       context.fillStyle = "#1723b3";
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
       }

	// Reset and start the game
	function startGame() {
        
        playGame = true;
        loadMap();
        // players 
        playerOne = new Tank(14*stepSize,40*stepSize,stepSize,"player",1,"S","U",1,0);
        tanks.push(playerOne);
        if(playerNum==2){
            playerTwo = new Tank(20*stepSize,40*stepSize,stepSize,"player",1,"S","U",1,0);
            tanks.push(playerTwo);
        }
        //enemies   initialization
        for(var i=0;i<4;i++){
            tanks.push(new Tank(8*i*stepSize,0,0.5*stepSize,"enemy",1,"D","D",1,1));
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
                        playerOne.bvX = -1.5*stepSize;
                        playerOne.bvY = 0;
                     }else if(playerOne.bulletDire == "R"){
                        playerOne.bX = playerOne.x + 4*stepSize;
                        playerOne.bY = playerOne.y + 2*stepSize;
                        playerOne.bR = 0.5*stepSize;
                        playerOne.bvX = 1.5*stepSize;
                        playerOne.bvY = 0;
                     }else if(playerOne.bulletDire == "U"){
                        playerOne.bX = playerOne.x + 2*stepSize;
                        playerOne.bY = playerOne.y;
                        playerOne.bR = 0.5*stepSize;
                        playerOne.bvX = 0;
                        playerOne.bvY = -1.5*stepSize;
                     }else if(playerOne.bulletDire == "D"){
                        playerOne.bX = playerOne.x + 2*stepSize;
                        playerOne.bY = playerOne.y + 4*stepSize;
                        playerOne.bR = 0.5*stepSize;
                        playerOne.bvX = 0;
                        playerOne.bvY = 1.5*stepSize;
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
	
    // game over
    function gameOver(isWin){
        playGame = false;
        if(isWin)  alert("you win");
        else alert("you lose");
    }
	// Animation loop that does all the fun stuff
	function animate() {		
		// Clear
		context.clearRect(0, 0, canvasWidth, canvasHeight);
	    updateMap();	
        updateTarget();

        //  collision detection
        tankGrid();
        bulletGrid();
        tankTank();
        bulletBullet();
        tankBullet();

        //define the action of enemies
        enemyAI();

        // update bullets
        updateBullets();
        updateTanks();

		if (playGame) {
			// Run the animation loop again in 33 milliseconds
			setTimeout(animate, 33);
		};
	};
	

      //   define the action of the enemies
    function enemyAI(){

        var tanksLen = tanks.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            if(tankA.type == "player")   continue;

        // if tank is enemies,it will switch its direction
            if(tankA.type == "enemy" && tankA.direction == "S"){
                tankA.direction = directions[Math.floor(Math.random()*4+1)];
                tankA.bulletDire = tankA.direction;
            }
           // fire
            if(tankA.bR != 0)  continue;
            tankA.bR = 0.5*stepSize; 
            if(tankA.bulletDire == "L"){
                tankA.bX = tankA.x;
                tankA.bY = tankA.y + 2*stepSize;
                tankA.bR = 0.5*stepSize;
                tankA.bvX = -1.2*tankA.v;
                tankA.bvY = 0;
            }else if(tankA.bulletDire == "R"){
                tankA.bX = tankA.x + 4*stepSize;
                tankA.bY = tankA.y + 2*stepSize;
                tankA.bR = 0.5*stepSize;
                tankA.bvX = 1.2*tankA.v;
                tankA.bvY = 0;
            }else if(tankA.bulletDire == "U"){
                tankA.bX = tankA.x + 2*stepSize;
                tankA.bY = tankA.y;
                tankA.bR = 0.5*stepSize;
                tankA.bvX = 0;
                tankA.bvY = -1.2*tankA.v;
            }else if(tankA.bulletDire == "D"){
                tankA.bX = tankA.x + 2*stepSize;
                tankA.bY = tankA.y + 4*stepSize;
                tankA.bR = 0.5*stepSize;
                tankA.bvX = 0;
                tankA.bvY = 1.2*tankA.v;
            }
        }

        //  if enemies all die,game over
        if(tanksLen == playerNum)  gameOver(true);  // the boolen indicates the victory
        // adjust the amount of enemies present 
        if((tanksLen-playerNum)<minEnemy && enemySum-4>0){
            var presentPlace = Math.floor(Math.random()*6);
            for(var i=0;i<tanksLen;i++){
                var tankA = tanks[i];
                if(tankA.y>4*stepSize || Math.abs(tankA.x-8*presentPlace*stepSize)<4*stepSize){
                    tanks.push(new Tank(8*presentPlace*stepSize,0,0.5*stepSize,"enemy",1,"D","D",1,1));
                    enemySum -=1;
                }
            }
        }

    }
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
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            if(tankA.bR == 0)  continue;

            for(var j=grids.length-1;j>-1;j--){
                var gridA = grids[j];
                if( Math.abs(tankA.bX-gridA.x-0.5*stepSize)<stepSize && Math.abs(tankA.bY-gridA.y-0.5*stepSize)<1.5*stepSize){  
                    if(tankA.bulletDire == "L"|| tankA.bulletDire == "R"){
                        tankA.bR = 0;
                        if(gridA.type == 1){
                            grids.splice(j,1);
                        }
                    }
              }
                if( Math.abs(tankA.bY-gridA.y-0.5*stepSize)<stepSize && Math.abs(tankA.bX-gridA.x-0.5*stepSize)<1.5*stepSize){  
                    if(tankA.bulletDire == "U"|| tankA.bulletDire == "D"){
                        tankA.bR = 0;
                        if(gridA.type == 1){
                            grids.splice(j,1);
                        }
                    }
              }
            }
            // boundary detection of bullets
            if(tankA.bX < 0 || tankA.bX > canvasWidth || tankA.bY <0 || tankA.bY > canvasHeight){
                tankA.bR = 0;
            }
            //  if a bullet hits the target,then game over 
            if(tankA.bX > stepSize*(mapWidth/2-2) && tankA.bX < stepSize*(mapWidth/2+2) && tankA.bY > stepSize*(mapHeight-4) && tankA.bY < stepSize*mapHeight){
                tankA.bR = 0;
                gameOver(false);
            }
        }

    }


    function tankTank(){
        var tanksLen = tanks.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            for(var j=0;j<tanksLen;j++){
                var tankB = tanks[j];
                if(tankA.x>tankB.x && tankA.x-tankB.x < 4*stepSize+tankA.v && Math.abs(tankA.y-tankB.y)<4*stepSize && tankA.direction == "L"){
                    tankA.x = tankB.x + 4*stepSize;
                    tankA.direction = "S";
                }else if(tankA.x<tankB.x && tankB.x-tankA.x < 4*stepSize+tankA.v && Math.abs(tankA.y-tankB.y)<4*stepSize && tankA.direction == "R"){
                    tankA.x = tankB.x - 4*stepSize;
                    tankA.direction = "S";
                }else if(tankA.y>tankB.y && tankA.y-tankB.y < 4*stepSize+tankA.v && Math.abs(tankA.x-tankB.x)<4*stepSize && tankA.direction == "U"){
                    tankA.y = tankB.y + 4*stepSize;
                    tankA.direction = "S";
                }else if(tankA.y<tankB.y && tankB.y-tankA.y < 4*stepSize+tankA.v && Math.abs(tankA.x-tankB.x)<4*stepSize && tankA.direction == "D"){
                    tankA.y = tankB.y - 4*stepSize;
                    tankA.direction = "S";
                };
            }
        }
    }

    function bulletBullet(){
        var tanksLen = tanks.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];
            for(var j=i+1;j<tanksLen;j++){
                var tankB = tanks[j];
                var dX = tankA.bX - tankB.bX;
                var dY = tankA.bY - tankB.bY;
                var distance = Math.sqrt((dX*dX)+(dY*dY));
                if(distance < stepSize){
                    tankA.bR = 0;
                    tankB.bR = 0;
                }
            }
        }
    }

    function tankBullet(){
           // player's  bullet bomb with enemies 
        for(var i=0;i<playerNum;i++){
            var tankA = tanks[i];   
            for(var j=tanks.length-1;j>playerNum-1;j--){
                var tankB = tanks[j];
                var dX = tankA.bX - (tankB.x+2*stepSize);
                var dY = tankA.bY - (tankB.y+2*stepSize);
                var distance = Math.sqrt((dX*dX)+(dY*dY));
                if(distance < 2*stepSize+tankA.bR){
                    tankA.bR = 0;
                    //  tankB will be hurt 
                    tankA.blood -=1;
                    if(tankA.blood <= 0)
                        tanks.splice(j,1);
                }
            }
        }
           // enemy's  bullet bomb with players 
        for(var i=playerNum;i<tanks.length;i++){
            var tankA = tanks[i];   
            for(var j=0;j<playerNum;j++){
                var tankB = tanks[j];
                var dX = tankA.bX - (tankB.x+2*stepSize);
                var dY = tankA.bY - (tankB.y+2*stepSize);
                var distance = Math.sqrt((dX*dX)+(dY*dY));
                if(distance < 2*stepSize+tankA.bR){
                    tankA.bR = 0;
                    //  if players are attacked, their position will be initialized 
                    tankB.x = 14*stepSize;
                    tankB.y = 40*stepSize;
                    tankB.direction = "S";
                    tankB.bulletDire = "U";
                }
            }
        }
    }



















	init();




});
