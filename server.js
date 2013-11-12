var express = require("express");
var app = express();
var http = require("http"),
    server = http.createServer(app),
    io = require("socket.io").listen(server);
io.set('log level',1);
server.listen(3000);

app.use(express.static(__dirname + '/public'));
app.get("/",function(req,res){
    res.sendfile(__dirname + '/html/index.html');
});

io.sockets.on("connection",function(socket){
    // main loop
    function running(){

        tanksData();
        bullet();
        enemyAI();
 

        if(isWin >= 0){
            console.log(isWin);
            socket.emit("gameOver",isWin);
        }
        // collision detection
        tankGrid();
        tankTank();
        bulletGrid();
        bulletBullet();
        tankBullet();
          // udate the data
        io.sockets.emit("update",[tanks,grids]);

       if (playGame) {
            // Run the running loop again in 33 milliseconds
            setTimeout(running,33);
        }
    }

    socket.on("setPseudo",function(data){
        socket.set("pseudo",data,function(){
            if(!playerOne.pseudo) {
                playerOne.pseudo = data;
                socket.emit("ready",playerOne.tank);
            }
            else if(!playerTwo.pseudo) {
                playerTwo.pseudo = data;
                socket.emit("ready",playerTwo.tank);
            } 

        });
    });

    socket.on("start",function(data){

       socket.get("pseudo",function(err,name){
            if(playerOne.pseudo == name) {
                playerOne.ready = true;
            } else if (playerTwo.pseudo == name){
                playerTwo.ready = true;
            }

            if(playerOne.ready && playerTwo.ready){
                playGame = true;
                running();

            }
        });
    });

    socket.on("moving",function(data){
        socket.get("pseudo",function(err,name){
            if(playerOne.pseudo == name) {
                playerOne.tank.direction = data;
                if(data !== "S")
            playerOne.tank.bulletDire = data;

            } else if (playerTwo.pseudo == name){
                playerTwo.tank.direction = data;
                if(data !== "S")
            playerTwo.tank.bulletDire = data;
            }
        });
    })

    socket.on("fire",function(data){
        socket.get("pseudo",function(err,name){
            if(playerOne.pseudo == name) {
                fire(playerOne.tank);
            } else if (playerTwo.pseudo == name){
                fire(playerTwo.tank);
            }
        });
    })


    socket.on("disconnect",function(){

    });

});





// Canvas dimensions
var stepSize = 24;
var mapWidth = 22;
var mapHeight = 22;
var canvasWidth = mapWidth*stepSize;
var canvasHeight = mapHeight*stepSize; 

// Game settings
var playGame = false;
var isWin = -1;
var playerOne = {};
var playerTwo = {};
var playerNum = 2;
var grids = new Array();
var tanks = new Array();

var map = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
    [2,2,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
    [0,0,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0]];
// enemy settings
var enemySum = 5;
var minEnemy = 3;

// "S" is "still","L","R","U","D" stand for left,right,up,down
var directions = ["S","L","R","U","D"]; 

// Class that defines grids to draw
var Grid = function(x,y,type){
    this.x = x;
    this.y = y;
    this.type = type;
}

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


function serverInit(){
    playerOne.ready = false;
    playerTwo.ready = false;
    playerOne.pseudo = "";
    playerTwo.pseudo = "";
    playerOne.tank = new Tank(7*stepSize,20*stepSize,0.5*stepSize,"player",1,"S","U",1,1);
    playerTwo.tank = new Tank(13*stepSize,20*stepSize,0.5*stepSize,"player",1,"S","U",1,1);


    loadMap();

}

serverInit();

// load the map 
function loadMap(){
    for(var i=0;i<mapHeight;i++){
        for(var j=0;j<mapWidth;j++){
            switch(map[i][j]){
                case 1:
                    grids.push(new Grid(j*stepSize,i*stepSize,1));
                    break;
                case 2:
                    grids.push(new Grid(j*stepSize,i*stepSize,2));
                    break;
                case 3:
                    grids.push(new Grid(j*stepSize,i*stepSize,3));
                    break;
                default:
            }
        }
    }

    tanks.push(playerOne.tank);
    tanks.push(playerTwo.tank);

    //enemies   initialization
    for(var i=0;i<3;i++){
        tanks.push(new Tank(4*i*stepSize,0,0.2*stepSize,"enemy",1,"D","D",1,1));
    }
};

