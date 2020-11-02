import React, { Component } from 'react';
import {
    Row, Col,
    Label,
    Input,
    Container,
} from 'reactstrap';
import { connect } from 'react-redux';
import { statusName } from '../../../../config';

class HeaderForm extends Component<any, any> {
    render() {
        const {
            reimbursement,
            combobox,
            isCreate,
            isApproval,
            isPosting,
        } = this.props;
        const status = reimbursement && statusName.find((obj: any) => obj.id === reimbursement.status);
        const statName = status === undefined ? 'open' : status.name;
        return (
            <Container className="container-header">
                <Container className="container-header-left">
                    {!isCreate &&
                        <Row className="row-header center">
                            <Col md="4" lg="4" className="align-self-center">
                                <Label className="font-size-13">Code</Label>
                            </Col>
                            <Col md="8" lg="8" className="align-self-center">
                                <Label className="font-size-13">{reimbursement && reimbursement.code}</Label>
                            </Col>
                        </Row>
                    }
                    {!isCreate &&
                        <Row className="row-header center">
                            <Col md="4" lg="4" className="align-self-center">
                                <Label className="font-size-13">Status</Label>
                            </Col>
                            <Col md="8" lg="8" className="align-self-center">
                                <Label className="font-size-13">{reimbursement && statName}</Label>
                            </Col>
                        </Row>
                    }
                    <Row className="row-header center">
                        <Col md="4" lg="4" className="align-self-center">
                            <Label className="font-size-13">Period</Label>
                        </Col>
                        <Col md="8" lg="8" className="align-self-center">
                            <Input
                                type="select"
                                name="accountingPeriodId"
                                className="font-size-13"
                                onChange={e => this.props.handleChangeInputField(e)}
                                value={reimbursement && reimbursement.accountingPeriodId}
                                disabled={isApproval || isPosting}
                            >
                                {
                                    combobox && combobox.accountingPeriods.map((item: any, index: number) => {
                                        const { id, name } = item;
                                        return (
                                            <option value={id} className="font-size-13" key={index}>{name}</option>
                                        );
                                    })
                                }
                            </Input>

                        </Col>
                    </Row>

                    <Row className="row-header center">
                        <Col md="4" lg="4" className="align-self-flex-start">
                            <Label className="font-size-13">Description</Label>
                        </Col>
                        <Col md="8" lg="8" className="align-self-center">
                            <Input
                                type="textarea"
                                name="description"
                                id="description"
                                rows="6"
                                placeholder="Description"
                                value={reimbursement && reimbursement.description}
                                onChange={e => this.props.handleChangeInputField(e)}
                                className="font-size-13"
                                disabled={isApproval || isPosting}
                                maxLength={300}
                            />

                        </Col>
                    </Row>
                </Container>
                <Container className="container-header-right">
                    <Row className="row-header center">
                        <Col md="4" lg="4" className="align-self-center">
                            <Label className="font-size-13">Client</Label>
                        </Col>
                        <Col md="8" lg="8" className="align-self-center">
                            <Input
                                type="select"
                                name="clientId"
                                className="font-size-13"
                                onChange={e => this.props.handleChangeInputField(e)}
                                value={reimbursement && reimbursement.clientId}
                                disabled={isApproval || isPosting}
                            >
                                {
                                    combobox && combobox.clients.map((item: any, index: number) => {
                                        const { id, codeName } = item;
                                        return (
                                            <option value={id} className="font-size-13" key={index}>{codeName}</option>
                                        );
                                    })
                                }
                            </Input>

                        </Col>
                    </Row>
                    <Row className="row-header center">
                        <Col md="4" lg="4" className="align-self-center">
                            <Label className="font-size-13">Project</Label>
                        </Col>
                        <Col md="8" lg="8" className="align-self-center">
                            <Input
                                type="select"
                                name="projectId"
                                className="font-size-13"
                                onChange={e => this.props.handleChangeInputField(e)}
                                value={reimbursement && reimbursement.projectId}
                                disabled={isApproval || isPosting}
                            >
                                <option value="">Select</option>
                                {
                                    combobox && combobox.projectsByClients.map((item: any, index: number) => {
                                        const { id, codeName } = item;
                                        return (
                                            <option value={id} className="font-size-13" key={index}>{codeName}</option>
                                        );
                                    })
                                }
                            </Input>

                        </Col>
                    </Row>
                    <Row className="row-header center">
                        <Col md="4" lg="4" className="align-self-center">
                            <Label className="font-size-13">PIC</Label>
                        </Col>
                        <Col md="8" lg="8" className="align-self-center">
                            <Input
                                type="select"
                                name="picId"
                                className="font-size-13"
                                onChange={e => this.props.handleChangeInputField(e)}
                                value={reimbursement && reimbursement.picId}
                                disabled={isApproval || isPosting}
                            >
                                {
                                    combobox && combobox.pics.map((item: any, index: number) => {
                                        const { id, fullName } = item;
                                        return (
                                            <option value={id} className="font-size-13" key={index}>{fullName}</option>
                                        );
                                    })
                                }
                            </Input>

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

export default connect(mapStateToProps, null)(HeaderForm);
