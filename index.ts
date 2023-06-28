import fs from 'fs';
import csvParser from 'csv-parser';
import Transaction from './Transaction';
import Account from "./Account";

const transactions: Transaction[] = [];
let accountDict = new Map<string, Account>();

fs.createReadStream('Transactions2014.csv')
    .pipe(csvParser())
    .on('data', (data) => {
        let transactionAmount = parseFloat(data['Amount']);

        if(!accountDict.has(data['From'])) {
            accountDict.set(data['From'], new Account(data['From']));
        }
        if(!accountDict.has(data['To'])) {
            accountDict.set(data['To'], new Account(data['To']));
        }

        const transaction = new Transaction(
            data['Date'],
            accountDict.get(data['From'])!,
            accountDict.get(data['To'])!,
            data['Narrative'],
            transactionAmount
        );
        transactions.push(transaction);

        accountDict.get(data['From'])!.deductMoney(transactionAmount);
        accountDict.get(data['To'])!.addMoney(transactionAmount);
    })
    .on('end', () => {
        outputAccountBalances();
    });

// Function to output names and total amounts
function outputAccountBalances(): void {
    const sortedNames = Array.from(accountDict.keys()).sort();
    console.log("Name\t\tTotal Amount\tStatus");
    console.log("----------------------------------------");
    for (const name of sortedNames) {
        const account = accountDict.get(name)!;
        const balance = account.getBalance();
        const status = balance >= 0 ? "OWED" : "THEY OWE";
        console.log(`${name.padEnd(15)}${balance.toFixed(2).padEnd(15)}${status}`);
    }
}
