/*The board logic*/

export default class Board {
    constructor(state = ["", "", "", "", "", "", "", "", ""]) {
        this.state = state;//the current board
        this.possibleMoves=[]
    }


printFormattedBoard() {
    let formattedString = '';
    this.state.forEach((cell, index) => {
        formattedString += cell ? ` ${cell} |` : '   |';
        if((index + 1) % 3 === 0)  {
            formattedString = formattedString.slice(0,-1);
            if(index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
        }
    });
    console.log('%c' + formattedString, 'color: #c11dd4;font-size:16px');
}

isFull() {
    return this.state.every(cell => cell);
}

mossePossibili(){
    for (var i = 0; i < 9; i++) {
        if (this.state[i]===""){
            this.possibleMoves.push(i)
        }
    }
    return this.possibleMoves
}
getAdvantage(simboloAI,simboloHuman){
        var val=0
        var weight=[2,1,2,1,3,1,2,1,2]
        for (var i = 0; i < 9; i++) {
            if (this.state[i]===simboloAI){
                val+=weight[i]
            }
            else if (this.state[i]===simboloHuman){
                val-=weight[i]
            }
}
        return val/10}

//insert the symbol
mossa(simbolo,casella){this.state[casella]=simbolo}

//check if gameover: win for x, win for o, tie, not gameOver
finePartita(){
    //controllo le righe
    if (this.state[0]!=="" && this.state[0]===this.state[1] && this.state[1]===this.state[2]){
        return this.state[0]
    }
    if (this.state[3]!=="" && this.state[3]===this.state[4] && this.state[4]===this.state[5]){
        return this.state[3]
    }
    if (this.state[6]!=="" && this.state[6]===this.state[7] && this.state[7]===this.state[8]){
        return this.state[6]
    }
    //controllo le colonne
    if (this.state[0]!=="" && this.state[0]===this.state[3] && this.state[3]===this.state[6]){
        return this.state[0]
    }
    if (this.state[1]!=="" && this.state[1]===this.state[4] && this.state[4]===this.state[7]){
        return this.state[1]
    }
    if (this.state[2]!=="" && this.state[2]===this.state[5] && this.state[5]===this.state[8]){
        return this.state[2]
    }

    //controllo le diagonali
    if (this.state[0]!=="" && this.state[0]===this.state[4] && this.state[4]===this.state[8]){
        return this.state[0]
    }
    if (this.state[2]!=="" && this.state[2]===this.state[4] && this.state[4]===this.state[6]){
        return this.state[2]
    }

    //la griglia e' piena e non ha vinto nessuno=TIE
    if (this.isFull()){
        return "tie"
    }
    return "in corso"
}

restartGame(){
        this.state=["", "", "", "", "", "", "", "", ""]
        this.possibleMoves=[]
}

}