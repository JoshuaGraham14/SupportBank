export default class Account {
    name: string;
    balance: number;

    constructor(name: string) {
        this.name = name;
        this.balance = 0;
    }

    addMoney(amount: number): void {
        this.balance += amount;
        this.balance = parseFloat(this.balance.toFixed(2));
    }

    deductMoney(amount: number): void {
        this.balance -= amount;
        this.balance = parseFloat(this.balance.toFixed(2));
    }

    getName(): string {
        return this.name;
    }

    getBalance(): number {
        return this.balance;
    }
}