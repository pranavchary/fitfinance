import React from 'react';
import PropTypes from 'prop-types';

import './Button.css';

export const ButtonLink = (props) => {
  return (
    <div className={props.disabled === true ? "button-link disabled" : "button-link" }
      onClick={ () => { if (props.disabled === false) { props.onClick() } } }
      style={{
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        opacity: props.disabled === true ? 0.75 : 1,
        ...props.style
      }}
    >
      {props.text}
    </div>
  )
}

ButtonLink.defaultProps = {
  color: '#3498DB',
  fontSize: '80%',
  fontWeight: 500,
  style: { },
  onClick: () => { console.log('hello') },
  disabled: false,
  text: 'Hello'
}

ButtonLink.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.number,
  style: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  text: PropTypes.string
}
