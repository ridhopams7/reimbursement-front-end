import React, { Component, Fragment } from 'react';
import {
    Row,
    Col,
    Label,
    Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { voucherRoles, reimbursementTransactionRole } from '../../../config';
import { SweetAlert } from '../../../components';
import { HttpService, handleRedirectUser, masterUserbyRole } from '../../../utilities';
import {
    // validateSave,
    messageAction,
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
    defaultEvidence,
    saveFormat,
} from '../config/Constants';
import {accountingPeriods, masterDetailByType, getCode } from '../../../utilities/Master';


class CreateReimbursement extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
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

            // const masterTypeId = this.props.match.params ? this.props.match.params.masterTypeId : null;
            const { headers } = this.state;
            let menu = reimbursementTransactionRole.Reimbursement_Transaction_Entry;
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
                // permission: permission.permissions[0],
            }

            this.setState({ headers: headers_ }, () => {
                this.initialLoadCreateTransaction();
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
                this.props.history.push("/master/master-type");
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
        if (this.props.resAuth.menus.find((obj: any) => obj.menu === reimbursementTransactionRole.Reimbursement_Transaction_View)) {
            const onConfirm = () => { this.props.history.push("/"); };
            const onCancel = () => { this.props.history.push("/"); };
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

    initialLoadCreateTransaction = async () => {
        try {
            const { combobox, headers } = this.state;
            const copyDataReimbursement = { ...defaultReimbursement };
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
            const picList: any = await masterUserbyRole(dataPIC, headers);
            const accountingPeriodList: any = await accountingPeriods(headers);
            copyCombobox.clients = clientList;
            copyCombobox.projects = projectList;
            copyCombobox.transactions = transactionList;
            copyCombobox.accountingPeriods = accountingPeriodList;
            copyCombobox.pics= picList;
            this.setState({
                title: "Create Reimbursement",
                reimbursement: copyDataReimbursement,
                combobox: copyCombobox
            });

        } catch (e) {
            console.log('error at initialLoadCreateTrans with error: ', e);
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
    handleChangeEvidence = (data: any) => {
        try {
            console.log(data);

            this.setState({ reimbursementEvidence: data.reimbursementEvidence });

        } catch (e) {
            console.log(`error at handleAddnDeleteDataLine for ${e.target.name} with error: `, e);
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
                    const clients = copyCombobox.clients.find((obj: any) => obj.id === e.target.value);
                    copyCombobox.projectsByClients = copyCombobox.projects.filter((obj: any) => obj.parentId === e.target.value);
                    copyData.projectId = "";
                    copyData.projectCode = "";
                    copyData.projectName = "";
                    copyData.clientCode = clients.code;
                    copyData.clientName = clients.value;
                    copyData[e.target.name] = e.target.value;
                    break;
                case "projectId":
                    const projects = copyCombobox.projects.find((obj: any) => obj.id === e.target.value);
                    copyData.projectCode = projects.code;
                    copyData.projectName = projects.value;
                    copyData[e.target.name] = e.target.value;
                    break;
                case "picId":
                    const pics = copyCombobox.pics.find((obj: any) => obj.id === e.target.value);
                    copyData.picName = pics.userName;
                    copyData[e.target.name] = e.target.value;
                    break;
                case "accountingPeriodId":
                    const accountingPeriods = copyCombobox.accountingPeriods.find((obj: any) => obj.id === e.target.value);
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

    handleRemoveTransaction = async () => {
        try {
            const { headers } = this.state;
            const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Remove);
            const token: any = { ...headers };
            const copyheaders = {
                Authorization: token.Authorization,
                role: voucherRoles.V_Remove,
                permission: userRoles.permissions[0],
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


    handleSaveTransaction = async (action : any) => {
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

            const formatSave = { ...saveFormat}
            const copyData = { ...reimbursement };
            const copyDataDetail = [ ...reimbursementDetail ];
            const createdBy = resAuth.userName;
            const dataCode = {
                clientName: createdBy,
                periodCode: copyData.accountingPeriodCode,
            };
            const code = await getCode(dataCode, headers);
            copyData.createdBy = createdBy;
            copyData.status = action === ActionAlert.Posting ? 1 : 0; 
            copyData.code = code;
            // copyData.actualAmount = copyData.actualAmount;
            copyData.lastUpdatedBy = createdBy;
            let role = reimbursementTransactionRole.Reimbursement_Transaction_Save;
            const token: any = { ...headers };

            formatSave.reimbursement = {...copyData};
          
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
                lineFormat.createdBy = createdBy;
                lines.push(lineFormat);
                lineFormat = {};
            });
            formatSave.reimbursementDetail = [...lines];
            formatSave.totalEvidence = reimbursementEvidence.Evidence === null ? 0 : reimbursementEvidence.Evidence.length;
            const data = JSON.stringify(formatSave);
            
            const formData = new FormData();
            formData.append('data', data);
            // const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === role);
            const headersmultipart: object = {
                Authorization: token.Authorization,
                role: role,
                // permission: userRoles.permissions[0],
                'Content-Type': 'multipart/form-data',
            };
            
            console.log(reimbursementEvidence.Evidence);
            
            reimbursementEvidence.Evidence.forEach((item: any) => {
                formData.append('evidence', item);
              });

            HttpService.post('reimbursement', formData, headersmultipart)
                .then((res: any) => {
                    const params = messageAction(res, "Saved");
                    let onConfirm = () => {
                        this.props.history.push("/reimbursement/transaction");
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
            flagChange,
            combobox
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
                            isCreate={true}
                            isApproval={false}
                            isPosting={false}
                            combobox={combobox}
                            handleChangeInputField={(e: any) => this.handleChangeInputField(e)}
                        />
                        <EvidenceForm
                            reimbursementEvidence={reimbursementEvidence}
                            isCreate={true}
                            isApproval={false}
                            handleChangeEvidence={(e: any) => this.handleChangeEvidence(e)}
                            combobox={combobox}
                        />
                        <DataLineForm
                            reimbursement={reimbursement}
                            isApproval={false}
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
                            isCreate={true}
                            isPosting={false}
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
export default connect(mapStateToProps, null)(CreateReimbursement);
