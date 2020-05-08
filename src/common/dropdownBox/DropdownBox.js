import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import NotifIcon from '../../assets/notif-dark.png';

import './DropdownBox.css';

export const DropdownBox = (props) => {
  const [openDropdown, toggleOpenDropdown] = useState(false);
  const [boxHeight, setBoxHeight] = useState(0);

  useEffect(() => {
    if (props.items.length > 0 && openDropdown && boxHeight < props.bodyMaxHeightPx) {
      setTimeout(() => { setBoxHeight(boxHeight + 1) }, 1);
    } else if (!openDropdown && boxHeight > 0) {
      setTimeout(() => { setBoxHeight(boxHeight - 1) }, 1);
    } else {
      clearTimeout();
    }
  });

  let styles = {
    dropdownBox: {
      height: props.height,
      width: props.width,
      borderColor: props.mainColor,
      borderRadius: props.borderRadius,
      padding: props.padding,
      ...props.boxStyle
    },
    header: {
      backgroundColor: props.mainColor,
      borderTopLeftRadius: props.borderRadius,
      borderTopRightRadius: props.borderRadius,
      ...props.headerStyle
    },
    title: {
      color: props.titleColor,
      ...props.titleStyle
    },
    body: {
      height: boxHeight,
      maxHeight: props.bodyMaxHeightPx + 'px'
    }
  }
  return (
    <div className={props.className ? `ddbox ${props.className}` : "ddbox"} style={styles.dropdownBox}>
      <div className="ddbox-header" style={styles.header} onClick={ () => toggleOpenDropdown(!openDropdown) }>
        <img className="ddbox-icon" src={ props.headerIcon } alt="Header Icon" />
        <span className="ddbox-title" style={styles.title}>{ props.title } ({ props.items.length })</span>
      </div>
      <div className="ddbox-body" style={styles.body}>
        {
          props.items.map(item => {
            return (
              <div className="ddbox-item">• { item }</div>
            )
          })
        }
      </div>
    </div>
  )
}

DropdownBox.defaultProps = {
  height: 'unset',
  width: '100%',
  mainColor: '#3498DB',
  borderRadius: '0.5rem',
  padding: 0,
  titleColor: '#FAFAFA',
  title: 'Dropdown Box',
  boxStyle: { },
  headerStyle: { },
  titleStyle: { },
  headerIcon: NotifIcon,
  bodyMaxHeightPx: 150,
  items: []
}

DropdownBox.propTypes = {
  className: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  mainColor: PropTypes.string,
  borderRadius: PropTypes.string,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  titleColor: PropTypes.string,
  title: PropTypes.string,
  boxStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  headerIcon: PropTypes.string,
  bodyMaxHeightPx: PropTypes.number,
  items: PropTypes.array
}
