import React, { Component } from 'react';
import {
    Col, Row, Table
} from 'reactstrap';
import Moment from 'moment';

class List extends Component<any, any> {
    handleOpenView = (masterTypeId: string) => {
        try {
            this.props.history.push(`/master/master-type/${masterTypeId}`);
        } catch (e) {
            console.log('error at handleOpenView with error: ', e);
        }
    }
    render() {
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
                                    onClick={() => this.props.onChangeOrderBy("name")}>Name&nbsp;&nbsp;
                                    {request.orderBy === "name" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("description")}>Description&nbsp;&nbsp;
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
                            {itemslist && itemslist.content && itemslist.content.length ?
                                itemslist.content.map((masterType: any, key: number) =>
                                    <tr className="tableodd" key={key}
                                        onClick={() => this.handleOpenView(masterType.id)}
                                        style={{ cursor: "pointer", }}  >
                                        <td className="list-table text-align-center">{key + (itemslist.page * itemslist.pageSize + 1)}.</td>

                                        <td className="list-table text-align-center">{masterType.code}</td>
                                        <td className="list-table text-align-center">{masterType.name}</td>
                                        <td className="list-table text-align-center">{masterType.description}</td>
                                        <td className="list-table text-align-center">{masterType.createdBy}</td>
                                        <td className="list-table text-align-center">{masterType.createdDate ? Moment(masterType.createdDate).format("DD-MMM-YYYY") : ""}</td>

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
