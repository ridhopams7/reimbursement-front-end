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
import { ActionAlert } from '../config/Constants';
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
  render() {
    const {
      // isDuplicate,
      // isViewTransDetailMode,
      headerData,
      // postingState,
    } = this.props;

    return (
      <Container style={{ padding: 0, marginBottom: 20, overflow: 'hidden' }}>
        <Container style={{ float: 'left', width: '70%' }}>
          <Row style={{ padding: '3px 13px' }}>
            
            {
             headerData && headerData.postingState === "UP" &&  (
                <Col md="3" lg="3">
                  <Button
                    type="button"
                    color="danger"
                    style={{ color: 'white', width: '100%' }}
                    onClick={this.confirmRemoveTransaction}>
                    <i className="icon-trash" />&nbsp;
                    Remove
                  </Button>
                </Col>
              )
            }
          </Row>
        </Container>

        <Container style={{ float: 'right', width: '30%' }}>
          <Row style={{ padding: '3px 13px' }}>
            <Col md="6" lg="6">
              {
              headerData && headerData.postingState === "UP" && (
                  <Button
                    type="button"
                    color="primary"
                    style={{ color: 'white', width: '100%' }}
                    onClick={() => this.props.handleSaveData()}>
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
                style={{ color: 'white', width: '100%' }}
                onClick={this.props.handleCloseButton}
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
