/*The AI logic.
* The AI can play with three different levels of expertise:
*
* IMPOSSIBLE: The Ai will perform a minimax search (with alpha beta optimization),
* reaching the end of the game every time. It will return 1 for win, -1 for loss, 0 for a tie.
* The AI will * choose the move that can lead to the best possible outcome,
* even if the opponent plays optimally
*
* EASY: (when maxdepth<=0) The AI will choose a random move out of all the available ones
*
* MEDIUM: The Ai will perform a minimax search (with alpha beta optimization), same as the impossible
* level. It will, however, play out only the 2 immediately next moves (its and the opponent's). If
* it doesn't reach the end of the game, the move will be chosen by weighting who will own the most
* important cells on the board: center (weight=0.3), corners (0.2), middle (0.1)
* */
import Board from "./board.js";

export default class AI{
    bestMove; //the best move's cell
    alpha=-10000;
    beta=10000;
    simboloComputer; //the AI symbol: either "x" or "o"
    simboloAvversario //the human player symbol: either "x" or "o"

    constructor(maxdepth) {
        this.maxdepth=maxdepth
    }
    
    play(board,computer){
        if(this.maxdepth<=0){
            //easy level: just return a random move, out of all the possible ones
            const child = new Board([...board.state]);
            //possible moves
            const combinazioni = child.mossePossibili();
            var rand=Math.floor(Math.random() * combinazioni.length);
            return combinazioni[rand]
        }
        //medium and impossible: perform a minimax search
        return this.minimax(board,computer);
         }

    minimax(board,computer){
        var value=-1 //best possible outcome: initialized to loss
        this.simboloComputer=computer.simbolo
        this.simboloAvversario=computer.simboloAvversario
        //create a new board where to add the new move
        const child = new Board([...board.state]);
        //get all possible moves
        var combinazioni=child.mossePossibili()
        //bestMove: initialized to the first legal one
        this.bestMove=combinazioni[0]
        for (let i = 0; i < combinazioni.length; i++) {
            //perform the move
            child.mossa(this.simboloComputer, combinazioni[i]);
            //recursively go down the game tree, and check the best possible outcome
            var ris=this.minimaxR("human", child,1)
            //if a possible win is found, return the current move (a win is the best possible outcome,
            //so, cannot improve)
            if (ris===1){return combinazioni[i]}
            //if this move improves the current best outcome, choose this as the current best
            if (ris>value){
                this.bestMove=combinazioni[i]
                value=ris}
            //remove the move from the board
            child.mossa("", combinazioni[i]);
            }
        return this.bestMove
    }
    minimaxR(player,board,depth){
        //check if the game has ended
        var finepartita=board.finePartita();
        //if the AI has won return 1
        if (finepartita===this.simboloComputer){ return 1}
        //if the AI has lost return -1
        else if (finepartita===this.simboloAvversario){ return -1}
        //if the game ended in a tie
        else if (finepartita==="tie"){ return 0}
        //if the level is MEDIUM, and we have reached the max explorable depth, compute the advantage
        else if (depth>=this.maxdepth){
            return board.getAdvantage(this.simboloComputer,this.simboloAvversario)}
        var combinazioni;
        var ris;
        //computer: has the goal of maximizing the outcome
        if (player==="computer"){
            var value=-1 //best possible outcome: initialized to loss
            //create a new board where to add the new move
            const child = new Board([...board.state]);
            //get all possible moves
            combinazioni=child.mossePossibili()
            for (let i = 0; i < combinazioni.length; i++) {
                //perform the move
                child.mossa(this.simboloComputer, combinazioni[i]);
                //recursively go down the game tree, and check the best possible outcome
                ris=this.minimaxR("human", child,depth+1)
                //if a possible win is found, return the current move (a win is the best possible outcome,
                //so, cannot improve)
                if (ris===1){return 1}
                value=Math.max(value, ris);
                child.mossa("", combinazioni[i]);
                //pointless to continuing going down this tree branch:
                // the opponent will always choose the beta with lower value
                if (value>this.beta){break}
                this.alpha=Math.max(value, this.alpha)
              }
            return value
        }
        //"human": has the goal of minimizing the outcome
        value=1
        const child = new Board([...board.state]);
        combinazioni=child.mossePossibili()
        for (let i = 0; i < combinazioni.length; i++) {
            //perform the move
            child.mossa(this.simboloAvversario, combinazioni[i]);
            //recursively go down the game tree, and check the best possible outcome
            ris=this.minimaxR("computer", child,depth+1)
            if (ris===-1){return -1}
            value=Math.min(value, ris)
            child.mossa("", combinazioni[i]);
            if (value<this.alpha){break}
            this.beta=Math.min(value, this.beta)
            }
        return value
    }
}
