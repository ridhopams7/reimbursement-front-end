import React, { Component } from 'react';
import {
    Col, Row, Table
} from 'reactstrap';
import Moment from 'moment';

import { postingStateList } from '../../config/Constants';

class List extends Component<any, any> {
    handleOpenView = (headerId: string) => {
        try {
            this.props.history.push(`/voucher/detail/${headerId}`);
        } catch (e) {
            console.log('error at handleOpenCreate with error: ', e);
        }
    }
    render() {
        var nf = new Intl.NumberFormat();
        const { itemslist, request } = this.props;
        const iconDirection = request && request.direction === "DESC" ? <i className="fa fa-sort-asc"></i> :
            <i className="fa fa-sort-desc"></i>;

        return (
            <Row>
                <Col xs="12">

                    {/* {items.error && <span className="text-danger">ERROR: {items.error}</span>} */}

                    <Table hover bordered responsive size="sm" style={{ backgroundColor: "white" }} >
                        <thead>
                            <tr >
                                <th className="th-center-middle min-width-40">No</th>
                                <th className="th-center-middle-pointer min-width-170" 
                                    onClick={() => this.props.onChangeOrderBy("headerCode")}>Code&nbsp;&nbsp;
                                        {request.orderBy === "headerCode" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("accountingPeriod")}>Accounting Period&nbsp;&nbsp;
                                        {request.orderBy === "accountingPeriod" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("accountingDate")}>Accounting Date&nbsp;&nbsp;
                                        {request.orderBy === "accountingDate" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-200 max-width-400" 
                                    onClick={() => this.props.onChangeOrderBy("description")}>Description&nbsp;&nbsp;
                                        {request.orderBy === "description" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("postingState")}>Posting State&nbsp;&nbsp;
                                        {request.orderBy === "postingState" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("journalCategory")}>Journal Category&nbsp;&nbsp;
                                        {request.orderBy === "journalCategory" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("actualAccountedDr")}>Actual Debit&nbsp;&nbsp;
                                        {request.orderBy === "actualAccountedDr" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("actualAccountedCr")}>Actual Credit&nbsp;&nbsp;
                                        {request.orderBy === "actualAccountedCr" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("budgetAccountedDr")}>Budget Debit&nbsp;&nbsp;
                                        {request.orderBy === "budgetAccountedDr" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("budgetAccountedCr")}>Budget Credit&nbsp;&nbsp;
                                        {request.orderBy === "budgetAccountedCr" ? iconDirection : ""}</th>
                                <th style={{ minWidth: 50 }} className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("organizationCode")}>Organization&nbsp;&nbsp;
                                        {request.orderBy === "organizationCode" ? iconDirection : ""}</th>
                                <th style={{ minWidth: 50 }} className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("productCode")}>Product&nbsp;&nbsp;
                                        {request.orderBy === "productCode" ? iconDirection : ""}</th>
                                <th style={{ minWidth: 50 }} className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("projectCode")}>Project&nbsp;&nbsp;
                                        {request.orderBy === "projectCode" ? iconDirection : ""}</th>
                                <th style={{ minWidth: 80 }} className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("costCenterCode")}>Cost Center&nbsp;&nbsp;
                                        {request.orderBy === "costCenterCode" ? iconDirection : ""}</th>
                                <th style={{ minWidth: 50 }} className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("customerCode")}>Customer&nbsp;&nbsp;
                                        {request.orderBy === "customerCode" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-100" 
                                    onClick={() => this.props.onChangeOrderBy("createdBy")}>Created By&nbsp;&nbsp;
                                        {request.orderBy === "createdBy" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer min-width-170" 
                                    onClick={() => this.props.onChangeOrderBy("createdDate")} >Created Date&nbsp;&nbsp;
                                        {request.orderBy === "createdDate" ? iconDirection : ""}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemslist && itemslist.content && itemslist.content.length ?
                                itemslist.content.map((voucher: any, key: number) =>
                                    <tr className="tableodd" key={key}
                                        onClick={() => this.handleOpenView(voucher.headerId)}
                                        style={{ cursor: "pointer", }}  >
                                        <td className="text-align-center">{key + (itemslist.page * itemslist.pageSize + 1)}.</td>
                                        <td>{voucher.headerCode}</td>
                                        <td className="text-align-center">{voucher.accountingPeriodCode}</td>
                                        <td className="text-align-center">{voucher.accountingDate ? Moment(voucher.accountingDate).format("DD-MMM-YYYY") : ""}</td>
                                        <td>{voucher.description}</td>
                                        <td className="text-align-center">{postingStateList[voucher.postingState]}</td>
                                        <td className="text-align-center">{voucher.journalCategory}</td>
                                        <td className="text-align-right">{nf.format(voucher.actualAccountedDr)}</td>
                                        <td className="text-align-right">{nf.format(voucher.actualAccountedCr)}</td>
                                        <td className="text-align-right">{nf.format(voucher.budgetAccountedDr)}</td>
                                        <td className="text-align-right">{nf.format(voucher.budgetAccountedCr)}</td>
                                        <td>{voucher.organizationCode}</td>
                                        <td>{voucher.productCode}</td>
                                        <td>{voucher.projectCode}</td>
                                        <td>{voucher.costCenterCode}</td>
                                        <td>{voucher.customerCode}</td>
                                        <td>{voucher.createdBy}</td>
                                        <td className="text-align-center">{voucher.createdDate ? Moment(voucher.createdDate).format("DD-MMM-YYYY (HH:mm:ss)") : ""}</td>

                                    </tr>
                                ) : <tr>
                                    <td colSpan={18} className="text-align-center"> Data Not Found</td>
                                    {/* <td>Not Found</td> */}

                                </tr>}

                        </tbody>
                    </Table>


                </Col>
            </Row>

        );
    }
}

export default List;
