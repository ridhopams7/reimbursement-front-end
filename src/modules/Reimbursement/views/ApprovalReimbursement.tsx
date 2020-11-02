import React, { Component, Fragment } from 'react';
import {
    Row,
    Col,
    Label,
    Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { reimbursementApprovalRole } from '../../../config';
import { SweetAlert } from '../../../components';
import { HttpService, handleRedirectUser } from '../../../utilities';
import {
    messageAction,
    cekDataApi,
} from '../action/Lib';
import { HeaderForm, ActionForm, EvidenceForm, DataLineForm, } from '../components';
import {
    ActionAlert,
    defaultReimbursement,
    defaultCombobox,
    dataLineFormat,
    // saveFormat,
    defaultEvidence,
    MasterTypeTransactionId,
    MasterTypeProjectId,
    MasterTypeClientId,
} from '../config/Constants';
import { approvalId } from '../../../config';
import { masterDetailByType, accountingPeriods, masterUserbyRole } from '../../../utilities/Master';
// import { stat } from 'fs';


class ApprovalReimbursement extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            reimbursementId: '',
            reimbursement: { ...defaultReimbursement },
            reimbursementDetail: [{ ...dataLineFormat }],
            reimbursementEvidence: { ...defaultEvidence },
            combobox: { ...defaultCombobox },
            flagChange: false,
            isAlert: false,
            alertMessage: '',
            sweetAlert: null,
            headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
        };
    }

    componentDidMount = async () => {
        try {

            const reimbursementId = this.props.match.params ? this.props.match.params.id : '';
            console.log(reimbursementId, "test");
            const { headers } = this.state;
            let menu = reimbursementApprovalRole.Reimbursement_Approval_Approved;
            let permission = null;
            permission = this.props.resAuth.menus.find((obj: any) => obj.menu === menu);
            console.log(this.props.match.params);
            if (!permission) {
                const message = "Unauthorized";
                this.handleKickPermission(message);
                return;
            }
            const headers_ = {
                ...headers,
                role: menu,
                // menu: 
                // permission: permission.permissions[0],
            }

            this.setState({ headers: headers_, reimbursementId }, () => {
                this.initialLoadDetailTransaction();
            });
        } catch (e) {
            console.log('error at didmount with error: ', e);
        }
    }

    hideSweetAlert = () => {
        this.setState({
            sweetAlert: null,
        });
    }

    setSweetAlert = (param: any, action: string) => {
        let onConfirm = null;
        if (action === ActionAlert.Close) {
            onConfirm = () => {
                this.props.history.push("/reimbursement/transaction");
            };
        }
        else {
            onConfirm = () => { this.handleApprovedRejectedTransaction(action) };
        }

        const onCancel = () => { this.hideSweetAlert() };

        this.setState({
            sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
        });
    }

    handleKickPermission = (message: string) => {
        const { resAuth } = this.props;
        const data = handleRedirectUser(resAuth);
        const { param, url } = data;
        const copyParam = { ...param };
        copyParam.message = message;
        if (this.props.resAuth.menus.find((obj: any) => obj.menu === reimbursementApprovalRole.Reimbursement_Approval_View)) {
            const onConfirm = () => { this.props.history.push("/reimbursement"); };
            const onCancel = () => { this.props.history.push("/reimbursement"); };
            this.setState({
                sweetAlert: <SweetAlert param={copyParam} onConfirm={onConfirm} onCancel={onCancel} />,
            });
        }
        else {
            const onConfirm = () => { this.props.history.push(url); };
            const onCancel = () => { this.props.history.push(url); };
            this.setState({
                sweetAlert: <SweetAlert param={copyParam} onConfirm={onConfirm} onCancel={onCancel} />,
            });
        }
    }



    toogleAlert = () => {
        this.setState({
            isAlert: !this.state.isAlert,
        });
    }

    initialLoadDetailTransaction = async () => {
        try {
            const { headers, reimbursementId, combobox } = this.state;
            const copyReimbursementId = reimbursementId;

            const resReimbursement = await HttpService.get(`reimbursements/${copyReimbursementId}`, null, headers);
            const resReimbursementDetail = await HttpService.get(`reimbursement-details/${copyReimbursementId}`, null, headers);
            const resReimbursementEvidence = await HttpService.get(`reimbursement-evidences/${copyReimbursementId}`, null, headers);
            // await this.validateGetData(resreimbursement);

            const validate = cekDataApi(resReimbursement, copyReimbursementId);
            const validateDetail = cekDataApi(resReimbursementDetail, copyReimbursementId);
            const validateEvidence = cekDataApi(resReimbursementEvidence, copyReimbursementId);
            const copyCombobox = { ...combobox };

            const dataClient = {
                parentId: "",
                masterId: MasterTypeClientId,
                activeFlag: true,
            }
            const dataProject = {
                parentId: "",
                masterId: MasterTypeProjectId,
                activeFlag: true,
            }
            const dataTransaction = {
                parentId: "",
                masterId: MasterTypeTransactionId,
                activeFlag: true,
            }
            const dataPIC = {
                roleId: "PM",
            }
            const clientList: any = await masterDetailByType(dataClient, headers);
            const projectList: any = await masterDetailByType(dataProject, headers);
            const transactionList: any = await masterDetailByType(dataTransaction, headers);
            const accountingPeriodList: any = await accountingPeriods(headers);
            const picList: any = await masterUserbyRole(dataPIC, headers);
            copyCombobox.clients = clientList;
            copyCombobox.projects = projectList;
            copyCombobox.transactions = transactionList;
            copyCombobox.accountingPeriods = accountingPeriodList;
            copyCombobox.pics= picList;
            if (!validate.isValid) {
                this.handleKickPermission(validate.errormessage);
                return;
            }

            let copyDataReimbursementDetail = [{ ...dataLineFormat }];
            let copyDataReimbursementEvidence = { ...defaultEvidence };

            if (validateDetail.isValid) {

                copyDataReimbursementDetail = resReimbursementDetail.data.message;
                copyDataReimbursementDetail.forEach((item: any) => {

                    item.amount = parseFloat(item.amount);
                });
            }
            if (validateEvidence.isValid) {

                copyDataReimbursementEvidence.Evidence = resReimbursementEvidence.data.message;
            }
            const copyDataReimbursement = resReimbursement.data.message[0];
            copyCombobox.projectsByClients = projectList.filter((obj: any) => obj.parentId === copyDataReimbursement.clientId);
            // const copyDataReimbursementEvidence = {...defaultEvidence};
            // const copyResReimbursementEvidence = [...resReimbursementEvidence];
            // copyDataReimbursementEvidence.Evidence = {[...resReimbursementEvidence]};
            // const copyDataReimbursementDetail = resReimbursementDetail.data.message || dataLineFormat;
            this.setState({
                title: "Detail Reimbursement",
                reimbursement: copyDataReimbursement,
                reimbursementDetail: copyDataReimbursementDetail,
                reimbursementEvidence: copyDataReimbursementEvidence,
                combobox: copyCombobox,
            });

        } catch (e) {
            console.log('error at initialLoadDetailTrans with error: ', e);
        }
    }
    handleChangeDataLine = (data: any) => {
        try {
            console.log(data);
            this.setState({ reimbursement: data.reimbursement, reimbursementDetail: data.reimbursementDetail });
        } catch (e) {
            console.log(`error at handleChangeDataLine for ${e.target.name} with error: `, e);
        }
    }
    handleAddDataLine = (data: any) => {
        try {
            console.log(data);
            this.setState({ reimbursementDetail: data.reimbursementDetail });
        } catch (e) {
            console.log(`error at handleAddnDeleteDataLine for ${e.target.name} with error: `, e);
        }
    }


    handleChangeInputField = (e: any) => {
        try {
            const { reimbursement, combobox } = this.state;
            const copyData = { ...reimbursement };
            switch (e.target.name) {
                case "clientId":
                    const clients = combobox.clients.find((obj: any) => obj.id === e.target.value);
                    copyData.clientCode = clients.code;
                    copyData.clientName = clients.value;
                    copyData[e.target.name] = e.target.value;
                    break;
                case "projectId":
                    const projects = combobox.projects.find((obj: any) => obj.id === e.target.value);
                    copyData.projectCode = projects.code;
                    copyData.projectName = projects.value;
                    copyData[e.target.name] = e.target.value;
                    break;
                case "accountingPeriodId":
                    const accountingPeriods = combobox.accountingPeriods.find((obj: any) => obj.id === e.target.value);
                    copyData.accountingPeriodCode = accountingPeriods.code;
                    // copyData.masterName = accountingPeriods.name;
                    copyData[e.target.name] = e.target.value;
                    break;
                default:
                    copyData[e.target.name] = e.target.value;
            }
            this.setState({ flagChange: true, reimbursement: copyData });

        } catch (e) {
            console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
        }
    }


    handleApprovedRejectedTransaction = async (action: any) => {
        try {
            const {
                headers,
                reimbursementId,
                reimbursement,
            } = this.state;
            const copyData = { ...reimbursement };
            const {
                resAuth,
            } = this.props;

            const role = resAuth.roles[0].role;
            const status = approvalId.find((obj: any) => obj.id === role);
            let statusNew = 1;
            if (action === ActionAlert.Approved) {
                statusNew = status === undefined ? 1 : status.code + 1;
                copyData.approvedBy = resAuth.userName;
                copyData.rejectedBy = "";
            }
            else {
                statusNew = status === undefined ? 0 : 0;
                copyData.rejectedBy = resAuth.userName;
                copyData.approvedBy = "";
            }


            copyData.status = statusNew;



            const data = {
                data: copyData,
            }

            HttpService.put(`reimbursement/approval/${reimbursementId}`, data, headers)
                .then((res: any) => {
                    const params = messageAction(res, action);
                    // console.log(params);
                    let onConfirm = () => {
                        this.props.history.push("/reimbursement/approval");
                    };
                    let onCancel = () => {
                        this.props.history.push("/reimbursement/approval");
                    };
                    if (!params.isSucces) {
                        onConfirm = () => { this.hideSweetAlert(); };
                        onCancel = () => { this.hideSweetAlert(); };
                    }
                    this.setState({
                        sweetAlert: <SweetAlert param={params.param} onConfirm={onConfirm} onCancel={onCancel} />,
                        isAlert: false,
                    });
                })
                .catch((err: any) => {
                    console.log('err: ', err);
                });


        } catch (e) {
            console.log('error at save data with error: ', e);
        }
    }


    render() {
        const {
            reimbursement,
            reimbursementDetail,
            reimbursementEvidence,
            combobox,
            flagChange,
        } = this.state;
        return (
            <div className="animated fadeIn">

                <Alert color="danger" isOpen={this.state.isAlert} toggle={this.toogleAlert} >
                    {this.state.alertMessage}
                </Alert>
                <Row style={{ marginBottom: 10 }}>
                    <Col>
                        <Label style={{ fontSize: 17, color: 'grey' }}><b> {this.state.title}</b></Label>
                    </Col>
                </Row>

                {this.state.sweetAlert}
                {/* Header Form */}
                {
                    <Fragment>
                        <HeaderForm
                            reimbursement={reimbursement}
                            combobox={combobox}
                            isApproval={true}
                            handleChangeInputField={(e: any) => this.handleChangeInputField(e)}
                        />
                        <EvidenceForm
                            reimbursementEvidence={reimbursementEvidence}
                            reimbursement={reimbursement}
                            isCreate={false}
                            isApproval={true}
                            // handleChangeEvidence={(e: any) => this.handleChangeEvidence(e)}
                            combobox={combobox}
                        />
                        <DataLineForm
                            isApproval={true}
                            reimbursement={reimbursement}
                            reimbursementDetail={reimbursementDetail}
                            handleAddDataLine={(e: any) => this.handleAddDataLine(e)}
                            handleChangeDataLine={(e: any) => this.handleChangeDataLine(e)}
                            combobox={combobox}
                        />
                        {/* Form Action */}
                        <ActionForm
                            flagChange={flagChange}
                            reimbursement={reimbursement}
                            isApproval={true}
                            isCreate={false}
                            isPosting={true}
                            // handleSaveTransaction={(e: any) => this.handleApprovedRejectedTransaction(e)}
                            setSweetAlert={(param: any, action: string) => this.setSweetAlert(param, action)}
                            history={this.props.history}
                        />

                    </Fragment>
                }
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
    resAuth: state.auth.res,
});
export default connect(mapStateToProps, null)(ApprovalReimbursement);
