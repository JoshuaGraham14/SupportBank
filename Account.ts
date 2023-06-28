export default class Account {
    name: string;
    balance: number;

    constructor(name: string) {
        this.name = name;
        this.balance = 0;
    }
}