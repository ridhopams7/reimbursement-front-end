import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderForm from '../Components/HeaderFormVouchers';
import ActionForm from '../Components/ActionForm';
import { HttpService } from '../../../utilities';
import {
  productsByOrganization,
  projectsByOrganization,
  customersByOrganization,
  costCentersByOrganization,
  validateSave,
}
  from '../config/Helper';
import { Alert } from 'reactstrap';
import { defaultComboBox, ActionAlert } from '../config/Constants'
import { SweetAlert } from '../../../components';
import moment from 'moment';
class UpdateVouchers extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      headerData: null,
      listMaster: { ...defaultComboBox },
      sweetAlert: null,
      isAlert: false,
    }
  }

  componentDidMount = async () => {
    try {
      const { id } = this.props.match.params;
      const { listMaster } = this.state
      const resHeader = await HttpService.get(`je-headers/${id}`, null, this.state.token);
      // const resLines = await HttpService.get(`je-lines/${id}`, null, this.state.token);
      const copyListMaster = { ...listMaster };
      const headerData = resHeader.data.header[0];
      headerData.accountingDate = moment(headerData.accountingDate).format('YYYY-MM-DD');
      copyListMaster.accountingperiods = [{
        id: "", code: "",
        name: "Select Accounting Period",
        codeName: "Select Accounting Period"
      }, ...this.props.accPeriodByState];
      copyListMaster.products = await productsByOrganization(headerData.organizationId, this.state.token);
      copyListMaster.projects = await projectsByOrganization(headerData.organizationId, this.state.token);
      copyListMaster.costcenters = await costCentersByOrganization(headerData.organizationId, this.state.token);
      copyListMaster.customers = await customersByOrganization(headerData.organizationId, this.state.token);
      copyListMaster.currencies = this.props.currency;
      this.setState({
        headerData, listMaster: copyListMaster
      });
    } catch (e) {
      console.log(`error at did mount with error: ${e}`);
    }
  }

  hideSweetAlert = () => {
    this.setState({
      sweetAlert: null,
    });
  }

  handleInputHeader = (data: any) => {
    this.setState({ headerData: data })
  }
  toogleAlert = () => {
    this.setState({
      isAlert: !this.state.isAlert,
    });
  }
  setSweetAlert = (param: any, action: string) => {
    let onConfirm = null;

    if (action === ActionAlert.Remove) {
      onConfirm = () => { this.handleRemoveTransaction() };
    }

    const onCancel = () => { this.hideSweetAlert() };

    this.setState({
      sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
    });
  }

  handleRemoveTransaction = async () => {
    try {
      const { headerData } = this.state;

      await HttpService.delete(`je-sample/${headerData.headerId}`, null, this.state.token);
      const message = 'Transaction Successfully Removed';
      const param = {
        type: 'success',
        title: 'Transaction Removed!',
        confirmBtnText: 'Ok',
        confirmBtnBsStyle: 'success',
        message,
        showCancel: false,
        focusConfirmBtn: false,
      };
      const onConfirm = () => { this.props.history.push("/sample-crud"); };
      const onCancel = () => { this.props.history.push("/sample-crud"); };
      this.setState({
        sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
      });
    } catch (e) {
      console.log('error at remove transaction with error: ', e);
    }
  }
  handleCloseButton() {
    this.props.history.push("/sample-crud");
  }
  handleSaveData = () => {
    const { headerData } = this.state;
    const copyHeaderData = { ...headerData }
    const message = validateSave(headerData);
    if (message) {
      this.setState({ alertMessage: `Required but not filled yet: ${message}` }, () => {
        if (this.state.isAlert) {
          document.documentElement.scrollTop = 0;
          return;
        }

        document.documentElement.scrollTop = 0;
        this.toogleAlert();
      })
      return;
    }
    const data = JSON.stringify(copyHeaderData);
    const formData = new FormData();
    formData.append('data', data);
    const headersmultipart: object = {
      Authorization: `Bearer ${this.props.resAuth.token}`,
      'Content-Type': 'multipart/form-data',
    };

    if (copyHeaderData.headerId) {
      HttpService.put(`je-sample/${copyHeaderData.headerId}`, formData, headersmultipart)
        .then((res: any) => {
          const message = res.status === 413 ? 'File too large. Total maximum size is 10 MB' : res.data.message;
          const param = {
            type: 'success',
            title: 'Data Saved!',
            confirmBtnBsStyle: 'success',
            confirmBtnText: 'Ok',
            message,
            showCancel: false,
            focusConfirmBtn: false,
          };

          let onConfirm = () => {
            this.props.history.push("/sample-crud");
          };
          let onCancel = () => {
            this.props.history.push("/sample-crud");
          };

          if (res.status !== 200) {
            param.type = 'danger';
            param.title = 'Attention!';
            param.confirmBtnBsStyle = 'primary';

            onConfirm = () => { this.hideSweetAlert(); };
            onCancel = () => { this.hideSweetAlert(); };
          }

          this.setState({
            sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
          });
        })
        .catch((err: any) => {
          console.log('err: ', err);
        });

    }
  }
  render() {
    const { headerData,
      listMaster } = this.state;
    return (
      <div>
        <Alert color="danger" isOpen={this.state.isAlert} toggle={this.toogleAlert} >
          {this.state.alertMessage}
        </Alert>
        {this.state.sweetAlert}
        <HeaderForm
          headerData={headerData}
          handleInputHeader={(data: any) => this.handleInputHeader(data)}
          listMaster={listMaster}
          operation={"update"}
        />
        <ActionForm headerData={headerData}
          handleSaveData={() => this.handleSaveData()}
          setSweetAlert={(param: any, action: string) => this.setSweetAlert(param, action)}
          handleCloseButton={() => this.handleCloseButton()} />
      </div>

    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
  currency: state.currency.res,
  accPeriodAll: state.accPeriodAll.res,
  accPeriodByState: state.accPeriodByState.res,
  accPeriodDateByState: state.accPeriodDateByState.res,
});

export default connect(mapStateToProps)(UpdateVouchers);