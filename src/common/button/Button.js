import React from 'react';
import PropTypes from 'prop-types';

import './Button.css';

export const Button = (props) => {
  return (
    <div className={props.disabled === true ? "button disabled" : "button"}
      style={{
        color: props.color,
        height: props.height,
        width: props.width,
        backgroundColor: props.backgroundColor,
        borderColor: props.backgroundColor,
        borderRadius: props.borderRadius,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        boxShadow: props.shadow ? props.boxShadow : '',
        opacity: props.disabled === true ? 0.75 : 1,
        ...props.style
      }}
      onClick={ () => { if (props.disabled === false) { props.onClick() } } }
    >
      { props.text }
    </div>
  );
}

Button.defaultProps = {
  color: '#2E2E2E',
  width: '80px',
  height: '40px',
  backgroundColor: '#FFB55F',
  borderRadius: '0.5rem',
  fontSize: '80%',
  fontWeight: 500,
  boxShadow: '1px 5px 6px 1px #2E2E2E',
  style: { },
  onClick: () => { console.log('hello') },
  disabled: false,
  text: 'Hello'
}

Button.propTypes = {
  color: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.number,
  boxShadow: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  text: PropTypes.string
}
