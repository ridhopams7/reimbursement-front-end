import React, { Component } from 'react';
import {
    Row, Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { Pagin } from '..';

class ModalMenuForm extends Component<any, any> {

    handleChangeModalField = (e: any, index_: number) => {
        try {
            const {
                mapMenuListModal,
            } = this.props;
            const copyData = [...mapMenuListModal];

            copyData.forEach((item: any, index: number) => {
                if (index === index_) {
                    item[e.target.name] = e.target.value === "true" ? false : true;
                }
            });
            this.props.handleChangeModalField({ mapMenuListModal: copyData });



        } catch (e) {
            console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
        }
    }

    handleChangePage = (page: number) => {
        try {
            this.props.onChangePage(page);
        } catch (e) {
            console.log('error at handleChangePage with error: ', e);
        }
    }

    renderValue(option: any) {
        return <p style={{ color: option.color }}>{option.code}</p>;
    }
    render() {
        const {
            mapPaging,
            // mapMenuCurrent,
            mapMenuListModal,
            modal
        } = this.props;
        return (
            <Row className="row-line-tab">

                <Button color="primary" onClick={this.props.toggleModal} className="mr-1">Add Menu</Button>

                <Modal isOpen={modal} toggle={this.props.toggleModal}
                    className='modal-primary modal-menu'>
                    <ModalHeader toggle={this.props.toggleModal}>Menu List</ModalHeader>
                    <ModalBody>
                        <Table hover bordered striped responsive>
                            <thead>
                                <tr>
                                    <th className="data-line-th min-width-40">No.</th>
                                    <th className="data-line-th"></th>
                                    <th className="data-line-th min-width-100">Menu Id</th>
                                    <th className="data-line-th min-width-220">Menu Desc</th>

                                </tr>
                            </thead>
                            <tbody>
                                {mapMenuListModal && mapMenuListModal.length ?
                                    mapMenuListModal.map((item: any, index: number) =>
                                        <tr className="tableodd" key={index}
                                        // onClick={() => this.handleOpenView(roleData.id)}
                                        // style={{ cursor: "pointer", }} 
                                        >
                                            <td className="list-table text-align-center">{index + (mapPaging.first)}</td>
                                            <td className="list-table text-align-center">
                                                <Input
                                                    type="checkbox"
                                                    id="isChecked"
                                                    name="isChecked"
                                                    className="checkbox-list"
                                                    value={item.isChecked}
                                                    onChange={e => this.handleChangeModalField(e, index)}
                                                />
                                            </td>
                                            <td className="list-table">{item.menuId}</td>
                                            <td className="list-table">{item.menuDesc}</td>

                                        </tr>
                                    ) :
                                    <tr>
                                        <td colSpan={18} className="text-align-center"> Data Not Found</td>
                                        {/* <td>Not Found</td> */}

                                    </tr>}
                            </tbody>
                        </Table>
                        <Pagin request={mapPaging}
                            onChangePage={this.handleChangePage} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.props.selectedMenu}>Select</Button>{' '}
                        <Button color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Row>
        )
    }
}

export default ModalMenuForm;
