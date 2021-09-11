export default class Player {

    //player class with player attributes
    constructor(name, simbolo, simboloAvversario,score) {
        this.name=name
        this.simbolo=simbolo
        this.simboloAvversario=simboloAvversario
        this.score=score;
    }

    setName(name){this.name=name}

}

