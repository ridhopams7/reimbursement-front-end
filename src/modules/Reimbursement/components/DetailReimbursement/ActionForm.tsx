import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Container,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faShare, faCheck, faRemoveFormat, faBan } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { ActionAlert } from '../../config/Constants';
import { reimbursementTransactionRole } from '../../../../config';

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

  confirmPosting = () => {
    const message = 'Are you sure you want to posting data?';
    const param = {
      type: 'info',
      title: 'Attention!',
      confirmBtnBsStyle: 'primary',
      cancelBtnBsStyle: 'default',
      message,
      showCancel: true,
      focusConfirmBtn: false,
    };
    this.props.setSweetAlert(param, ActionAlert.Posting);
  }
  confirmApprovedRejected = (status: any) => {
    const message = `Are you sure you want to ${status} data?`;
    const param = {
      type: 'info',
      title: 'Attention!',
      confirmBtnBsStyle: 'primary',
      cancelBtnBsStyle: 'default',
      message,
      showCancel: true,
      focusConfirmBtn: false,
    };
    this.props.setSweetAlert(param, status);
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
        isApproval
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
        if (isApproval) {
          this.props.history.push({
            pathname: '/reimbursement/approval',
            state: {
              headerId: "",
            }
          })
        } else {
          this.props.history.push({
            pathname: '/reimbursement/transaction',
            state: {
              headerId: "",
            }
          })
        }
      }
    } catch (e) {
      console.log('error at handleCloseButton with error: ', e);
    }
  }

  render() {
    const {
      isApproval,
      isCreate,
      isPosting,
    } = this.props;

    return (
      <Container className="container-action">
        <Container className="container-action-left">
          <Row className="row-header">
            {!isApproval && !isCreate && !isPosting &&
              <Col md="3" lg="3">
                <Button
                  type="button"
                  color="success"
                  className="width-100-percent color-white"
                  // onClick={this.confirmPostGL}
                  onClick={this.confirmPosting}
                >
                  <FontAwesomeIcon icon={faShare} /> &nbsp;
                  Posting
              </Button>
              </Col>
            }
            {isApproval && !isCreate &&
              <Col md="3" lg="3">
                <Button
                  type="button"
                  color="info"
                  className="width-100-percent color-white"
                  onClick={() => this.confirmApprovedRejected("Approved")}
                >
                  <FontAwesomeIcon icon={faCheck} /> &nbsp;
                  Approve
                </Button>
              </Col>
            }
            {isApproval && !isCreate &&
              <Col md="3" lg="3">
                <Button
                  type="button"
                  color="danger"
                  className="width-100-percent color-white"
                  onClick={() => this.confirmApprovedRejected("Rejected")}
                >
                  <FontAwesomeIcon icon={faRemoveFormat} /> &nbsp;
                  Reject
               </Button>
              </Col>
            }
            {!isApproval && !isCreate && !isPosting &&
              <Col md="3" lg="3">
                <Button
                  type="button"
                  color="danger"
                  className="width-100-percent color-white"
                  onClick={this.confirmRemove}
                >
                  <FontAwesomeIcon icon={faBan} /> &nbsp;
                  Remove
              </Button>

              </Col>
            }
          </Row>
        </Container>
        <Container className="container-action-right">
          <Row className="row-header">

            <Col md="6" lg="6">
              {!isApproval && !isPosting &&
                this.props.resAuth.menus.find((obj: any) =>
                  obj.menu === reimbursementTransactionRole.Reimbursement_Transaction_Save)
                && (
                  <Button
                    type="button"
                    color="primary"
                    className="width-100-percent color-white"
                    onClick={this.confirmSave}
                  >
                    <FontAwesomeIcon icon={faSave} /> &nbsp;
                    Save
                  </Button>
                )
              }
            </Col>

            <Col md="6" lg="6">
              <Button
                type="button"
                color="danger"
                className="width-100-percent color-white"
                onClick={this.handleCloseButton}>
                <i className="icon-close" /> &nbsp;
                Close
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

export default connect(mapStateToProps, null)(ActionForm);
