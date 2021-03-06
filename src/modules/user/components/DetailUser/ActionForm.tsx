import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Container,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { ActionAlert } from '../../config/Constants';
// import { voucherRoles } from '../../../../config';
  
class ActionForm extends Component<any, any> {
  thousandSeparator = (x: any) => {
    let numb = x;
    if (typeof numb === 'string') numb = Number(numb);
    return numb.toLocaleString('en', { maximumFractionDigits: 4 });
  };
  confirmSave = () => {
    const message = 'Are you sure you want to save data?';
    const param = {
      type: 'info',
      title: 'Attention!',
      confirmBtnBsStyle: 'primary',
      cancelBtnBsStyle: 'default',
      message,
      showCancel: true,
      focusConfirmBtn: false,
    };
    this.props.setSweetAlert(param, ActionAlert.Save);
  }
  confirmRemove = () => {
    try {
      const message = 'This action cannot be undo. Are you sure?';

      const param = {
        type: 'warning',
        title: 'Attention!',
        confirmBtnBsStyle: 'default',
        cancelBtnBsStyle: 'danger',
        message,
        showCancel: true,
        focusConfirmBtn: false,
      };

      this.props.setSweetAlert(param, ActionAlert.Remove);

    } catch (e) {
      console.log('error at confirmRemoveTransaction with error: ', e);
    }
  }

  handleCloseButton = () => {
    try {
      const { flagChange,
        // isViewTransDetailMode 
      } =
        this.props;

      if (flagChange) {
        const message = 'This action may discard your change and cannot be undo. Are you sure?';

        const param = {
          type: 'warning',
          title: 'Attention!',
          confirmBtnBsStyle: 'default',
          showCancel: true,
          cancelBtnBsStyle: 'danger',
          message,
          focusConfirmBtn: false,
        };
        this.props.setSweetAlert(param, ActionAlert.Close)
      } else {
        this.props.history.push({
          pathname: '/user/users',
          state: {
            headerId: "",
          }
        })
      }
    } catch (e) {
      console.log('error at handleCloseButton with error: ', e);
    }
  }

  render() {
    return (
      <Container className="container-action">
        <Container className="container-action-left">
        <Row className="row-header">  
           
            <Col md="4" lg="4">

              <Button
                type="button"
                color="primary"
                className="width-100-percent color-white"
                onClick={this.confirmSave}
              >
                <FontAwesomeIcon icon={faSave} /> &nbsp;
                Save
            </Button>
            </Col>


            <Col md="4" lg="4">
              <Button
                type="button"
                color="secondary"
                className="width-100-percent"
                onClick={this.handleCloseButton}>
                <i className="icon-close" /> &nbsp;
                Close
          </Button>
            </Col>
          </Row>
        </Container>
      </Container >
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

export default connect(mapStateToProps, null)(ActionForm);
