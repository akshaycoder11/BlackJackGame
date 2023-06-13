export class BaseGameModel {
    private bankBalance: number;
    private betAmount:number;
    protected isPlayerWon!:boolean;
    constructor() {
        this.bankBalance = 1000;            /* this class is used for storing values */
        this.betAmount=0;
    }
    public getBankBalance():number{
        return this.bankBalance;
    }
    public setBankBalance(value:number){
        this.bankBalance=value;
    }
    public setBetAmount(value:number){
        this.betAmount=value;
    }
    public getBetAmount():number{
        return this.betAmount
    }
    public getIsPlayerWon():boolean{
        return this.isPlayerWon;
    }
    public setIsPlayerWon(value:boolean){
        this.isPlayerWon=value;
    }

}