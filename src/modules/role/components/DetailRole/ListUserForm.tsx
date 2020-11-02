import React, { Component } from 'react';
import {
    Row,
    Col, Button, Table, Card, Container, CardBody,
} from 'reactstrap';
import ModalUserForm from './ModalUserForm';

class ListUserForm extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            mapUserList: [],
            mapUserListModal: [],
            mapUserListCurrent: [],
            alert: null,
            modal: false,
        }
    }

    static getDerivedStateFromProps = (props: any, state: any) => {
        return {
            mapUserList: props.userList,
            mapUserListCurrent: props.userListCurrent,
            mapUserListModal: props.userListModal,
        }
    }
  

    handleDeleteDataLine = (index: number) => {
        const {
            mapUserListCurrent,
        } = this.state;
        const copymapUserListCurrent = [...mapUserListCurrent];
        copymapUserListCurrent.splice(index, 1);
        this.props.handleDeleteDataLine(copymapUserListCurrent);
    }
    hideSweetAlert = () => {
        this.setState({ alert: null });
    }
    toggleModal() {
        this.setState({
            modal: !this.state.modal,
        });
    }
    handleChangeModalField = (e: any) => {
        try {

            this.props.handleChangeModalField({ userListModal: e.mapUserListModal });

        } catch (e) {
            console.log(`error at handleChangeModalField for ${e.target.name} with error: `, e);
        }
    }
    handleSelectedUser = () => {
        try {
            const {
                mapUserListModal,
                mapUserListCurrent,
            } = this.state;
            let copyUserListCurrent = [...mapUserListCurrent];
            const copyUserListModal = [...mapUserListModal];
            const dataSelect = copyUserListModal.filter((obj: any) => obj.isChecked === true);

            dataSelect.forEach((item: any) => {
                if(!copyUserListCurrent.find((obj: any) => obj.userId === item.userId))
                {
                let data = {};
                data = {
                    userId: item.userName,
                    fullName: item.fullName,
                    createdBy: item.createdBy,
                    createdDate: item.createdDate,
                    lastUpdatedBy: item.lastUpdatedBy,
                    lastUpdatedDate: item.lastUpdatedBy,
                    activeFlag: true
                }

                copyUserListCurrent.push(data);
                }
            });
            this.toggleModal();
            this.props.handleSelectedUser({ userListCurrent: copyUserListCurrent });

        } catch (e) {
            console.log(`error at handleChangeModalField for ${e.target.name} with error: `, e);
        }
    }
    
    renderValue(option: any) {
        return <p style={{ color: option.color }}>{option.code}</p>;
    }
    render() {
        const {
            mapUserList,
            mapUserListCurrent,
            mapUserListModal,
            modal
        } = this.state;
        return (
            <Container className="container-line-tab">
                {this.state.alert}

                <Row className="row-line-tab">
                    <Col xs="12" md="12">
                        <Card>
                            <CardBody>
                                
                                <ModalUserForm
                                    modal={modal}
                                    mapUserList={mapUserList}
                                    mapUserListCurrent={mapUserListCurrent}
                                    mapUserListModal={mapUserListModal}
                                    selectedUser={() => this.handleSelectedUser()}
                                    handleChangeModalField={(e: any) => this.handleChangeModalField(e)}
                                    toggleModal={() => this.toggleModal()} />

                                <Row>
                                    <Table hover bordered striped responsive>
                                        <thead>
                                            <tr>
                                                <th className="data-line-th">No.</th>
                                                <th className="data-line-th width-100">User Id</th>
                                                <th className="data-line-th min-width-220">Full Name</th>
                                                <th className="data-line-th">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mapUserListCurrent && mapUserListCurrent.length ?
                                                mapUserListCurrent.map((item: any, index: number) =>
                                                    <tr className="tableodd" key={index + 1}
                                                    >
                                                        <td className="list-table text-align-center">{index + 1}</td>

                                                        <td className="list-table">{item.userId}</td>
                                                        <td className="list-table">{item.fullName}</td>
                                                        <td className="list-table text-align-center">

                                                            <Button
                                                            type="button"
                                                            color="danger"
                                                            className="button-action-list"
                                                            onClick={() => this.handleDeleteDataLine(index)}
                                                            >
                                                            <i className="icon-trash" /> &nbsp;
                                                            
                                                            </Button>
                                                        </td>

                                                    </tr>
                                                ) :
                                                <tr>
                                                    <td colSpan={18} className="text-align-center"> Data Not Found</td>
                                                    {/* <td>Not Found</td> */}

                                                </tr>}


                                        </tbody>
                                    </Table>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ListUserForm;
