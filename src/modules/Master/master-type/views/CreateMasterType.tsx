import React, { Component, Fragment } from 'react';
import {
    Row,
    Col,
    Label,
    Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { const_masterType } from '../../../../config';
import { SweetAlert } from '../../../../components';
import { HttpService, handleRedirectUser } from '../../../../utilities';
import {
    // validateSave,
    messageAction,
} from '../../action/Lib';
import { HeaderForm, ActionForm, } from '../components';
import {
    ActionAlert,
    defaultMasterType,
} from '../../config/Constants';


class CreateMasterType extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            masterType: { ...defaultMasterType },
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
            let role = const_masterType.Master_Type_Entry;
            let permission = null;
            permission = this.props.resAuth.menus.find((obj: any) => obj.menu === role);
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
        if (this.props.resAuth.menus.find((obj: any) => obj.menu === const_masterType.Master_Type_View)) {
            const onConfirm = () => { this.props.history.push("master/master-type"); };
            const onCancel = () => { this.props.history.push("master/master-type"); };
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
            const copyDataMasterType = { ...defaultMasterType };
            this.setState({
                title: "Create Master Type",
                masterType: copyDataMasterType,
            });

        } catch (e) {
            console.log('error at initialLoadCreateTrans with error: ', e);
        }
    }

    handleChangeInputField = (e: any) => {
        try {
            const { masterType } = this.state;
            const copyData = { ...masterType };
            copyData[e.target.name] = e.target.value;
            this.setState({ flagChange: true, masterType: copyData });

        } catch (e) {
            console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
        }
    }

    handleRemoveTransaction = async () => {
        try {
            const { headers } = this.state;
            // const userRoles = this.props.resAuth.menus.find((obj: any) => obj.role === masterData.Master_Data_Remove);
            const token: any = { ...headers };
            const copyheaders = {
                Authorization: token.Authorization,
                role: const_masterType.Master_Type_Remove,
                // permission: userRoles.permissions[0],
            }
            await HttpService.delete(`je/${this.state.headerId}`, null, copyheaders)
                .then((res: any) => {
                    const params = messageAction(res, "Deleted");
                    let onConfirm = () => {
                        this.props.history.push("/masterType");
                    };
                    let onCancel = () => {
                        this.props.history.push("/masterType");
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
                masterType,
                headers
            } = this.state;
            const {
                resAuth,
            } = this.props;


            const copyData = { ...masterType };
            const createdBy = resAuth.userName;
            copyData.createdBy = createdBy;
            copyData.lastUpdatedBy = createdBy;
            let role = const_masterType.Master_Type_Save;
            const token: any = { ...headers };

            const data = JSON.stringify(copyData);
            const formData = new FormData();
            formData.append('data', data);
            const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === role);
            const headersmultipart: object = {
                Authorization: token.Authorization,
                role: role,
                permission: userRoles.permissions[0],
                'Content-Type': 'multipart/form-data',
            };


            HttpService.post('master-type', formData, headersmultipart)
                .then((res: any) => {
                    const params = messageAction(res, "Saved");
                    let onConfirm = () => {
                        this.props.history.push("/master/master-type");
                    };
                    let onCancel = () => {
                        this.props.history.push("/master/master-type");
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
            masterType,
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
                            masterType={masterType}
                            handleChangeInputField={(e: any) => this.handleChangeInputField(e)}
                        />

                        {/* Form Action */}
                        <ActionForm
                            flagChange={flagChange}
                            masterType={masterType}
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
export default connect(mapStateToProps, null)(CreateMasterType);
