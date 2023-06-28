import moment from 'moment';
import Account from "./Account";

export default class Transaction {
    date: string;
    from: Account;
    to: Account;
    narrative: string;
    amount: number;

    constructor(date: string, from: Account, to: Account, narrative: string, amount: number) {
        this.date = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}