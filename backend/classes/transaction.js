class Transaction {
  constructor(transactionID, budgetID, categoryName, type, amount, date, dateRecorded) {
    this.transactionID = transactionID;
    this.budgetID = budgetID;
    this.categoryName = categoryName;
    this.type = type;
    this.amount = amount
    this.date = date.toLocaleDateString();
    this.dateRecorded = `${dateRecorded.toLocaleDateString()} ${dateRecorded.toLocaleTimeString()}`;
  }
}

class TransactionType {
  constructor(transactionTypeID, type) {
    this.transactionTypeID = transactionTypeID;
    this.type = type;
  }
}

module.exports = { Transaction, TransactionType };