function tanksData(){
    var tanksLen = tanks.length;
    for(var i=0;i<tanksLen;i++){
        var tanksA=tanks[i];
        // compute the tank  position
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

    }

}
function fire(player){

    if(player.bR !== 0)  return;

    if(player.bulletDire == "L"){
        player.bX = player.x;
        player.bY = player.y + stepSize;
        player.bR = 0.25*stepSize;
        player.bvX = -1.5*player.v;
        player.bvY = 0;
    }else if(player.bulletDire == "R"){
        player.bX = player.x + 2*stepSize;
        player.bY = player.y + stepSize;
        player.bR = 0.25*stepSize;
        player.bvX = 1.5*player.v;
        player.bvY = 0;
    }else if(player.bulletDire == "U"){
        player.bX = player.x + stepSize;
        player.bY = player.y;
        player.bR = 0.25*stepSize;
        player.bvX = 0;
        player.bvY = -1.5*player.v;
    }else if(player.bulletDire == "D"){
        player.bX = player.x + stepSize;
        player.bY = player.y + 2*stepSize;
        player.bR = 0.25*stepSize;
        player.bvX = 0;
        player.bvY = 1.5*player.v;
    }
}
function bullet(){
    var tanksLen = tanks.length;
    for(var i=0;i<tanksLen;i++){
        var tankA = tanks[i];
        tankA.bX +=tankA.bvX;
        tankA.bY +=tankA.bvY;

    }
}



