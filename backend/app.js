const sqlConfig = require('./sqlConfig');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bp = require('body-parser');

const UserData = require('./classes/userData');
const ErrorRes = require('./classes/errorRes');
const SuccessRes = require('./classes/successRes');
const Category = require('./classes/category');
const Budget = require('./classes/budget');
const { Transaction, TransactionType } = require('./classes/transaction');
const UserIncome = require('./classes/income');

const app = express();
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json());
app.use(cors());

const conn = mysql.createConnection(sqlConfig);

conn.connect(err => {
  if (err)
    throw err;
  console.log('Connected successfully');
});

app.post('/CreateUser', (req, res) => {
  let sql = 'CALL CreateUser(?, ?, ?, ?, ?);';
  let values = [req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.username, req.body.password];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.length >= 1) {
      let data = rows[0][0];
      if (data.result === -2) {
        res.send(new ErrorRes('Username already exists.'));
      } else if (data.result === -1) {
        res.send(new ErrorRes('An account with that email address has already been created.'))
      } else if (data.result === 0) {
        res.send(new ErrorRes('Unable to create user account. Please try again.'));
      } else {
        let loginSql = 'CALL LoginUser(?, ?);';
        let loginValues = [req.body.username, req.body.password];
        let loginOptions = { sql: loginSql, values: loginValues };
        conn.query(loginOptions, (loginErr, loginRows) => {
          if (loginErr)
            throw loginErr;
          let data = loginRows[0][0];
          let user = new UserData(data.UserID, data.FirstName, data.LastName, data.Username, data.Verified, data.LastLogin);
          res.send(user);
        });
      }
    }
  });
});

app.post('/Login', (req, res) => {
  let sql = 'CALL LoginUser(?, ?);';
  let values = [req.body.username, req.body.password];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.length >= 1) {
      let data = rows[0][0];
      let user = new UserData(data.UserID, data.FirstName, data.LastName, data.Username, data.Verified, data.LastLogin);
      res.send(user);
    } else {
      res.send(new ErrorRes('Incorrect login information. Please try again.'));
    }
  });
});

app.post('/SetPersist', (req, res) => {
  let sql = 'CALL SetPersistCookie(?, ?);';
  let values = [req.body.cookie, req.body.userID];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.affectedRows === 1) {
      res.send(new SuccessRes('OK.'))
    } else {
      res.send(new ErrorRes(JSON.stringify(rows)));
    }
  });
});

app.post('/GetPersist', (req, res) => {
  let sql = 'CALL GetPersistCookie(?);';
  let values = [req.body.cookie];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.length >= 1) {
      let data = rows[0][0];
      let user = new UserData(data.UserID, data.FirstName, data.LastName, data.Username, data.Verified, data.LastLogin);
      res.send(user);
    } else {
      res.send(new ErrorRes('Unable to get persisted login info.'));
    }
  });
});

app.post('/Logout', (req, res) => {
  let sql = 'CALL ClearCookie(?);'
  let values = [req.body.userID];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.affectedRows === 1) {
      res.send(new SuccessRes("OK."));
    } else {
      res.send(new ErrorRes(JSON.stringify(rows)));
    }
  });
});

app.post('/GetCategories', (req, res) => {
  let sql = 'CALL GetCategories(?);';
  let values = [req.body.userID];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    let categories = [];
    if (rows.length >= 1) {
      let data = rows[0];
      for (let i in data) {
        categories.push(new Category(data[i].CategoryID, data[i].CategoryName));
      }
    }
    res.send(categories);
  });
});

app.post('/AddCategory', (req, res) => {
  let sql = 'CALL AddCategory(?, ?);';
  let values = [req.body.categoryName, req.body.userID];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.affectedRows === 1) {
      res.send(new SuccessRes("OK."));
    } else {
      res.send(new ErrorRes("Unable to add the new category."));
    }
  });
});

app.post('/GetBudgets', (req, res) => {
  let sql = 'CALL GetBudgets(? , ?, ?);';
  let values = [req.body.userID, req.body.month, req.body.year];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    let budgets = [];
    if (rows.length >= 1) {
      let data = rows[0];
      for (let i in data) {
        budgets.push(new Budget(
          data[i].BudgetID,
          data[i].CategoryName,
          data[i].IsVariable,
          data[i].MinAmount,
          data[i].MaxAmount
        ));
      }
    }
    res.send(budgets);
  });
});

app.post('/CreateBudget', (req, res) => {
  let sql = 'CALL CreateBudget(?, ?, ?, ?, ?, ?);';
  let { categoryID, isVariable, minAmount, maxAmount, month, year } = req.body;
  let values = [categoryID, isVariable, minAmount, maxAmount, month, year];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.affectedRows === 1) {
      res.send(new SuccessRes("OK."));
    } else {
      res.send(new ErrorRes("Unable to create the new budget."));
    }
  });
});

app.post('/GetTransactions', (req, res) => {
  let sql = 'CALL GetTransactions(?, ?, ?);';
  let values = [req.body.userID, req.body.start, req.body.end];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    let transactions = [];
    if (rows.length >= 1) {
      let data = rows[0];
      for (let i in data) {
        transactions.push(new Transaction(
          data[i].TransactionID,
          data[i].BudgetID,
          data[i].CategoryName,
          data[i].Type,
          data[i].Amount,
          data[i].Date,
          data[i].DateRecorded
        ));
      }
    }
    conn.query('CALL GetTransactionTypes();', (typeErr, typeRows) => {
      if (typeErr)
        throw typeErr;
      let types = [];
      if (typeRows.length >= 1) {
        let typeData = typeRows[0];
        for (let i in typeData) {
          types.push(new TransactionType(typeData[i].TransactionTypeID, typeData[i].Type));
        }
      }
      res.send({ transactions, types });
    });
  });
});

app.post('/NewTransaction', (req, res) => {
  let sql = 'CALL CreateTransaction(?, ?, ?, ?);';
  let values = [req.body.budgetID, req.body.typeID, req.body.amount, req.body.date];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.affectedRows === 1) {
      res.send(new SuccessRes("OK."));
    } else {
      res.send(new ErrorRes("Unable to add the new transaction."));
    }
  });
});

app.post('/GetIncome', (req, res) => {
  let sql = 'CALL GetIncome(?, ?, ?)';
  let values = [req.body.userID, req.body.start, req.body.end];
  let options = { sql, values };
  console.log('values', values);
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.length >= 1) {
      let data = rows[0];
      console.log(data);
      let income = new UserIncome(data);
      res.send(income);
    } else {
      res.send(new ErrorRes("Unable to retrieve income values."));
    }
  });
});

app.post('/SetExpected', (req, res) => {
  let sql = 'CALL SetExpectedIncome(?, ?, ?, ?);';
  let values = [req.body.userID, req.body.amount, req.body.month, req.body.year];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.length >= 1) {
      let data = rows[0];
      res.send(data[0].Amount.toString());
    } else {
      res.send(new ErrorRes("Unable to set the expected income."));
    }
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
