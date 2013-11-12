$(document).ready(function() {
    var socket = io.connect();

    var canvas = $("#gameCanvas");
    var context = canvas.get(0).getContext("2d");

    // Canvas dimensions
    var stepSize = 24;
    var mapWidth = 22;
    var mapHeight = 22;
    var canvasWidth = mapWidth*stepSize; 
    canvas.attr("width",canvasWidth);
    var canvasHeight = mapHeight*stepSize; 
    canvas.attr("height",canvasHeight);

    var playGame = true;
    var tanks = new Array(); 
    var grids = new Array();
    var player;
    var friend;
    var playerName;


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
    var mapControl = $("#mapControl");

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


    function startGame(){

        //listen keyborad events
        $(window).keydown(function(e){
            var keyCode = e.keyCode;
            switch(keyCode){
                case arrowLeft:
                    if(player.direction == "S"){
                        socket.emit("moving","L");
                    }
                    return false;
                    break;
                case arrowRight:
                    if(player.direction == "S"){
                        socket.emit("moving","R");
                    }
                    return false;
                    break;
                case arrowUp:
                    if(player.direction == "S"){
                        socket.emit("moving","U");
                    }
                    return false;
                    break;
                case arrowDown:
                    if(player.direction == "S"){
                        socket.emit("moving","D");
                    }
                    return false;
                    break;
                case space:

                    if(player.bR === 0){
                        socket.emit("fire","hello");
                    }
                    return false;

                    break;
                default:
            }

        });

        $(window).keyup(function(e){
            var keyCode = e.keyCode;
            switch(keyCode){
                case arrowLeft:
                    if(player.direction == "L"){
                        player.direction = "S";
                    }
                    break;
                case arrowRight:
                    if(player.direction == "R"){
                        player.direction = "S";
                    }
                    break;
                case arrowUp:
                    if(player.direction == "U"){
                        player.direction = "S";
                    }
                    break;
                case arrowDown:
                    if(player.direction == "D"){
                        player.direction = "S";
                    }
                    break;
                default:
            }

            if(player.direction == "S") {
                socket.emit("moving","S");
            }
        });

    }




    function updateTanks(){

        var tanksLen = tanks.length;
        for(var i=0;i<tanksLen;i++){
            var tanksA=tanks[i];

            context.fillStyle = "#ac8093";
            context.fillRect(tanksA.x,tanksA.y,2*stepSize,2*stepSize);

            // bullet cylinder to draw
            context.fillStyle = "#4d2323";
            switch(tanksA.bulletDire){
                case "U":
                    context.fillRect(tanksA.x+0.75*stepSize,tanksA.y-0.5*stepSize,0.5*stepSize,1*stepSize);
                    break;
                case "D":
                    context.fillRect(tanksA.x+0.75*stepSize,tanksA.y+1.5*stepSize,0.5*stepSize,1*stepSize);
                    break;
                case "L":
                    context.fillRect(tanksA.x-0.5*stepSize,tanksA.y+0.75*stepSize,1*stepSize,0.5*stepSize);
                    break;
                case "R":
                    context.fillRect(tanksA.x+1.5*stepSize,tanksA.y+0.75*stepSize,1*stepSize,0.5*stepSize);
                    break;
            }
        }
    }

    function updateBullets(){
        var tanksLen = tanks.length;
        for(var i=0;i<tanksLen;i++){
            var tankA = tanks[i];

            context.fillStyle = "rgb(200, 200, 200)";
            context.beginPath();
            context.arc(tankA.bX,tankA.bY,tankA.bR, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
        }
    }

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
        context.arc(stepSize*mapWidth/2,stepSize*(mapHeight-2),1*stepSize, 0, Math.PI, false);
        context.closePath();
        context.fill();
        context.fillRect(stepSize*mapWidth/2-0.25*stepSize,stepSize*(mapHeight-1),0.5*stepSize,stepSize*1);
    }

    function animate(){

        // Clear
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        // update
        updateMap();
        updateTanks();
        updateBullets();
        updateTarget();

    }

    function gameOver(isWin){
        if(isWin === 1){
            alert("you win");
        } else {
            alert("you lose");
        }
    }

    function init(){
        uiStart.hide();
        playerNum = 1;
        player = new Tank((-3)*stepSize,(-3)*stepSize,0.5*stepSize,"player",1,"S","U",1,1);
        friend = new Tank((-3)*stepSize,(-3)*stepSize,0.5*stepSize,"player",1,"S","U",1,1);

        $("#setPseudo").click(function(){
            playerName = $("#pseudo").val();
            if ( playerName!= "")
            {
                socket.emit('setPseudo', playerName);
            }
        })
        $("#onlineStart").click(function(){
            socket.emit('start', player);
            startGame();
            $(this).prop("disabled",true);
        })

    };

    init();
    //  socket events
    socket.on("ready",function(data){
        player = data;
    });

    socket.on("update",function(data){
        tanks = data[0];
        grids = data[1];
        animate();

    });

    socket.on("gameOver",function(isWin){
        console.log(isWin);
        gameOver(isWin);

    });



})
