import React, { Component } from 'react';
import {
    Row, Col,
    Label,
    Input,
    Container,
    // Nav,
    // NavItem,
    // TabContent,
    // NavLink,
    FormText,
} from 'reactstrap';
// import { default as NumberFormat } from 'react-number-format';
import SweetAlert from 'react-bootstrap-sweetalert';
import { connect } from 'react-redux';
// import { postingStateList, journalCategoryList } from '../../config/Constants';
import { HttpService } from '../../../../utilities';
import { RequiredMark } from '../../../../components';

import download from 'downloadjs';

class EvidenceForm extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            alert: null,
        };
    }

    handleBrowseEvidence = (e: any) => {
        if (e.keyCode === 32) {
            e.preventDefault();
            document.getElementById('browseEvidence')!.click();
        }
    }

    // handleDeleteEvidence = (index: number, action: string) => {
    //     const { isViewTransDetailMode,
    //     } = this.props;

    //     if (isViewTransDetailMode) {
    //         return;
    //     }

    //     this.props.handleChangeEvidence(index, action);
    // }

    returnSweetAlert = (param: any, onConfirm: any, onCancel: any) => {
        const {
            type, title,
            confirmBtnText, confirmBtnBsStyle,
            cancelBtnText, cancelBtnBsStyle,
            focusConfirmBtn,
            showConfirm, showCancel,
            message,
        } = param;

        // type='default' || 'info' || 'success' || 'warning' || 'danger' || 'custom'
        return (
            <SweetAlert
                type={type}
                title={title}
                confirmBtnText={confirmBtnText || 'Yes'}
                confirmBtnBsStyle={confirmBtnBsStyle || 'default'}
                cancelBtnText={cancelBtnText || 'Cancel'}
                cancelBtnBsStyle={cancelBtnBsStyle || 'default'}
                focusConfirmBtn={focusConfirmBtn}
                showConfirm={showConfirm}
                showCancel={showCancel}
                allowEscape
                closeOnClickOutside
                onConfirm={() => onConfirm()}
                onCancel={() => onCancel()}
            >
                {message}
            </SweetAlert>
        );
    }



    handleRequestImage = (id: string, fileName: string) => {
        try {

            const fileType = fileName.split('.')[1];

            let isFilePdf = false;
            if (fileType.includes('pdf')) {
                isFilePdf = true;
            }

            // const permission = resAuth.roles.find((obj: any) => obj.role === 'V_View');
            const headers = {
                Authorization: `Bearer ${this.props.resAuth.token}`,
                role: 'V_View',
                // permission: permission.permissions[0],
            };


            HttpService.get(`reimbursement-evidences/image/${id}`, null, headers)
                .then((response: any) => {
                    const src = response.data.message.src;
                    const isFileAvailable = response.data.message.isFileAvailable;
                    if (!isFilePdf) {
                        this.handleOpenImage(src, id, isFileAvailable);
                        return;
                    }

                    this.handleOpenPdf(isFileAvailable, id);
                })
                .catch((err: any) => {
                    console.log('error when load image with error: ', err);
                });
        } catch (e) {
            console.log('error at request image with error: ', e);
        }
    }

    handleDeleteEvidence = (index: number) => {
        const {
            isCreate,
            reimbursementEvidence,
        } = this.props;
        const copyReimbursementEvidence = { ...reimbursementEvidence };
        let copyEvidence = [...copyReimbursementEvidence.Evidence];
        let copyDeleteEvidence = [...copyReimbursementEvidence.DeleteEvidence];
        let copyNewEvidence = [...copyReimbursementEvidence.NewEvidence];
        copyEvidence.splice(index, 1);
     
        if (!isCreate) {
            console.log(isCreate)
            const isDeletedFileANewImage = reimbursementEvidence.Evidence[index].name; // .name means new image
            if (!isDeletedFileANewImage) {
                const copyListDeletedEvidence = [...copyDeleteEvidence, reimbursementEvidence.Evidence[index]];
                // copyEvidence = copyReimbursementEvidence;
                copyDeleteEvidence = copyListDeletedEvidence;

                copyReimbursementEvidence.Evidence = copyEvidence;
                copyReimbursementEvidence.DeleteEvidence = copyDeleteEvidence;
                const data = {
                    reimbursementEvidence: copyReimbursementEvidence,
                    flagChange: true
                }
                this.props.handleChangeEvidence(data);
                // this.props.setState({ copyEvidence: copyReimbursementEvidence, flagChange: true, listDeletedEvidence: copyListDeletedEvidence });
                return;
            }
            else {
                // console.log(copyNewEvidence[index].name,"test");
                // console.log(copyEvidence[index].name,"test");
                const findIndex = copyNewEvidence.findIndex((obj: any) => obj.name === copyEvidence[index].name);
                const copyListCreatedEvidence = [...reimbursementEvidence];
                copyListCreatedEvidence.splice(findIndex, 1);
                copyReimbursementEvidence.NewEvidence = copyListCreatedEvidence;
                const data = {
                    reimbursementEvidence: copyReimbursementEvidence,
                    flagChange: true
                }
                this.props.handleChangeEvidence(data);
                return;
                // this.setState({ listEvidence: copyReimbursementEvidence, flagChange: true, listCreatedEvidence: copyListCreatedEvidence });
            }

        }
        copyReimbursementEvidence.Evidence = copyEvidence;
        const data = {
            reimbursementEvidence: copyReimbursementEvidence,
            flagChange: true
        }
        this.props.handleChangeEvidence(data);
    }

    handleAddEvidence = (e: any) => {
        const {
            isCreate,
            reimbursementEvidence,
        } = this.props;
        const copyEvidence = { ...reimbursementEvidence };
        const copyReimbursementNewEvidence = [...copyEvidence.NewEvidence, ...Array.from(e.target.files)];
        const copyReimbursementEvidence: Array<any> = [...copyEvidence.Evidence, ...Array.from(e.target.files)];
        copyEvidence.Evidence = copyReimbursementEvidence;
        
        if (!isCreate) {
            copyEvidence.NewEvidence = copyReimbursementNewEvidence;
        }

        const data = {
            reimbursementEvidence: copyEvidence,
            flagChange: true
        }
        this.props.handleChangeEvidence(data);
    }

    handleOpenPdf = (isFileAvailable: boolean, id: string) => {
        try {
            if (isFileAvailable) {
                this.handleDownloadImage(id);
                return;
            }

            const message = 'File is not available. Please contact your admin for more information';

            const param = {
                type: 'error',
                confirmBtnBsStyle: 'primary',
                confirmBtnText: 'Close',
                title: 'Sorry',
                showCancel: false,
                message,
                focusConfirmBtn: false,
            };

            const onConfirm = () => { this.handleHideImage(); };
            const onCancel = () => { this.handleHideImage(); };

            this.setState({
                alert: this.returnSweetAlert(param, onConfirm, onCancel),
            });
        } catch (e) {
            console.log('error at handleOpenPdf with error: ', e);
        }
    }

    handleOpenImage = (source: string, id: string, isImageAvailable: boolean) => {
        try {
            console.log(source);
            const message = <div className="image-view-container">
                <img
                    src={source}
                    alt="img"
                    className="width-100-percent"
                />
            </div>;
            const param = {
                type: 'default',
                confirmBtnBsStyle: 'primary',
                confirmBtnText: 'Download',
                title: '',
                showConfirm: isImageAvailable,
                showCancel: true,
                cancelBtnBsStyle: 'default',
                cancelBtnText: 'Close',
                message,
                focusConfirmBtn: false,
            };

            const onConfirm = () => { this.handleDownloadImage(id); };
            const onCancel = () => { this.handleHideImage() };

            this.setState({
                alert: this.returnSweetAlert(param, onConfirm, onCancel),
            });
        } catch (e) {
            console.log('error at handleOpenImage with error: ', e);
        }
    }

    handleHideImage = () => {
        this.setState({ alert: null });
    }

    handleDownloadImage = (id: string) => {

        // const permission = this.props.resAuth.roles.find((obj: any) => obj.role === 'V_View');
        const headers = {
            Authorization: `Bearer ${this.props.resAuth.token}`,
            role: 'V_View',
            // permission: permission.permissions[0],
        };
        HttpService.get(`reimbursement-evidences/image/${id}/download`, null, headers)
            .then((res: any) => {
                console.log(res);
                const contentType = res.headers['content-type'];
                const fileName = (res.headers['content-disposition']).split('= ')[1];
                download(res.data.src, fileName, contentType);
            })
            .catch((err: any) => {
                console.log('err: ', err);
            });
    }
    render() {
        const {
            reimbursementEvidence,
            isApproval,
            isPosting,
        } = this.props;

        return (
            <Container className="container-header">
                {this.state.alert}
                <Container className="container-header-evidence">
                    <Row className="row-header center mar-bot-15">
                        <Col md="2" lg="2" className="align-self-flex-start">
                            <Label className="font-size-13">
                                Evidence
                                <RequiredMark />
                                <FormText>Max. 10 MB (PDF/Image)</FormText>
                            </Label>
                        </Col>
                        {
                            !isApproval && !isPosting &&

                            <Col md="1" lg="1" className="align-self-flex-start">
                                <Label
                                    for="browseEvidence"
                                    style={{
                                        border: '1px solid #20A8D8',
                                        // isViewTransDetailMode ? '1px solid #cccccc' :
                                        borderRadius: 5,
                                        backgroundColor: '#20A8D8',
                                        // isViewTransDetailMode ? '#cccccc' :
                                        padding: '1px 12px',
                                        cursor: 'pointer',
                                        color: 'white',
                                    }}
                                    className="no-select"
                                    tabIndex={0}
                                    role="button"
                                    onKeyDown={e => this.handleBrowseEvidence(e)}
                                >Browse
                            </Label>
                                <Input
                                    type="file"
                                    style={{
                                        display: 'none',
                                        //   opacity: isViewTransDetailMode ? 0.65 : 1,
                                    }}
                                    id="browseEvidence"
                                    onChange={(e: any) => this.handleAddEvidence(e)}
                                    multiple
                                    accept=".jpg,.png,.jpeg,.pdf"
                                // disabled={isViewTransDetailMode}
                                />
                            </Col>
                        }
                        <Col md="9" lg="9" className="align-self-flex-start">
                            <Row>
                                {
                                    reimbursementEvidence && reimbursementEvidence.Evidence.map((item: any, index: number) => {
                                        const imageName = item.fileName ? item.fileName : item.name;
                                        const name = imageName.length > 30 ? `${imageName.slice(0, 29)}...` : imageName;
                                        return (
                                            <Col md="6" lg="6" key={index}>
                                                {
                                                    item.originalName && (
                                                        <span
                                                            onClick={() => this.handleRequestImage(item.id, imageName)}
                                                            className="cursor-pointer"
                                                        >
                                                            {item.originalName}
                                                        </span>
                                                    )
                                                }
                                                {
                                                    item.name && (
                                                        <span>
                                                            {name}
                                                        </span>
                                                    )
                                                }
                                                <i className="icon-close" onClick={() => this.handleDeleteEvidence(index)} />

                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({
    resAuth: state.auth.res,
});

export default connect(mapStateToProps, null)(EvidenceForm);