//   define the action of the enemies
function enemyAI(){


    for(var i=0;i<tanks.length;i++){
        var tankA = tanks[i];
        if(tankA.type == "player")   continue;

        // if tank is enemies,it will switch its direction
        if(tankA.type == "enemy" && tankA.direction == "S"){
            tankA.direction = directions[Math.floor(Math.random()*4+1)];
            tankA.bulletDire = tankA.direction;
        }
        // fire
        if(tankA.bR != 0)  continue;
        tankA.bR = 0.25*stepSize; 

        if(tankA.bulletDire == "L"){
            tankA.bX = tankA.x;
            tankA.bY = tankA.y + stepSize;
            tankA.bR = 0.25*stepSize;
            tankA.bvX = -1.5*tankA.v;
            tankA.bvY = 0;
        }else if(tankA.bulletDire == "R"){
            tankA.bX = tankA.x + 2*stepSize;
            tankA.bY = tankA.y + stepSize;
            tankA.bR = 0.25*stepSize;
            tankA.bvX = 1.5*tankA.v;
            tankA.bvY = 0;
        }else if(tankA.bulletDire == "U"){
            tankA.bX = tankA.x + stepSize;
            tankA.bY = tankA.y;
            tankA.bR = 0.25*stepSize;
            tankA.bvX = 0;
            tankA.bvY = -1.5*tankA.v;
        }else if(tankA.bulletDire == "D"){
            tankA.bX = tankA.x + stepSize;
            tankA.bY = tankA.y + 2*stepSize;
            tankA.bR = 0.25*stepSize;
            tankA.bvX = 0;
            tankA.bvY = 1.5*tankA.v;
        }
    }

    //  if enemies all die,game over
    if(tanks.length == playerNum){ 
        playGame = false;
        isWin = 1;
    }
    // adjust the amount of enemies present 
    if(tanks.length<minEnemy && enemySum-3>0){
        var presentPlace = Math.floor(Math.random()*6);
        for(var i=0;i<tanks.length;i++){
            var tankA = tanks[i];
            if(tankA.y>4*stepSize || Math.abs(tankA.x-8*presentPlace*stepSize)<4*stepSize){
                tanks.push(new Tank(4*presentPlace*stepSize,0,0.2*stepSize,"enemy",1,"D","D",1,1));
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
            if(tankA.x>gridA.x && tankA.x-gridA.x < 1*stepSize+tankA.v && Math.abs(tankA.y-gridA.y+0.5*stepSize)<1.5*stepSize && tankA.direction == "L"){
                tankA.x = gridA.x + stepSize;
                tankA.direction = "S";
            }else if(tankA.x<gridA.x && gridA.x-tankA.x < 2*stepSize+tankA.v && Math.abs(tankA.y-gridA.y+0.5*stepSize)<1.5*stepSize && tankA.direction == "R"){
                tankA.x = gridA.x - 2*stepSize;
                tankA.direction = "S";
            }else if(tankA.y>gridA.y && tankA.y-gridA.y < stepSize+tankA.v && Math.abs(tankA.x-gridA.x+0.5*stepSize)<1.5*stepSize && tankA.direction == "U"){
                tankA.y = gridA.y + stepSize;
                tankA.direction = "S";
            }else if(tankA.y<gridA.y && gridA.y-tankA.y < 2*stepSize+tankA.v && Math.abs(tankA.x-gridA.x+0.5*stepSize)<1.5*stepSize && tankA.direction == "D"){
                tankA.y = gridA.y - 2*stepSize;
                tankA.direction = "S";
            };
        }
        // boundary detection of bullets
        if(tankA.x < tankA.v && tankA.direction == "L"){
            tankA.x = 0;
            tankA.direction = "S";
        }else if(tankA.x > canvasWidth-2*stepSize-tankA.v && tankA.direction == "R"){
            tankA.x = canvasWidth-2*stepSize; 
            tankA.direction = "S";
        }else if(tankA.y < tankA.v && tankA.direction == "U"){
            tankA.y = 0;
            tankA.direction = "S";
        }else if(tankA.y > canvasHeight-2*stepSize-tankA.v && tankA.direction == "D"){
            tankA.y = canvasHeight-2*stepSize;
            tankA.direction = "S";
        };

    }
}

function tankTank(){
    var tanksLen = tanks.length;
    for(var i=0;i<tanksLen;i++){
        var tankA = tanks[i];
        for(var j=0;j<tanksLen;j++){
            var tankB = tanks[j];
            if(tankA.x>tankB.x && tankA.x-tankB.x < 2*stepSize+tankA.v && Math.abs(tankA.y-tankB.y)<2*stepSize && tankA.direction == "L"){
                tankA.x = tankB.x + 2*stepSize;
                tankA.direction = "S";
            }else if(tankA.x<tankB.x && tankB.x-tankA.x < 2*stepSize+tankA.v && Math.abs(tankA.y-tankB.y)<2*stepSize && tankA.direction == "R"){
                tankA.x = tankB.x - 2*stepSize;
                tankA.direction = "S";
            }else if(tankA.y>tankB.y && tankA.y-tankB.y < 2*stepSize+tankA.v && Math.abs(tankA.x-tankB.x)<2*stepSize && tankA.direction == "U"){
                tankA.y = tankB.y + 2*stepSize;
                tankA.direction = "S";
            }else if(tankA.y<tankB.y && tankB.y-tankA.y < 2*stepSize+tankA.v && Math.abs(tankA.x-tankB.x)<2*stepSize && tankA.direction == "D"){
                tankA.y = tankB.y - 2*stepSize;
                tankA.direction = "S";
            };
        }
    }
}


function bulletGrid(){
    var tanksLen = tanks.length;
    for(var i=0;i<tanksLen;i++){
        var tankA = tanks[i];
        if(tankA.bR == 0)  continue;

        for(var j=grids.length-1;j>-1;j--){
            var gridA = grids[j];
            if( Math.abs(tankA.bX-gridA.x-0.5*stepSize)<0.75*stepSize && Math.abs(tankA.bY-gridA.y-0.5*stepSize)<1*stepSize){  
                if(tankA.bulletDire == "L"|| tankA.bulletDire == "R"){
                    tankA.bR = 0;
                    if(gridA.type == 1){
                        grids.splice(j,1);

                    }
                }
            }
            if( Math.abs(tankA.bY-gridA.y-0.5*stepSize)<0.75*stepSize && Math.abs(tankA.bX-gridA.x-0.5*stepSize)<1*stepSize){  
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
        if(tankA.bX > stepSize*(mapWidth/2-1) && tankA.bX < stepSize*(mapWidth/2+1) && tankA.bY > stepSize*(mapHeight-2) && tankA.bY < stepSize*mapHeight){
            tankA.bR = 0;
            isWin = 0;
            playGame = false;
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
            if(distance < 0.5*stepSize){
                tankA.bR = 0;
                tankB.bR = 0;
            }
        }
    }
}

function tankBullet(){

    // bullet will vanish if bomb with a tank
    for(var i=0;i<tanks.length-1;i++){
        var tankA = tanks[i];   
        for(var j=0;j<tanks.length-1;j++){
            var tankB = tanks[j];
            var dX = tankA.bX - (tankB.x+1*stepSize);
            var dY = tankA.bY - (tankB.y+1*stepSize);
            var distance = Math.sqrt((dX*dX)+(dY*dY));
            if(distance < stepSize+tankA.bR){
                tankA.bR = 0;
            }
        }
    }

    // player's  bullet bomb with enemies 
    for(var i=0;i<playerNum;i++){
        var tankA = tanks[i];   
        for(var j=tanks.length-1;j>playerNum-1;j--){
            var tankB = tanks[j];
            var dX = tankA.bX - (tankB.x+1*stepSize);
            var dY = tankA.bY - (tankB.y+1*stepSize);
            var distance = Math.sqrt((dX*dX)+(dY*dY));
            if(distance < stepSize+tankA.bR){
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
            var dX = tankA.bX - (tankB.x+1*stepSize);
            var dY = tankA.bY - (tankB.y+1*stepSize);
            var distance = Math.sqrt((dX*dX)+(dY*dY));
            if(distance < stepSize+tankA.bR){
                tankA.bR = 0;

                //  if players are attacked, their position will be initialized 
                tankB.direction = "S";
                tankB.bulletDire = "U";
                if(tankB == tanks[0]){
                    tankB.x = 7*stepSize;
                    tankB.y = 20*stepSize; 

                } else{
                    tankB.x = 13*stepSize;
                    tankB.y = 20*stepSize; 

                }


            }
        }
    }
}
