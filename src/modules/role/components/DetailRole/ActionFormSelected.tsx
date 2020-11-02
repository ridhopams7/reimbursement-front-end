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

class ActionFormSelected extends Component<any, any> {

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


    handleCloseButton = () => {
        try {
            const { flagChange,
                // isApproval
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
                    pathname: '/user/role',
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

                </Container>
                <Container className="container-action-right">
                    <Row className="row-header">

                        <Col md="6" lg="6">
                            {
                                <Button
                                    type="button"
                                    color="primary"
                                    className="width-100-percent color-white"
                                    onClick={this.confirmSave}
                                >
                                    <FontAwesomeIcon icon={faSave} /> &nbsp;
                                    Save
                                </Button>

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

export default connect(mapStateToProps, null)(ActionFormSelected);
