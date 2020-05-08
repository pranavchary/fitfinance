import React from 'react';
import PropTypes from 'prop-types';

import './Input.css';

export const SelectInput = (props) => {
  return (
    <select
      className="selectInput"
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
        ...props.style
      }}
      name={ props.name }
      id={props.id}
      onChange={(e) => props.onChange(e)}
      onFocus={(e) => props.onFocus(e)}
      onBlur={(e) => props.onBlur(e)}
    >
      <option>{props.defaultOption}</option>
      { props.options.map((option, i) => (<option key={`${props.name}${i}`} value={option.value}>{option.text}</option>)) }
    </select>
  );
}

SelectInput.defaultProps = {
  width: '280px',
  height: '25px',
  borderRadius: '0.5rem',
  style: { },
  name: 'select',
  id: 'select',
  onChange: () => { },
  onFocus: () => { },
  onBlur: () => { },
  defaultOption: '---',
  options: []
}

SelectInput.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  defaultOption: PropTypes.string,
  options: PropTypes.array
}
