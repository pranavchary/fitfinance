import React from 'react';
import PropTypes from 'prop-types';

import './Transactions.css';

export const TransactionCardSmall = (props) => {
  return (
    <div className="txn-smallcard">
      <div className="txn-smallcard-row smallcard-title-row">
        <div className="smallcard-title">{props.categoryName}</div>
        <div className="txn-smallcard-date">{props.date}</div>
      </div>
      <div className="txn-smallcard-row">
        <div>${props.amount}</div>
        <div>{ props.type}</div>
      </div>
    </div>
  );
}

TransactionCardSmall.defaultProps = {
  categoryName: '',
  date: new Date(),
  amount: 0,
  type: ''
}

TransactionCardSmall.propTypes = {
  categoryName: PropTypes.string,
  date: function(props, propName, component) {
    if (isNaN(new Date(props[propName]).getTime())) {
      throw new Error(`Value provided for \`${propName}\` is not a valid date`);
    }
  },
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string
}
