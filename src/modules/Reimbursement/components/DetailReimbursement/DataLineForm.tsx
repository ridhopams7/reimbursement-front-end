import React, { Component } from 'react';
import {
    Row,
    Col, Input, Button, Table, Label, Card, Container, CardBody,
} from 'reactstrap';
// import ModalDataLine from './ModalDataLine';
import { default as NumberFormat } from 'react-number-format';
import { dataLineFormat } from '../../config/Constants';
import { thousandSeparator } from '../../action/Lib';


class DataLineTab extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            mapReimbursement: {},
            mapReimbursementDetail: [],
            alert: null,
        }
    }

    static getDerivedStateFromProps = (props: any, state: any) => {
        return {
            mapReimbursement: props.reimbursement,
            mapReimbursementDetail: props.reimbursementDetail,
        }
    }
    // componentDidUpdate = (props: any, state: any) => {
    //     const { isAddDataLine, mapDataLine } = state;
    //     if (isAddDataLine) {
    //         const el = document.getElementById(`actual${mapDataLine.length}`);
    //         if (el) {
    //             el.focus();
    //         }
    //         this.setState({ isAddDataLine: false });
    //     }
    // }
    handleChangeDataLine = (e: any, index_: number) => {
        try {
            const {
                mapReimbursement,
                mapReimbursementDetail,
            } = this.state;
            const {
                combobox,
            } = this.props;
            const copyReimbursementDetail = [...mapReimbursementDetail];
            const copyReimbursement = { ...mapReimbursement }
            const copyCombobox = { ...combobox }
            copyReimbursementDetail.forEach((item: any, index: number) => {
                if (index === index_) {
                    switch (e.target.name) {
                        case "transactionId":
                            const transaction = copyCombobox.transactions.find((obj: any) => obj.id === e.target.value);
                            item.transactionCode = transaction.code;
                            item.transactionName = transaction.value;
                            item[e.target.name] = e.target.value;
                            break;
                        case "amount":
                            const convertedAmount = Number(e.target.value.replace(/,/g, ''));

                            item[e.target.name] = convertedAmount;

                            copyReimbursement.actualAmount = this.handleSummaryAmount(copyReimbursementDetail);
                            break;
                        default:
                            item[e.target.name] = e.target.value;
                    }
                }
            });

            const data = {
                reimbursement: copyReimbursement,
                reimbursementDetail: copyReimbursementDetail
            }
            this.props.handleChangeDataLine(data);
        } catch (e) {
            console.log('error at handleChangeDataLine with error: ', e);
        }
    }

    handleSummaryAmount = (reimbursementDetail: any) => {
        try {
            let actualAmount = 0;
            const DataLineCopy = [...reimbursementDetail];
            DataLineCopy.forEach((item: any, index: number) => {
                const amount = item.amount.toString();
                actualAmount += Number(amount.replace(/,/g, ''));
            });
            return actualAmount;
        } catch (e) {
            console.log('error at handleChangeInputModal with error: ', e);
        }
    }

    handleChangeInputModal = (dataLine: any) => {
        try {
            const DataLineCopy = [...dataLine];
            this.setState({ mapDataLineTemp: DataLineCopy });

        } catch (e) {
            console.log('error at handleChangeInputModal with error: ', e);
        }
    }
    handleSubmitModal = () => {
        try {
            const { mapDataLineTemp } = this.state;
            const copyData = [...mapDataLineTemp];

            this.props.onSubmitModal(copyData);
            this.hideSweetAlert();
        } catch (e) {
            console.log('error at handleSubmitModal with error: ', e);
        }
    }

    handleAddDataLine = () => {
        const {
            mapReimbursementDetail
        } = this.state;
        const templateData = { ...dataLineFormat };

        const copyDataLine = [...mapReimbursementDetail];
        copyDataLine.push(templateData);

        this.props.handleAddDataLine({ reimbursementDetail: copyDataLine });
    }
    handleDeleteDataLine = (index: number) => {
        const {
            mapReimbursement,
            mapReimbursementDetail,
        } = this.state;
        const copyReimbursementDetail = [...mapReimbursementDetail];
        const copyReimbursement = { ...mapReimbursement };
        if (copyReimbursementDetail.length > 1) {
            copyReimbursementDetail.splice(index, 1);
            copyReimbursement.actualAmount = this.handleSummaryAmount(copyReimbursementDetail);
        }
        const data = {
            reimbursement: copyReimbursement,
            reimbursementDetail: copyReimbursementDetail
        }
        this.props.handleChangeDataLine(data);
    }
    hideSweetAlert = () => {
        this.setState({ alert: null });
    }


    renderValue(option: any) {
        return <p style={{ color: option.color }}>{option.code}</p>;
    }
    render() {
        const {
            mapReimbursementDetail,
            mapReimbursement
        } = this.state;

        const {
            combobox,
            isApproval,
            isPosting,
        } = this.props;

        return (
            <Container className="container-line-tab">
                {this.state.alert}

                <Row className="row-line-tab">
                    <Col xs="12" md="12">
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col xs="12">
                                        <Table hover bordered striped responsive>
                                            <thead>
                                                <tr>
                                                    <th className="data-line-th">No.</th>
                                                    <th className="data-line-th width-100">Transaction</th>
                                                    <th className="data-line-th min-width-220">Description</th>
                                                    <th className="data-line-th min-width-150">Amount</th>
                                                    {
                                                        !isApproval && !isPosting &&
                                                        <th className="data-line-th">Action</th>
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    mapReimbursementDetail.map((item: any, index: number) => {
                                                        const order = index;
                                                        const {
                                                            transactionId,
                                                            amount,
                                                            description,
                                                        } = item;

                                                        return (
                                                            <tr key={order}>
                                                                <td className="data-line-td">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="data-line-td">
                                                                    <Input
                                                                        type="select"
                                                                        name="transactionId"
                                                                        className="font-size-13"
                                                                        onChange={e => this.handleChangeDataLine(e, index)}
                                                                        value={transactionId}
                                                                        disabled={isApproval || isPosting}
                                                                    >
                                                                        {
                                                                            combobox && combobox.transactions.map((item: any, index: number) => {
                                                                                const { id, codeName } = item;
                                                                                return (
                                                                                    <option value={id} className="font-size-13" key={index}>{codeName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </Input>
                                                                    {/* <Select
                                                                        valueRenderer={this.renderValue}
                                                                        value={transactionId}
                                                                        className="text-align-left"
                                                                        // disabled={isViewTransDetailMode}
                                                                        clearable={false}
                                                                        onChange={(e: any) => this.handleChangeDataLine(e, index)}
                                                                        options={combobox.transactions.map((transaction: any) => ({ value: transaction.id, label: transaction.codeName, code: transaction.code }))}
                                                                        name="transactionId"
                                                                    /> */}
                                                                </td>
                                                                <td className="data-line-td">
                                                                    <Input
                                                                        type="text"
                                                                        name="description"
                                                                        value={description || ''}
                                                                        onChange={(e: any) => this.handleChangeDataLine(e, index)}
                                                                        placeholder="Description"

                                                                        disabled={isApproval || isPosting}
                                                                        className="height-30"
                                                                        maxLength={300}
                                                                    />
                                                                </td>
                                                                <td className="data-line-td">
                                                                    <NumberFormat
                                                                        placeholder="Amount"
                                                                        name="amount"
                                                                        thousandSeparator={true}
                                                                        decimalSeparator="."
                                                                        decimalScale={4}
                                                                        value={amount || ''}
                                                                        disabled={isApproval || isPosting}
                                                                        // allowNegative={(isCorrection || parseFloat(enteredDebit) < 0) ? true : false}
                                                                        onChange={(e: any) => this.handleChangeDataLine(e, index)}
                                                                        className="input-number-format" />
                                                                </td>
                                                                {
                                                                    !isApproval && !isPosting &&
                                                                    <td className="data-line-td">
                                                                        <Label className="data-line-del-label"
                                                                            onClick={() => this.handleDeleteDataLine(index)}
                                                                        >
                                                                            <i className="icon-trash" />
                                                                        </Label>
                                                                        
                                                                    </td>
                                                                }

                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" lg="6">
                                        {
                                            (!isApproval && !isPosting) &&
                                            <Button
                                                type="button"
                                                color="primary"
                                                onClick={() => this.handleAddDataLine()}
                                                className="color-white"
                                            // disabled={isViewTransDetailMode}
                                            >
                                                <i className="icon-plus" />&nbsp;
                                                Add
                                        </Button>
                                        }
                                    </Col>
                                    <Col md="6" lg="6">
                                        <Row>
                                            <Col md="4" >
                                                <Label className="font-size-16"><b>Total:</b></Label>
                                            </Col>
                                            <Col md="8" className="text-align-right font-size-16">
                                                <label>
                                                    <b>
                                                        {thousandSeparator(mapReimbursement && mapReimbursement.actualAmount)}
                                                    </b>
                                                </label>

                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {
                                    !isApproval &&
                                    <Row className="mar-top-5">
                                        <Col xs="12">
                                            <Label className="mark-required">*&#41; At least one transaction must be filled before save the transaction</Label>
                                        </Col>
                                    </Row>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default DataLineTab;
