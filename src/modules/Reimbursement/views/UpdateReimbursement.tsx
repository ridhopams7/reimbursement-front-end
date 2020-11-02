import React, { Component, Fragment } from 'react';
import {
    Row,
    Col,
    Label,
    Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { reimbursementTransactionRole } from '../../../config';
import { SweetAlert } from '../../../components';
import { HttpService, handleRedirectUser, masterUserbyRole } from '../../../utilities';
import {
    // validateSave,
    messageAction,
    cekDataApi,
    // getEvidence,
} from '../action/Lib';
import { HeaderForm, ActionForm, DataLineForm, EvidenceForm, } from '../components';
import {
    ActionAlert,
    defaultReimbursement,
    defaultCombobox,
    MasterTypeClientId,
    MasterTypeProjectId,
    dataLineFormat,
    MasterTypeTransactionId,
    saveFormat,
    defaultEvidence,
} from '../config/Constants';
import { masterDetailByType, accountingPeriods } from '../../../utilities/Master';


class UpdateReimbursement extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            reimbursementId: '',
            reimbursement: { ...defaultReimbursement },
            reimbursementDetail: [{ ...dataLineFormat }],
            reimbursementEvidence: { ...defaultEvidence },
            combobox: { ...defaultCombobox },
            isPosting: true,
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
            let role = reimbursementTransactionRole.Reimbursement_Transaction_Save;
            let permission = null;
            permission = this.props.resAuth.menus.find((obj: any) => obj.menu === role);
            console.log(this.props.match.params);
            if (!permission) {
                const message = "Unauthorized";
                this.handleKickPermission(message);
                return;
            }
            const headers_ = {
                ...headers,
                role: role,
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
        else if (action === ActionAlert.Remove) {
            onConfirm = () => { this.handleRemoveTransaction() };
        }
        else if (action === ActionAlert.Posting || action === ActionAlert.Save) {
            onConfirm = () => { this.handleSaveTransaction(action) };
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
        if (this.props.resAuth.menus.find((obj: any) => obj.menu === reimbursementTransactionRole.Reimbursement_Transaction_Save)) {
            const onConfirm = () => { this.props.history.push("/master/master-data"); };
            const onCancel = () => { this.props.history.push("/master/master-data"); };
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
            copyCombobox.pics = picList;
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

            const isPosting = copyDataReimbursement.status === "0" ? false : true;
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
                isPosting: isPosting,
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
            const copyCombobox = { ...combobox };
            switch (e.target.name) {
                case "clientId":
                    const clients = combobox.clients.find((obj: any) => obj.id === e.target.value);
                    copyCombobox.projectsByClients = copyCombobox.projects.filter((obj: any) => obj.parentId === e.target.value);
                    copyData.projectId = "";
                    copyData.projectCode = "";
                    copyData.projectName = "";
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
            this.setState({ flagChange: true, reimbursement: copyData, combobox: copyCombobox });

        } catch (e) {
            console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
        }
    }
    handleChangeEvidence = (data: any) => {
        try {
            console.log(data);

            this.setState({ reimbursementEvidence: data.reimbursementEvidence });

        } catch (e) {
            console.log(`error at handleAddnDeleteDataLine for ${e.target.name} with error: `, e);
        }
    }
    handleRemoveTransaction = async () => {
        try {
            const { headers } = this.state;
            // const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Remove);
            const token: any = { ...headers };
            const copyheaders = {
                Authorization: token.Authorization,
                role: reimbursementTransactionRole.Reimbursement_Transaction_Remove,
                // permission: userRoles.permissions[0],
            }
            await HttpService.delete(`reimbursement/${this.state.reimbursementId}`, null, copyheaders)
                .then((res: any) => {
                    const params = messageAction(res, "Deleted");
                    let onConfirm = () => {
                        this.props.history.push("/reimbursement/transaction");
                    };
                    let onCancel = () => {
                        this.props.history.push("/reimbursement/transaction");
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
            console.log('error at remove transaction with error: ', e);
        }
    }


    handleSaveTransaction = async (action: any) => {
        try {
            const {
                reimbursement,
                reimbursementDetail,
                reimbursementEvidence,
                headers
            } = this.state;
            const {
                resAuth,
            } = this.props;

            const formatSave = { ...saveFormat }
            const copyData = { ...reimbursement };
            const copyDataDetail = [...reimbursementDetail];

            const createdBy = resAuth.userName;
            copyData.status = action === ActionAlert.Posting ? 1 : 0;
            copyData.approvedBy = action === ActionAlert.Posting ? "" : copyData.approvedBy;
            copyData.rejectedBy = action === ActionAlert.Posting ? "" : copyData.rejectedBy;

            // copyData.isPosted = false;
            // copyData.actualAmount = 0;
            copyData.lastUpdatedBy = createdBy;
            let role = reimbursementTransactionRole.Reimbursement_Transaction_Save;
            const token: any = { ...headers };
            formatSave.reimbursement = { ...copyData };
            let lineFormat: any = { ...dataLineFormat };
            const lines: Array<object> = [];
            copyDataDetail.forEach((item: any, index: number) => {
                const {
                    description,
                    transactionId,
                    transactionCode,
                    transactionName,
                    amount,
                } = item;
                lineFormat.lineNo = index + 1;
                lineFormat.description = description;
                lineFormat.transactionId = transactionId;
                lineFormat.transactionCode = transactionCode;
                lineFormat.transactionName = transactionName;
                lineFormat.amount = amount;
                lineFormat.lastUpdatedBy = createdBy;
                lines.push(lineFormat);
                lineFormat = {};
            });
            formatSave.reimbursementDetail = [...lines];
            const data = JSON.stringify(formatSave);
            const formData = new FormData();
            formData.append('data', data);
            // const userRoles = this.props.resAuth.menus.find((obj: any) => obj.role === role);
            const headersmultipart: object = {
                Authorization: token.Authorization,
                role: role,
                // permission: userRoles.permissions[0],
                'Content-Type': 'multipart/form-data',
            };
            console.log(reimbursementEvidence);

            reimbursementEvidence.NewEvidence.forEach((item: any) => {
                formData.append('createdEvidence', item);
            })

            reimbursementEvidence.DeleteEvidence.forEach((item: any) => {
                formData.append('deletedEvidence', JSON.stringify(item));
            })

            formData.append('createdEvidenceLength', reimbursementEvidence.NewEvidence.length);
            formData.append('deletedEvidenceLength', reimbursementEvidence.DeleteEvidence.length);


            HttpService.put(`reimbursement/${this.state.reimbursementId}`, formData, headersmultipart)
                .then((res: any) => {
                    const params = messageAction(res, "Updated");
                    // console.log(params);
                    let onConfirm = () => {
                        this.props.history.push("/reimbursement/transaction");
                    };
                    let onCancel = () => {
                        this.props.history.push("/reimbursement/transaction");
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
            isPosting,
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
                            isApproval={false}
                            isPosting={isPosting}
                            combobox={combobox}
                            handleChangeInputField={(e: any) => this.handleChangeInputField(e)}
                        />
                        <EvidenceForm
                            reimbursementEvidence={reimbursementEvidence}
                            reimbursement={reimbursement}
                            isCreate={false}
                            isPosting={isPosting}
                            isApproval={false}
                            handleChangeEvidence={(e: any) => this.handleChangeEvidence(e)}
                            combobox={combobox}
                        />
                        <DataLineForm
                            reimbursement={reimbursement}
                            isApproval={false}
                            isPosting={isPosting}
                            reimbursementDetail={reimbursementDetail}
                            handleAddDataLine={(e: any) => this.handleAddDataLine(e)}
                            handleChangeDataLine={(e: any) => this.handleChangeDataLine(e)}
                            combobox={combobox}
                        />

                        {/* Form Action */}
                        <ActionForm
                            flagChange={flagChange}
                            reimbursement={reimbursement}
                            isApproval={false}
                            isCreate={false}
                            isPosting={isPosting}

                            // handleSaveTransaction={() => this.handleSaveTransaction()}
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
export default connect(mapStateToProps, null)(UpdateReimbursement);
