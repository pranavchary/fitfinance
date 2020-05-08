import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { TextInput } from '../../common/input/TextInput';
import { Button } from '../../common/button/Button';
import { getCategories, addCategory, clearDataFrom } from './actions';
import { ADD_CATEGORY_SUCCESS, ADD_CATEGORY_FAIL } from '../../redux/types';

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catname: '',
      errorMsg: ''
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.categories.dataFrom !== this.props.categories.dataFrom
      && this.props.categories.dataFrom === ADD_CATEGORY_SUCCESS) {
      this.props.getCategories(this.props.userID);
      this.props.onClickClose();
      this.props.history.push('/menu');
    } else if (prevProps.categories.dataFrom !== this.props.categories.dataFrom
      && this.props.categories.dataFrom === ADD_CATEGORY_FAIL) {
        this.setState({
          errorMsg: this.props.categories.errorMsg
        }, () => { this.props.clearDataFrom(); });
      }
  }

  createCategory = () => {
    let error = false;
    if (this.state.catname.trim().length === 0) {
      error = true;
      this.setState({ errorMsg: 'Category name cannot be blank.' });
    } else if (this.state.catname.trim().length > 30) {
      error = true;
      this.setState({ errorMsg: 'Category name cannot be more than 30 characters.' });
    } else {
      let currentCategories = this.props.categories.values;
      for (let i in currentCategories) {
        if (currentCategories[i].categoryName.toLowerCase() === this.state.catname.trim().toLowerCase()) {
          error = true;
          this.setState({
            errorMsg: `Category "${currentCategories[i].categoryName}" already exists.`
          });
          break;
        }
      }
      if (!error)
        this.props.addCategory(this.state.catname.trim(), this.props.userID);
    }
  }

  onChange = (e) => {
    let field = e.target.id;
    let val = e.target.value;
    this.setState({
      [field]: val
    });
  }

  onClose = () => {
    this.setState({
      catname: '',
      errorMsg: ''
    }, () => {
      this.props.onClickClose();
      this.props.history.push('/menu');
    });
  }

  render() {
    return (
      <div className="modal-bg" onClick={ () => this.onClose() } style={{ ...this.props.modalBgStyle }}>
        <div
          className={this.props.modalClass}
          onClick={ (e) => { e.stopPropagation(); } }
          style={{ ...this.props.modalStyle }}
        >
          <div className="modal-title"><h1>New Category</h1></div>
          <div className="modal-info">
            <div className="modal-input-container">
              <label htmlFor="catname">Category Name</label>
              <TextInput
                name="catname"
                id="catname"
                width="200px"
                defaultValue={this.state.catname}
                onChange={ (e) => this.onChange(e) }
                autoFocus
                onEnter={ () => this.createCategory() }
                />
            </div>
          </div>
          <div className="modal-error">{ this.state.errorMsg }</div>
          <div className="modal-buttons">
            <Button
              text="Save"
              backgroundColor="#2ECC71"
              onClick={ () => this.createCategory() }
            />
            <Button
              text="Close"
              backgroundColor="#D2D2D2"
              onClick={ () => this.onClose() }
            />
          </div>
        </div>
      </div>
    )
  }
}

AddCategory.defaultProps = {
  modalBgStyle: { },
  modalClass: 'modal-sm',
  modalStyle: { },
  onClickClose: () => { }
}

AddCategory.propTypes = {
  modalBgStyle: PropTypes.object,
  modalClass: PropTypes.string,
  modalStyle: PropTypes.object,
  onClickClose: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    userID: state.login.userID,
    categories: state.categories
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getCategories,
    addCategory,
    clearDataFrom
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCategory);
