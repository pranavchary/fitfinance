import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { amountWithDecimals } from '../helpers';

import './BudgetBar.css';

const BudgetBar = (props) => {
  const [barWidth, setBarWidth] = useState(0);

  const renderProgress = () => {
    const width = props.myValue / props.maxValue * 100;
    if (barWidth < width) {
      setTimeout(() => { setBarWidth(barWidth + 1) }, props.loadSec * 10)
    }
  }

  const changeProgColor = (perc) => {
    if (perc >= props.highThreshold) {
      return props.budgetHighColor
    } else if (perc > props.lowThreshold && perc < props.highThreshold) {
      return props.budgetMidColor
    } else {
      return props.budgetLowColor
    }
  }

  const changeTextColor = (perc) => {
    if (perc >= props.highThreshold) {
      return props.budgetHighTextColor
    } else if (perc > props.lowThreshold && perc < props.highThreshold) {
      return props.budgetMidTextColor
    } else {
      return props.budgetLowTextColor
    }
  }

  const styles = {
    budgetbar: {
      width: `${props.width * 1.5}px`,
      margin: `${props.margin}px`,
      height: `${props.height}px`
    },
    container: {
      width: `${props.width}px`,
      height: `${props.height}px`,
      border: props.noBorder ? 'none' : props.border,
      borderRadius: `${props.borderRadius}px`,
      backgroundColor: props.background ? 'rgba(0, 0, 0, 0.1)' : ''
    },
    progress: {
      width: props.noAnimate ? `${(props.myValue/props.maxValue * 100) + 2}%` : `${barWidth + 2}%`,
      left: '-2%',
      backgroundColor: changeProgColor(props.noAnimate ? (props.myValue/props.maxValue * 100) : barWidth),
      borderBottomLeftRadius: props.noBorder ? 0 : 'inherit',
      borderTopLeftRadius: props.noBorder ? 0 : 'inherit'
    },
    text: {
      color: changeTextColor(props.noAnimate ? (props.myValue/props.maxValue * 100) : barWidth)
    }
  }

  renderProgress();
  return (
    <div className='budgetbar' style={styles.budgetbar} >
      <label>{props.title}</label>
      <div className='budget-container' style={styles.container} >
        <div className='budget-progress' style={styles.progress} />
        {props.showValues ? (
          <div className='budget-value' style={styles.text}>
          {props.units}{amountWithDecimals(props.maxValue)}
          </div>
          ) : null
        }
      </div>
    </div>
  )
}

BudgetBar.defaultProps = {
  width: 200,
  height: 20,
  maxValue: 10,
  myValue: 5,
  budgetHighColor: '#C0392B',
  budgetHighTextColor: 'inherit',
  highThreshold: 75,
  budgetMidColor: '#F1C40F',
  budgetMidTextColor: 'inherit',
  budgetLowColor: '#2ECC71',
  budgetLowTextColor: 'inherit',
  lowThreshold: 50,
  border: '1px solid #e2e2e2',
  borderRadius: 5,
  loadSec: 1,
  units: '$',
  title: '',
  margin: 5,
  onClick: () => { }
}

BudgetBar.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  maxValue: PropTypes.number,
  myValue: function(props, propName, component) {
    if (typeof props[propName] !== 'number') {
      throw new Error(`Failed prop type: Invalid prop \`${propName}\` of type \`${typeof props[propName]}\` supplied to \`${component}\`, expected \`number\`.`)
    }
    if (props[propName] > props.maxValue) {
      throw new Error(`value of \`${propName}\` exceeds that of prop \`maxValue\` (${props.maxValue})`)
    }
  },
  budgetHighColor: PropTypes.string,
  budgetHighTextColor: PropTypes.string,
  highThreshold: PropTypes.number,
  budgetMidColor: PropTypes.string,
  budgetMidTextColor: PropTypes.string,
  budgetLowColor: PropTypes.string,
  budgetLowTextColor: PropTypes.string,
  lowThreshold: PropTypes.number,
  border: PropTypes.string,
  borderRadius: PropTypes.number,
  loadSec: PropTypes.number,
  units: PropTypes.string,
  title: PropTypes.string,
  margin: PropTypes.number,
  onClick: PropTypes.func
}

export default BudgetBar;
