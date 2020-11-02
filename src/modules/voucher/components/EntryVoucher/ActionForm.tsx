import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Container,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faShare } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { ActionAlert } from '../../config/Constants';
import { voucherRoles } from '../../../../config';

class ActionForm extends Component<any, any> {
  thousandSeparator = (x: any) => {
    let numb = x;
    if (typeof numb === 'string') numb = Number(numb);
    return numb.toLocaleString('en', { maximumFractionDigits: 4 });
  };
  confirmRemoveTransaction = () => {
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
  confirmDuplicated = () => {
    const message = 'Are you sure you want to duplicate for this transaction?';
    const param = {
      type: 'info',
      title: 'Attention!',
      confirmBtnBsStyle: 'primary',
      cancelBtnBsStyle: 'default',
      message,
      showCancel: true,
      focusConfirmBtn: false,
    };
    this.props.setSweetAlert(param, ActionAlert.Duplicate);
  }
  confirmPostGL = () => {
    const message = 'Are you sure you want to post this to GL?';
    const param = {
      type: 'warning',
      title: 'Attention!',
      confirmBtnBsStyle: 'default',
      cancelBtnBsStyle: 'danger',
      message,
      showCancel: true,
      focusConfirmBtn: false,
    };
    this.props.setSweetAlert(param, ActionAlert.PostGL);
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
          pathname: '/voucher',
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
    const {
      isDuplicate,
      isViewTransDetailMode,
      headerId,
      postingState,
    } = this.props;

    return (
      <Container className="container-action">
        <Container className="container-action-left">
          <Row className="row-header">
            {this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_PostToGl) &&
              !isViewTransDetailMode && postingState === "UP"
              && (
                <Col md="3" lg="3">
                  <Button
                    type="button"
                    color="success"
                    className="width-100-percent color-white"
                    onClick={this.confirmPostGL}
                  >
                    <FontAwesomeIcon icon={faShare} /> &nbsp;
                    Post to GL
                  </Button>
                </Col>
              )
            }

            {this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Duplicate) &&
              headerId && headerId !== "" && !isDuplicate && (
                <Col md="3" lg="3">
                  <Button
                    type="button"
                    color="primary"
                    className="width-100-percent color-white"
                    onClick={this.confirmDuplicated}
                  >
                    <i className="icon-pencil" /> &nbsp;
                   Duplicate
                  </Button>
                </Col>
              )
            }

            { this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Remove) && 
              !isViewTransDetailMode && postingState === "UP" && headerId && headerId !== "" && !isDuplicate && (
                <Col md="3" lg="3">
                  <Button
                    type="button"
                    color="danger"
                    className="width-100-percent color-white"
                    onClick={this.confirmRemoveTransaction}
                  >
                    <i className="icon-trash" />&nbsp;
                    Remove
                  </Button>
                </Col>
              )
            }
          </Row>
        </Container>

        <Container className="container-action-right">
          <Row className="row-header">
            <Col md="6" lg="6">
              {
                this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Save)
                && !isViewTransDetailMode
                && postingState === "UP"
                && (
                  <Button
                    type="button"
                    color="primary"
                    className="width-100-percent color-white"
                    onClick={() => this.props.handleSaveTransaction(false)}
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
                onClick={this.handleCloseButton}
              >
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
