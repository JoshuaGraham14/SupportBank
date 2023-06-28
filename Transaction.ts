import moment from 'moment';

export default class Transaction {
    date: string;
    from: string;
    to: string;
    narrative: string;
    amount: number;

    constructor(date: string, from: string, to: string, narrative: string, amount: number) {
        this.date = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}