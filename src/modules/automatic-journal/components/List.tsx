import React, { Component } from 'react';
import { Col, Row, Table } from 'reactstrap';
import { initialPage } from '../config/ConstantsJournal';
import Moment from 'moment';

import { postingStateList } from '../config/ConstantsJournal';

class List extends Component<any, any> {
    handleOpenView = (headerId: string) => {
        try {
            this.props.history.push(`/automatic-journal/detail/${headerId}`);
        } catch (e) {
            console.log('error at handleOpenCreate with error: ', e);
        }
    }

    handleOrderBy = (order: string) => {
        try {
            const { pager } = this.props;
            const copyPager = { ...pager };
            let direction = initialPage.direction;
            if (copyPager && copyPager.direction && copyPager.orderBy) {
                if (copyPager.orderBy === order) {
                    if (copyPager.direction === initialPage.direction) {
                        direction = "ASC";
                    } else {
                        direction = "DESC";
                    }
                } else {
                    direction = "ASC";
                }
            }
            copyPager['direction'] = direction;
            copyPager['orderBy'] = order;
            copyPager['currentPage'] = 1;
            this.props.onChangeOrderBy(copyPager);
        } catch (e) {
            console.log('error at handleOrderBy with error: ', e);
        }
    }

    render() {
        var nf = new Intl.NumberFormat();
        const { journals, pager } = this.props;
        const iconDirection =
            pager && pager.direction === "DESC"
                ? <i className="fa fa-sort-asc"></i>
                : <i className="fa fa-sort-desc"></i>;

        return (
            <Row>
                <Col xs="12">
                    <Table hover bordered responsive size="sm" className="bgc-white" >
                        <thead>
                            <tr>
                                <th className="summary-th vertical-align-middle-imp">No</th>
                                <th
                                    className="summary-th cursor-pointer min-width-170 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("headerCode")}
                                >
                                    Code&nbsp;&nbsp;
                                    {pager.orderBy === "headerCode" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-200 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("transactionCategoryName")}
                                >
                                    Transaction Category&nbsp;&nbsp;
                                    {pager.orderBy === "transactionCategoryName" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-200 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("transactionSubCategoryName")}
                                >
                                    Transaction Sub Category&nbsp;&nbsp;
                                    {pager.orderBy === "transactionSubCategoryName" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-100 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("accountingDate")}
                                >
                                    Accounting Date&nbsp;&nbsp;
                                    {pager.orderBy === "accountingDate" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-120 max-width-200 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("description")}
                                >
                                    Description&nbsp;&nbsp;
                                    {pager.orderBy === "description" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-100 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("postingState")}
                                >
                                    Posting State&nbsp;&nbsp;
                                    {pager.orderBy === "postingState" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-100 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("actualEnteredAmount")}
                                >
                                    Amount&nbsp;&nbsp;
                                    {pager.orderBy === "actualEnteredAmount" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-120 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("organizationName")}
                                >
                                    Organization&nbsp;&nbsp;
                                    {pager.orderBy === "organizationName" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-140 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("productName")}
                                >
                                    Product&nbsp;&nbsp;
                                    {pager.orderBy === "productName" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-140 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("projectName")}
                                >
                                    Project&nbsp;&nbsp;
                                    {pager.orderBy === "projectName" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-140 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("costCenterName")}
                                >
                                    Cost Center&nbsp;&nbsp;
                                    {pager.orderBy === "costCenterName" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-100 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("customerName")}
                                >
                                    Customer&nbsp;&nbsp;
                                    {pager.orderBy === "customerName" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-100 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("createdBy")}
                                >
                                    Created By&nbsp;&nbsp;
                                    {pager.orderBy === "createdBy" ? iconDirection : ""}
                                </th>
                                <th
                                    className="summary-th cursor-pointer min-width-170 vertical-align-middle-imp"
                                    onClick={() => this.handleOrderBy("createdDate")}
                                >
                                    Created Date&nbsp;&nbsp;
                                    {pager.orderBy === "createdDate" ? iconDirection : ""}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                journals && journals.content && journals.content.length
                                    ? journals.content.map((journal: any, key: number) =>
                                        <tr
                                            className="tableodd cursor-pointer"
                                            key={key}
                                            onClick={() => this.handleOpenView(journal.headerId)}
                                        >
                                            <td className="text-align-center">{key + (journals.page * journals.pageSize + 1)}.</td>
                                            <td>{journal.headerCode}</td>
                                            <td>{journal.transactionCategoryName}</td>
                                            <td>{journal.transactionSubCategoryName}</td>
                                            <td className="text-align-center">{journal.accountingDate ? Moment(journal.accountingDate).format("DD-MMM-YYYY") : ""}</td>
                                            <td>{journal.description}</td>
                                            <td className="text-align-center">{postingStateList[journal.postingState]}</td>
                                            <td className="text-align-right">{nf.format(journal.actualEnteredAmount)}</td>
                                            <td>{journal.organizationName}</td>
                                            <td>{journal.productName}</td>
                                            <td>{journal.projectName}</td>
                                            <td>{journal.costCenterName}</td>
                                            <td>{journal.customerName}</td>
                                            <td>{journal.createdBy}</td>
                                            <td className="text-align-center">{journal.createdDate ? Moment(journal.createdDate).format("DD-MMM-YYYY (HH:mm:ss)") : ""}</td>
                                        </tr>
                                    )
                                    : <tr>
                                        <td colSpan={15} className="text-align-center"> Data Not Found</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
    }
}

export default List;
