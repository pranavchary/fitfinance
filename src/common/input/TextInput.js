import React from 'react';
import PropTypes from 'prop-types';

import './Input.css';

const onKeyPress = (e, props) => {
  if (e.key === "Enter")
    props.onEnter();
}

export const TextInput = (props) => {
  return (
    <input
      type={props.type}
      className="text-input"
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
        ...props.style
      }}
      name={props.name}
      placeholder={props.placeholder}
      id={props.id}
      value={props.defaultValue}
      onChange={ (e) => props.onChange(e) }
      onFocus={ (e) => props.onFocus(e) }
      onBlur={ (e) => props.onBlur(e) }
      onKeyPress={ (e) => onKeyPress(e, props) }
      autoFocus={props.autoFocus}
    />
  );
}

TextInput.defaultProps = {
  type: 'text',
  width: '280px',
  height: '25px',
  borderRadius: '0.5rem',
  style: { },
  name: 'input',
  placeholder: '',
  id: 'input',
  defaultValue: '',
  onChange: () => { },
  onFocus: () => { },
  onBlur: () => { },
  onEnter: () => { },
}

TextInput.propTypes = {
  type: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onEnter: PropTypes.func
}
