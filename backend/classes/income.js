class RecordedIncome {
  constructor(recordedIncomeID, type, date, amount) {
    this.recordedIncomeID = recordedIncomeID;
    this.type = type;
    this.date = date;
    this.amount = amount;
  }
}

class UserIncome {
  constructor(incomeArray) {
    this.expected = 0;
    this.recorded = [];
    if (incomeArray[0] && incomeArray[0].ExpectedIncome) {
      this.expected = incomeArray[0].ExpectedIncome;
    }
    for (let i in incomeArray) {
      if (incomeArray[i].RecordedIncomeID) {
        this.recorded.push(new RecordedIncome(incomeArray[i].RecordedIncomeID,
          incomeArray[i].Type,
          incomeArray[i].Date,
          incomeArray[i].Amount
        ));
      }
    }
  }
}

module.exports = UserIncome;
