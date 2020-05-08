import React from 'react';
import PropTypes from 'prop-types';

import './Header.css';

export const Header = (props) => {
  return(
    <div id="header" style={{ ...props.headerStyle }}>
      { props.children }
    </div>
  );
}

Header.defaultProps = {
  headerStyle: { },
}

Header.propTypes = {
  headerStyle: PropTypes.object
}
