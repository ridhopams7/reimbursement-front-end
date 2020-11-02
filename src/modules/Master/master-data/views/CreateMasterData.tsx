import React, { Component, Fragment } from 'react';
import {
    Row,
    Col,
    Label,
    Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { const_masterData } from '../../../../config';
import { SweetAlert } from '../../../../components';
import { HttpService, handleRedirectUser, masterTypesAll } from '../../../../utilities';
import {
    // validateSave,
    messageAction,
} from '../../action/Lib';
import { HeaderForm, ActionForm, } from '../components';
import {
    ActionAlert,
    defaultMasterData,
    defaultCombobox,
} from '../../config/Constants';
import { masterDetailByParent } from '../../../../utilities/Master';


class CreateMasterData extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            masterData: { ...defaultMasterData },
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
            let role = const_masterData.Master_Data_Entry;
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
        else if (action === ActionAlert.Save) {
            onConfirm = () => { this.handleSaveTransaction() };
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
        if (this.props.resAuth.menus.find((obj: any) => obj.menu === const_masterData.Master_Data_View)) {
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

    initialLoadCreateTransaction = async () => {
        try {
            const { combobox, headers } = this.state;
            const copyDataMasterData = { ...defaultMasterData };
            const copyCombobox = { ...combobox };
            const data = {
                id : '',
                parentId : '',
            }
            const masterTypeList: any = await masterTypesAll(headers);
            const masterDataList: any = await masterDetailByParent(data, headers);
            console.log(masterDataList);
            copyCombobox.MasterTypes = masterTypeList;
            copyCombobox.MasterDetails = masterDataList;
            this.setState({
                title: "Create Master Data",
                masterData: copyDataMasterData,
                combobox: copyCombobox
            });

        } catch (e) {
            console.log('error at initialLoadCreateTrans with error: ', e);
        }
    }


    handleChangeInputField = (e: any) => {
        try {
            const { masterData, combobox } = this.state;
            const copyData = { ...masterData };
            switch (e.target.name) {
                case "masterId":
                    const master = combobox.MasterTypes.find((obj: any) => obj.id === e.target.value);
                    copyData.masterCode = master.code;
                    copyData.masterName = master.name;
                    copyData[e.target.name] = e.target.value;
                    break;
                default:
                    copyData[e.target.name] = e.target.value;
            }
            this.setState({ flagChange: true, masterData: copyData });

        } catch (e) {
            console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
        }
    }

    handleRemoveTransaction = async () => {
        try {
            const { headers } = this.state;
            // const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Remove);
            const token: any = { ...headers };
            const copyheaders = {
                Authorization: token.Authorization,
                role: const_masterData.Master_Data_Remove,
                // permission: userRoles.permissions[0],
            }
            await HttpService.delete(`je/${this.state.headerId}`, null, copyheaders)
                .then((res: any) => {
                    const params = messageAction(res, "Deleted");
                    let onConfirm = () => {
                        this.props.history.push("/voucher");
                    };
                    let onCancel = () => {
                        this.props.history.push("/voucher");
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


    handleSaveTransaction = async () => {
        try {
            const {
                masterData,
                headers
            } = this.state;
            const {
                resAuth,
            } = this.props;


            const copyData = { ...masterData };
            // const message = validateSave(this.state);
            // if (message) {
            //     this.setState({ alertMessage: `Required but not filled yet: ${message}` }, () => {
            //         if (this.state.isAlert) {
            //             document.documentElement.scrollTop = 0;
            //             return;
            //         }

            //         document.documentElement.scrollTop = 0;
            //         this.toogleAlert();
            //     })
            //     return;
            // }
            const createdBy = resAuth.userName;
            copyData.createdBy = createdBy;
            copyData.lastUpdatedBy = createdBy;
            let role = const_masterData.Master_Data_Save;
            const token: any = { ...headers };

            const data = JSON.stringify(copyData);
            const formData = new FormData();
            formData.append('data', data);
            // const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === role);
            const headersmultipart: object = {
                Authorization: token.Authorization,
                role: role,
                // permission: userRoles.permissions[0],
                'Content-Type': 'multipart/form-data',
            };
            

            HttpService.post('master-data', formData, headersmultipart)
                .then((res: any) => {
                    const params = messageAction(res, "Saved");
                    let onConfirm = () => {
                        this.props.history.push("/master/master-data");
                    };
                    let onCancel = () => {
                        this.props.history.push("/master/master-data");
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
            masterData,
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
                            masterData={masterData}
                            combobox={combobox}
                            handleChangeInputField={(e: any) => this.handleChangeInputField(e)}
                        />

                        {/* Form Action */}
                        <ActionForm
                            flagChange={flagChange}
                            masterData={masterData}
                            handleSaveTransaction={() => this.handleSaveTransaction()}
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
export default connect(mapStateToProps, null)(CreateMasterData);
