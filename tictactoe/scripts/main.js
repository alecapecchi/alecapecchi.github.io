import Board from "./board.js";
import Player from "./player.js";
import AI from "./AI.js";

const board = new Board(["", "", "",
                              "", "", "",
                              "", "", ""]);
var ai
var mode="vsPlayer"
var player1
var player2
player1=new Player("Player 1", "x", "o", 0)
player2=new Player("Player 2", "o", "x", 0)
var currentPlayer=player1



$(document).ready(function(){
    //restart button
    $("#restart").click(function(){
        $("#c0,#c1,#c2,#c3,#c4,#c5,#c6,#c7,#c8").removeClass("x o");
        board.restartGame()
        currentPlayer=player1 });
    $("#nameSetter").click(function(){//se è stato inserito un coupon
        player1.setName($("#name1").val());
        player2.setName($("#name2").val());
        document.getElementById("score").innerHTML = player1.name+": "+parseInt(player1.score)+" ~ "+player2.name+": "+parseInt(player2.score);
        $("#setNameModal").modal('toggle');
    });

    //a cell is clicked, perform move
    $("#c0").click(function(){ mossa(this,0) });
    $("#c1").click(function(){ mossa(this,1) });
    $("#c2").click(function(){ mossa(this,2) });
    $("#c3").click(function(){ mossa(this,3) });
    $("#c4").click(function(){ mossa(this,4) });
    $("#c5").click(function(){ mossa(this,5) });
    $("#c6").click(function(){ mossa(this,6) });
    $("#c7").click(function(){ mossa(this,7) });
    $("#c8").click(function(){ mossa(this,8) });

    //a level is clicked, change the level to the clicked one
    $("#easy").click(function(){changeMode("easy", this)});
    $("#medium").click(function(){changeMode("medium", this)});
    $("#impossible").click(function(){changeMode("impossible", this)});
    $("#vsPlayer").click(function(){changeMode("vsPlayer", this)});

});


async function mossa(id,casella){
    //if the cell is alredy taken: ERROR
    if ($(id).hasClass("o") || $(id).hasClass("x")){
        swal("ILLEGAL MOVE!","The selected square has already been taken!","error")
        return;
    }
    //if the AI hasn't played yet (basic locking, not really needed has the AI is really fast)
    if (mode!=="vsPlayer" && currentPlayer.name!==player1.name){
        swal("Oops, something went wrong :(","It's not your turn!","error")
        return;
    }
    //edit the array in memory
    board.mossa(currentPlayer.simbolo,casella);
    //edit the UI
    $(id).addClass(currentPlayer.simbolo+" animate__animated animate__jackInTheBox");
    //check if gameOver
    let status=board.finePartita()
    if (status!=="in corso"){
        await endMatch(status);
        return;
    }
    if(currentPlayer===player1){currentPlayer=player2}
    else {currentPlayer=player1}
    if (mode!=="vsPlayer"){playAIgame(player2)}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//change game mode
function changeMode(newmode, newmodeID){
    //make all modes "unselected"
    $("#easy, #medium,#impossible,#vsPlayer").removeClass("selectedMode").addClass("unselectedMode")
    //make new one selected
    $(newmodeID).addClass("selectedMode")
    //clean the board
    $("#c0,#c1,#c2,#c3,#c4,#c5,#c6,#c7,#c8").removeClass("x o");
    //restart game
    board.restartGame()
    mode=newmode
    //game against AI
    if (mode!=="vsPlayer"){
        player1=new Player("Human", "x", "o", 0)
        player2=new Player("Computer","o","x",0);
        if (mode==="easy"){ai= new AI(0);}
        else if (mode==="medium"){ai= new AI(1);}
        else if (mode==="impossible"){ai= new AI(100);}
    }
    else{
        player1=new Player("Player 1", "x", "o", 0)
        player2=new Player("Player 2", "o", "x", 0)
    }
    currentPlayer=player1
    //update score
    document.getElementById("score").innerHTML = player1.name+": "+parseInt(player1.score)+" ~ "+player2.name+": "+parseInt(player2.score);
}

async function playAIgame(computer){
        //find best move
        let cell=ai.play(board,computer)
        //insert move
        board.mossa(computer.simbolo,cell);
        board.possibleMoves=[]
        let id_casella="c"+parseInt(cell)
        await sleep(60);
        document.getElementById(id_casella).classList.add(currentPlayer.simbolo);
        //check game over
        let status=board.finePartita()
        if (status!=="in corso"){
            await endMatch(status);
            return;
        }
        if(currentPlayer===player1){currentPlayer=player2}
        else {currentPlayer=player1}
}

async function endMatch(status){
    //check if player has won
    if(status===currentPlayer.simbolo){
        currentPlayer.score+=1
        //update score
        document.getElementById("score").innerHTML = player1.name+": "+parseInt(player1.score)+" ~ "+player2.name+": "+parseInt(player2.score);
        await sleep(800);
        alert(currentPlayer.name+" wins!")
        }
    //else: it's a tie
    else{
        await sleep(600);
        alert("No Winners :(")
    }
    //clean UI and restart game
    $("#c0,#c1,#c2,#c3,#c4,#c5,#c6,#c7,#c8").removeClass("x o");
    board.restartGame()
    currentPlayer=player1
}

