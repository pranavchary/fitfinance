class Budget {
  constructor(budgetID, categoryName, isVariable, minAmount, maxAmount) {
    this.budgetID = budgetID;
    this.categoryName = categoryName;
    this.isVariable = isVariable === 1;
    this.minAmount = minAmount;
    this.maxAmount = maxAmount;
  }
}

module.exports = Budget;
