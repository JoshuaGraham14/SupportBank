import fs from 'fs';
import csvParser from 'csv-parser';
import Transaction from './Transaction';

const transactions: Transaction[] = [];
fs.createReadStream('Transactions2014.csv')
    .pipe(csvParser())
    .on('data', (data) => {
        const transaction = new Transaction(
            data['Date'],
            data['From'],
            data['To'],
            data['Narrative'],
            parseFloat(data['Amount'])
        );
        transactions.push(transaction);
    })
    .on('end', () => {
        console.log(transactions);
        // for (const transaction of transactions) {
        //     console.log(transaction.date);
        // }
    });