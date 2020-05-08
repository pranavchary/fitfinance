import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SwitchInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "off" }
  }

  onClick = (e, propsOnClick = true) => {
    e.persist();
    this.setState({
      value: e.target.value === "on" ? "off" : "on"
    }, () => {
      if (propsOnClick)
      this.props.onClick(e);
    });
  }

  render() {
    return (
      <div className="switchinput-container">
        <label className="switchinput-label">{ this.props.labelText }</label>
        <div className="switchinput-switch">
          <input
            type="checkbox"
            className={ this.props.className ? `switchinput ${ this.props.className }` : "switchinput" }
            name={ this.props.name }
            id={ this.props.id }
            onClick={ (e) => this.onClick(e) }
            value={this.state.value}
            />
          <label htmlFor={ this.props.id } className="switchinput-slider"></label>
        </div>
      </div>
    )
  }
}

SwitchInput.defaultProps = {
  labelText: '',
  className: '',
  name: 'checkbox',
  id: 'checkbox',
  onClick: () => { }
}

SwitchInput.propTypes = {
  labelText: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func
}

export default SwitchInput;
