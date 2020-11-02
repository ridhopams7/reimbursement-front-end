import React, { Component, Fragment } from 'react';
import {
    Row,
    Col,
    Label,
    Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { voucherRoles } from '../../../config';
import { SweetAlert } from '../../../components';
import { HttpService, handleRedirectUser } from '../../../utilities';
import {
    // validateSave,
    messageAction, cekDataApi,
} from '../action/Lib';
import { ListUserForm, ActionFormSelected, } from '../components';
import {
    ActionAlert, defaultRoleUserData, saveFormat,
} from '../config/Constants';
import {userAll } from '../../../utilities/Master';


class UpdateRole extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            roleDataId: '',
            userList: [],
            userListModal: [],
            userListCurrent: [],
            flagChange: false,
            isAlert: false,
            alertMessage: '',
            sweetAlert: null,
            headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
        };
    }

    componentDidMount = async () => {
        try {

            const roleDataId = this.props.match.params ? this.props.match.params.roleDataId : '';
            const { headers } = this.state;
            let role = voucherRoles.V_Entry;
            // let permission = null;
            // permission = this.props.resAuth.roles.find((obj: any) => obj.role === role);
            // console.log(this.props.match.params);
            // if (!permission) {
            //     const message = "Unauthorized";
            //     this.handleKickPermission(message);
            //     return;
            // }
            const headers_ = {
                ...headers,
                role: role,
                // permission: permission.permissions[0],
            }

            this.setState({ headers: headers_, roleDataId }, () => {
                this.initialLoadDetailTransaction();
            });
        } catch (e) {
            console.log('error at didmount with error: ', e);
        }
    }
    initialLoadDetailTransaction = async () => {
        try {
            const { headers, roleDataId } = this.state;
            const copyRoleDataId = roleDataId;
            const masterUserList: any = await userAll(headers);
            // console.log(masterUserList);
            const resRoleData = await HttpService.get(`role-user/${copyRoleDataId}/roleId`, null, headers);
            const validate = cekDataApi(resRoleData, copyRoleDataId);
            let copyUserCurrent: any[] = [];
            if (validate.isValid) {
                copyUserCurrent = resRoleData.data.message;
            }
            console.log(copyUserCurrent);
            const dataModal: any[] = [];
            masterUserList.forEach((item: any) => {
                dataModal.push({ isChecked: false, ...item });
            });
          

            this.setState({
                title: "User List",
                userList: masterUserList,
                userListCurrent: copyUserCurrent,
                userListModal: dataModal,
                roleDataId: copyRoleDataId
            });

        } catch (e) {
            console.log('error at initialLoadDetailTrans with error: ', e);
        }
    }


    hideSweetAlert = () => {
        this.setState({
            sweetAlert: null,
        });
    }
    handleChangeModalField = (e: any) => {
        try {
            this.setState({ flagChange: true, userListModal: e.userListModal });

        } catch (e) {
            console.log(`error at handleChangeModalField for ${e.target.name} with error: `, e);
        }
    }
    handleDeleteDataLine = (puserListCurrent: any) => {
        try {
            // console.log(userListCurrent);
           this.setState({ flagChange: true, userListCurrent: puserListCurrent });

        } catch (e) {
            console.log(`error at handleChangeModalField for ${e.target.name} with error: `, e);
        }
    }
    handleSelectedUser = (e: any) => {
        try {
            const { userList } = this.state;
            // const copyData = [...userListModalDefault];
            const dataModal: any[] = [];
            userList.forEach((item: any) => {
                dataModal.push({ isChecked: false, ...item });
            });
            console.log(userList);
            console.log(e);
            this.setState({ flagChange: true, userListCurrent: e.userListCurrent, userListModal: dataModal });

        } catch (e) {
            console.log(`error at handleChangeModalField for ${e.target.name} with error: `, e);
        }
    }
    setSweetAlert = (param: any, action: string) => {
        let onConfirm = null;
        if (action === ActionAlert.Close) {
            onConfirm = () => {
                this.props.history.push("/user/role");
            };
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
        if (this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_View)) {
            const onConfirm = () => { this.props.history.push("/user/role"); };
            const onCancel = () => { this.props.history.push("/user/role"); };
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
   
    handleSaveTransaction = async () => {
        try {
            const {
                userListCurrent,
                headers,
                roleDataId
            } = this.state;
            const {
                resAuth,
            } = this.props;
            const copyroleDataId = roleDataId;
            const formatSave = { ...saveFormat}
            const copyData = [...userListCurrent];
            const createdByNew = resAuth.userName;
            const createdDateNew = new Date();
            let lineFormat: any = { ...defaultRoleUserData };
            const lines: Array<object> = [];
            copyData.forEach((item: any, index: number) => {
                const {
                    userId,
                    createdBy,
                    createdDate
                } = item;
                lineFormat.userId = userId;
                lineFormat.roleId = copyroleDataId;
                lineFormat.createdBy = createdBy || createdByNew;
                lineFormat.createdDate = createdDate || createdDateNew;
                lines.push(lineFormat);
                lineFormat = {};
            });
            let role = voucherRoles.V_Save;
            const token: any = { ...headers };
            formatSave.roleUserDetail = [...lines];
            formatSave.totalUser = lines.length;
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


            HttpService.put(`role-user/${copyroleDataId}`, formData, headersmultipart)
                .then((res: any) => {
                    const params = messageAction(res, "Updated");
                    // console.log(params);
                    let onConfirm = () => {
                        this.props.history.push("/user/role");
                    };
                    let onCancel = () => {
                        this.props.history.push("/user/role");
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
            userList,
            userListCurrent,
            userListModal,
            roleDataId,
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
                        <ListUserForm
                            userList={userList}
                            userListCurrent={userListCurrent}
                            userListModal={userListModal}
                            roleDataId={roleDataId}
                            handleDeleteDataLine={(e: any) => this.handleDeleteDataLine(e)}
                            handleSelectedUser={(e: any) => this.handleSelectedUser(e)}
                            handleChangeModalField={(e: any) => this.handleChangeModalField(e)}
                        />

                        {/* Form Action */}
                        <ActionFormSelected

                            // flagChange={flagChange}
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
export default connect(mapStateToProps, null)(UpdateRole);
