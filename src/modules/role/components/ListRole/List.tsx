import React, { Component } from 'react';
import {
    Col, Row, Table, Button
} from 'reactstrap';
import Moment from 'moment';
import { ActionButtonList } from '../../config/Constants';

// import base64NoImage from '../../../config/NoImage';

class List extends Component<any, any> {
    handleOpenView = (roleDataId: string, action: string) => {
        try {
            if(action === ActionButtonList.User)
            {
                this.props.history.push(`/user/role/user/${roleDataId}`);
            }
            else if (action === ActionButtonList.Menu){
                this.props.history.push(`/user/role/menu/${roleDataId}`);
            }
            else
            {
                this.props.history.push(`/user/role/update/${roleDataId}`);
            }

           
            
        } catch (e) {
            console.log('error at handleOpenView with error: ', e);
        }
    }
    confirmRemove = (masterDataId: string) => {
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
          
          this.props.setSweetAlert(param, masterDataId);
          
        } catch (e) {
          console.log('error at confirmRemoveTransaction with error: ', e);
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
                                    onClick={() => this.props.onChangeOrderBy("roleId")}>Role Id&nbsp;&nbsp;
                                    {request.orderBy === "roleId" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("roleName")}>Role Name&nbsp;&nbsp;
                                    {request.orderBy === "roleName" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("createdBy")}>Created By&nbsp;&nbsp;
                                    {request.orderBy === "createdBy" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer"
                                    onClick={() => this.props.onChangeOrderBy("createdDate")}>Created Date&nbsp;&nbsp;
                                    {request.orderBy === "createdDate" ? iconDirection : ""}</th>
                                <th className="th-center-middle-pointer">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {itemslist && itemslist.content && itemslist.content.length ?
                                itemslist.content.map((roleData: any, key: number) =>
                                    <tr className="tableodd" key={key}
                                        // onClick={() => this.handleOpenView(roleData.id)}
                                        // style={{ cursor: "pointer", }} 
                                         >
                                        <td className="list-table text-align-center">{key + (itemslist.page * itemslist.pageSize + 1)}.</td>

                                        <td className="list-table text-align-center">{roleData.roleId}</td>
                                        <td className="list-table text-align-center">{roleData.roleDesc}</td>
                                        <td className="list-table text-align-center">{roleData.createdBy}</td>
                                        <td className="list-table text-align-center">{roleData.createdDate ? Moment(roleData.createdDate).format("DD-MMM-YYYY") : ""}</td>
                                        <td className="list-table text-align-center">
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="button-action-list"
                                            onClick={() => this.handleOpenView(roleData.roleId, ActionButtonList.Edit)}
                                            >
                                            <i className="icon-pencil" /> &nbsp;
                                            
                                        </Button>
                                        &nbsp;
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="button-action-list"
                                            onClick={() => this.handleOpenView(roleData.roleId, ActionButtonList.User)}
                                            >
                                            <i className="icon-user" /> &nbsp;
                                            
                                        </Button>
                                        &nbsp;
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="button-action-list"
                                            onClick={() => this.handleOpenView(roleData.roleId, ActionButtonList.Menu)}
                                            >
                                            <i className="icon-puzzle" /> &nbsp;
                                            
                                        </Button>
                                        &nbsp;
                                        <Button
                                            type="button"
                                            color="danger"
                                            className="button-action-list"
                                            onClick={() => this.confirmRemove(roleData.roleId)}
                                            >
                                            <i className="icon-trash" /> &nbsp;
                                            
                                        </Button>
                                            
                                            </td>

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
