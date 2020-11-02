import React, { Component } from 'react';
import {
    Col, Row, Table
} from 'reactstrap';
import Moment from 'moment';
import { statusName } from '../../../../config';
// import { stat } from 'fs';

// import base64NoImage from '../../config/NoImage';

class List extends Component<any, any> {
    handleOpenView = (reimbursementId: string) => {
        try {
            if (this.props.isApproval === true) {
                this.props.history.push(`/reimbursement/approval/detail/${reimbursementId}`);
            }
            else {
                this.props.history.push(`/reimbursement/transaction/update/${reimbursementId}`);
            }

        } catch (e) {
            console.log('error at handleOpenView with error: ', e);
        }
    }
    render() {
        var nf = new Intl.NumberFormat();
        const { itemslist, request } = this.props;
        console.log(request);
        const iconDirection = request && request.direction === "DESC" ? <i className="fa fa-sort-asc"></i> :
            <i className="fa fa-sort-desc"></i>;
        // const noImage =  `data:;base64,${base64NoImage}`;
        return (

            <Row>
                <Col xs="12">

                    {/* {items.error && <span className="text-danger">ERROR: {items.error}</span>} */}

                    <Table hover responsive size="sm" style={{ backgroundColor: "white" }} >
                        <thead>
                            <tr >
                                <th className="th-center-middle">No</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("code")}>Code&nbsp;&nbsp;
                                    {request.orderBy === "code" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("client")}>Client&nbsp;&nbsp;
                                    {request.orderBy === "code" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("project")}>Project&nbsp;&nbsp;
                                    {request.orderBy === "code" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("pic")}>PIC&nbsp;&nbsp;
                                    {request.orderBy === "code" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("description")}>Description&nbsp;&nbsp;
                                    {request.orderBy === "description" ? iconDirection : ""} </th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("Amount")}>Amount&nbsp;&nbsp;
                                    {request.orderBy === "description" ? iconDirection : ""} </th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("status")}>Status&nbsp;&nbsp;
                                    {request.orderBy === "description" ? iconDirection : ""} </th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("approved")}>Approved By&nbsp;&nbsp;
                                    {request.orderBy === "description" ? iconDirection : ""} </th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("rejected")}>Rejected By&nbsp;&nbsp;
                                    {request.orderBy === "description" ? iconDirection : ""} </th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("createdBy")}>Created By&nbsp;&nbsp;
                                    {request.orderBy === "createdBy" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("createdDate")}>Created Date&nbsp;&nbsp;
                                    {request.orderBy === "createdDate" ? iconDirection : ""}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {itemslist && itemslist.content && itemslist.content.length > 0 ?
                                itemslist.content.map((reimbursement: any, key: number) => {
                                    const status = statusName.find((obj: any) => obj.id === reimbursement.status);
                                    const statName = status === undefined ? 'open' : status.name;
                                    // console.log(status === undefined ? 'open' : status.name);
                                    return (
                                        <tr className="tableodd" key={key}
                                            onClick={() => this.handleOpenView(reimbursement.id)}
                                            style={{ cursor: "pointer", }}  >
                                            <td className="list-table text-align-center">{key + (itemslist.page * itemslist.pageSize + 1)}.</td>

                                            <td className="list-table text-align-center">{reimbursement.code}</td>
                                            <td className="list-table text-align-center">{reimbursement.clientName}</td>
                                            <td className="list-table text-align-center">{reimbursement.projectName}</td>
                                            <td className="list-table text-align-center">{reimbursement.picName}</td>
                                            <td className="list-table text-align-center">{reimbursement.description}</td>
                                            <td className="list-table text-align-center">{nf.format(reimbursement.actualAmount)}</td>
                                            <td className="list-table text-align-center">{statName}</td>
                                            <td className="list-table text-align-center">{reimbursement.approvedBy}</td>
                                            <td className="list-table text-align-center">{reimbursement.rejectedBy}</td>
                                            <td className="list-table text-align-center">{reimbursement.createdBy}</td>
                                            <td className="list-table text-align-center">{reimbursement.createdDate ? Moment(reimbursement.createdDate).format("DD-MMM-YYYY") : ""}</td>

                                        </tr>
                                    );

                                })
                                :
                                <tr>
                                    <td colSpan={18} className="text-align-center"> Data Not Found</td>
                                    {/* <td>Not Found</td> */}

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
