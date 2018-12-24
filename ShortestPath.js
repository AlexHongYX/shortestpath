var can;
var c;

var cells;

var frameCounter;
var iterations;

var goalFound;

var width;

window.onload = function(){
    can = document.getElementById("c");
    can.width = 360;
    can.height = 360;
    c = can.getContext("2d");
    c.fillRect(0,0,can.width,can.height);

    reset();

    animate();
}

function reset(){
    width = document.getElementById("width").value;
    cells = [];
    var row;
    for(var i=0;i<width;i++){
        row = [];
        for(var j=0;j<width;j++){
            row.push(new Cell(j, i, parseInt(Math.random()*1.25)));
        }
        cells.push(row);
    }
    cells[1][1].state = 3;
    cells[cells.length-2][cells[cells.length-2].length-2].state = 4;

    goalFound = false;
    iterations = 0;

    frameCounter = 0;
}

function animate(){
    if(frameCounter % 3 == 0){
        if(goalFound == false){
            c.fillRect(0,0,can.width,can.height);
            for(var i=0;i<cells.length;i++){
                for(var j=0;j<cells[i].length;j++){
                    cells[i][j].show();
                    if(cells[i][j].state == 3){
                        if(i != 0){
                            cells[i-1][j].getInfected(j, i);
                        }
                        if(j != 0){
                            cells[i][j-1].getInfected(j, i);
                        }
                        if(i != cells.length-1){
                            cells[i+1][j].getInfected(j, i);
                        }
                        if(j != cells[i].length-1){
                            cells[i][j+1].getInfected(j, i);
                        }
                    }
                }
            }

            for(var i=0;i<cells.length;i++){
                for(var j=0;j<cells[i].length;j++){
                    cells[i][j].increaseState();
                }
            }
            iterations++;
        }else{
            c.fillRect(0,0,can.width,can.height);
            for(var i=0;i<cells.length;i++){
                for(var j=0;j<cells[i].length;j++){
                    cells[i][j].show();
                }
            }
            c.fillStyle = "FF0000";
            var w = can.width/width;
            var refX = goalFound.x;
            var refY = goalFound.y;
            for(var i=0;i<iterations;i++){
                //console.log(refX, refY);
                var refX_ = cells[refY][refX].refX;
                var refY_ = cells[refY][refX].refY;
                refX = refX_;
                refY = refY_;
                c.fillRect(refX*w,refY*w,w+1,w+1);
            }
        }
    }
    frameCounter++;
    requestAnimationFrame(animate);
}



function Cell(x, y, state){
    this.x = x;
    this.y = y;
    this.refX;
    this.refY;
    this.state = state;

    this.show = function(){
        var w = can.width/width;
        if(this.state == 0){
            c.fillStyle = "#000000";
        }else if(this.state == 1){
            c.fillStyle = "#FFFFFF";
        }else if(this.state == 2){
            c.fillStyle = "#77CC77";
        }else if(this.state == 3){
            c.fillStyle = "#33AA33";
        }else{
            c.fillStyle = "#FF0000";
        }
        c.fillRect(this.x*w,this.y*w,w+1,w+1);
    }

    this.getInfected = function(x, y){
        if(this.state == 0){
            this.state = 2;
            this.refX = x;
            this.refY = y;
        }else if(this.state == 4){
            this.refX = x;
            this.refY = y;
            goalFound = {
                x: this.x,
                y: this.y
            };
        }
    }
    this.increaseState = function(){
        if(this.state == 2){
            this.state = 3;
        }
    }
}