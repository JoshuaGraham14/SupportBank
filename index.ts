import fs, {read} from 'fs';
import csvParser from 'csv-parser';
import Transaction from './Transaction';
import Account from "./Account";
import readline from 'readline';

const transactions: Transaction[] = [];
let accountDict = new Map<string, Account>();

readCSV();

function getUserChoice(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Select an option (List All or List [Account]): ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function readInput(): Promise<string> {
    const userChoice = await getUserChoice();

    return userChoice;
}

function readCSV (): void {
    fs.createReadStream('Transactions2014.csv')
        .pipe(csvParser())
        .on('data', (data) => {
            let transactionAmount = parseFloat(data['Amount']);

            if (!accountDict.has(data['From'])) {
                accountDict.set(data['From'], new Account(data['From']));
            }
            if (!accountDict.has(data['To'])) {
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
        .on('end', async () => {
            let userInputtedString = await readInput();
            const userInputtedStringSplit = userInputtedString.split(" ");

            if (userInputtedString === "List All") {
                outputAccountBalances();
            }
            else if (userInputtedStringSplit[0] === "List") {
                const firstSpaceIndex = userInputtedString.indexOf(" ");
                if (firstSpaceIndex !== -1) {
                    const firstHalf = userInputtedString.substring(0, firstSpaceIndex);
                    const secondHalf = userInputtedString.substring(firstSpaceIndex + 1);
                    if (accountDict.has(secondHalf)) {
                        ouputAccountTransactions(secondHalf);
                    }
                    else {
                        console.log("Name doesn't exist");
                    }
                }
                else {
                    console.log("Invalid choice");
                }
            }
            else {
                console.log("Invalid choice");
            }
        });
}

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

function ouputAccountTransactions(accountName: string): void {
    console.log(`Transactions for Account: ${accountName}`);
    console.log("Date\t\tType\t\tWith\t\tAmount\t\tNarrative");
    console.log("-------------------------------------------------------------------");
    const accountTransactions = transactions.filter(transaction =>
        transaction.from.name === accountName || transaction.to.name === accountName
    );

    for (const transaction of accountTransactions) {
        const inOrOut = (transaction.from.name === accountName) ? "OUT" : "IN";
        const transactionWith = (transaction.from.name === accountName) ? transaction.to.name : transaction.from.name;
        console.log(`${transaction.date.padEnd(15)}${(inOrOut).toString().padEnd(15)}${transactionWith.padEnd(15)}${transaction.amount.toFixed(2).padEnd(15)}${transaction.narrative}`);
    }

    const balance = accountDict.get(accountName)!.getBalance();
    const status = balance >= 0 ? "OWED" : "THEY OWE";
    console.log("-------------------------------------------------------------------");
    console.log("TOTAL: " + `${balance.toFixed(2)} ${status}`);
}