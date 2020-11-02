import React, { Component } from 'react';
import {
    Row,
    Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

class ModalUserForm extends Component<any, any> {

    handleChangeModalField = (e: any, index_: number) => {
        try {
            const {
                mapUserListModal,
            } = this.props;
            const copyData = [...mapUserListModal];

            copyData.forEach((item: any, index: number) => {
                if (index === index_) {
                    item[e.target.name] = e.target.value === "true" ? false : true;
                }
            });
            this.props.handleChangeModalField({ mapUserListModal: copyData });
        } catch (e) {
            console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
        }
    }
    renderValue(option: any) {
        return <p style={{ color: option.color }}>{option.code}</p>;
    }

    render() {
        const {
            mapUserListModal,
            modal
        } = this.props;
        return (
            <Row  className="row-line-tab">

                <Button color="primary" onClick={this.props.toggleModal} className="mr-1">Add User</Button>

                <Modal isOpen={modal} toggle={this.props.toggleModal}
                    className='modal-primary modal-menu'>
                    <ModalHeader toggle={this.props.toggleModal}>Modal title</ModalHeader>
                    <ModalBody>
                        <Table hover bordered striped responsive>
                            <thead>
                                <tr>
                                    <th className="data-line-th min-width-60">No.</th>
                                    <th className="data-line-th"></th>
                                    <th className="data-line-th width-100">User Id</th>
                                    <th className="data-line-th min-width-220">full Name</th>

                                </tr>
                            </thead>
                            <tbody>
                                {mapUserListModal && mapUserListModal.length ?
                                    mapUserListModal.map((item: any, index: number) =>
                                        <tr className="tableodd" key={index}
                                        // onClick={() => this.handleOpenView(roleData.id)}
                                        // style={{ cursor: "pointer", }} 
                                        >
                                            <td className="list-table text-align-center">{index + 1}</td>
                                            <td className="list-table">
                                                <Input
                                                    type="checkbox"
                                                    id="isChecked"
                                                    name="isChecked"
                                                    className="checkbox-list"
                                                    value={item.isChecked}
                                                    onChange={e => this.handleChangeModalField(e, index)}
                                                />
                                            </td>
                                            <td className="list-table">{item.userName}</td>
                                            <td className="list-table">{item.fullName}</td>
                                        </tr>
                                    ) :
                                    <tr>
                                        <td colSpan={18} className="text-align-center"> Data Not Found</td>
                                    </tr>}
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.props.selectedUser}>Select</Button>{' '}
                        <Button color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Row>
        )
    }
}

export default ModalUserForm;
