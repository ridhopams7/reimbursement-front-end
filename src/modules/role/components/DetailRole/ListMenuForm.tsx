import React, { Component } from 'react';
import {
    Row,
    Col, Button, Table,  Card, Container, CardBody,
} from 'reactstrap';
import ModalMenuForm from './ModalMenuForm';

class ListMenuForm extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            mapMenuList: [],
            mapMenuListModal: [],
            mapMenuListCurrent: [],
            mapMenuPaging:{},
            alert: null,
            modal: false,
        }
    }

    static getDerivedStateFromProps = (props: any, state: any) => {
        return {
            mapMenuList: props.menuList,
            mapMenuListCurrent: props.menuListCurrent,
            mapMenuListModal: props.menuListModal,
            mapMenuPaging: props.menuPaging,
        }
    }
  

    handleDeleteDataLine = (index: number) => {
        const {
            mapMenuListCurrent,
        } = this.state;
        const copymapMenuListCurrent = [...mapMenuListCurrent];
        copymapMenuListCurrent.splice(index, 1);
        this.props.handleDeleteDataLine(copymapMenuListCurrent);
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
            this.props.handleChangeModalField({ menuListModal: e.mapMenuListModal });
        } catch (e) {
            console.log(`error at handleChangeModalField for ${e.target.name} with error: `, e);
        }
    }
    handleSelectedMenu = () => {
        try {
            const {
                mapMenuListModal,
                mapMenuListCurrent,
            } = this.state;
            let copyMenuListCurrent = [...mapMenuListCurrent];
            const copyMenuListModal = [...mapMenuListModal];
            const dataSelect = copyMenuListModal.filter((obj: any) => obj.isChecked === true);

            dataSelect.forEach((item: any) => {
                if(!copyMenuListCurrent.find((obj: any) => obj.menuId === item.menuId))
                {
                let data = {};
                data = {
                    menuId: item.menuId,
                    menuDesc: item.menuDesc,
                    createdBy: item.createdBy,
                    createdDate: item.createdDate,
                    lastUpdatedBy: item.lastUpdatedBy,
                    lastUpdatedDate: item.lastUpdatedBy,
                    activeFlag: true
                }

                copyMenuListCurrent.push(data);
                }
            });
            this.toggleModal();
            this.props.handleSelectedMenu({ menuListCurrent: copyMenuListCurrent });

        } catch (e) {
            console.log(`error at handleChangeModalField for ${e.target.name} with error: `, e);
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
            mapMenuList,
            mapMenuListCurrent,
            mapMenuListModal,
            mapMenuPaging,
            modal
        } = this.state;
        return (
            <Container className="container-line-tab">
                {this.state.alert}

                <Row className="row-line-tab">
                    <Col xs="12" md="12">
                        <Card>
                            <CardBody>
                                <ModalMenuForm
                                    modal={modal}
                                    mapMenuList={mapMenuList}
                                    mapPaging={mapMenuPaging}
                                    mapMenuListCurrent={mapMenuListCurrent}
                                    mapMenuListModal={mapMenuListModal}
                                    onChangePage={this.handleChangePage}
                                    selectedMenu={() => this.handleSelectedMenu()}
                                    handleChangeModalField={(e: any) => this.handleChangeModalField(e)}
                                    toggleModal={() => this.toggleModal()} />
                                <Row>
                                    <Table hover bordered striped responsive>
                                        <thead>
                                            <tr>
                                                <th className="data-line-th">No.</th>
                                                <th className="data-line-th width-100">Menu Id</th>
                                                <th className="data-line-th min-width-220">Menu Desc</th>
                                                <th className="data-line-th">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mapMenuListCurrent && mapMenuListCurrent.length ?
                                                mapMenuListCurrent.map((item: any, index: number) =>
                                                    <tr className="tableodd" key={index + 1}
                                                    >
                                                        <td className="list-table text-align-center">{index + 1}</td>
                                                        <td className="list-table">{item.menuId}</td>
                                                        <td className="list-table">{item.menuDesc}</td>
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

export default ListMenuForm;
