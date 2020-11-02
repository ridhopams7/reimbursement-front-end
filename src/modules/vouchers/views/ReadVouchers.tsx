import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderForm from '../Components/HeaderFormVouchers';
import ActionForm from '../Components/ActionForm';
import { HttpService } from '../../../utilities';
import {
  productsByOrganization,
  projectsByOrganization,
  customersByOrganization,
  costCentersByOrganization
}
  from '../config/Helper';
import { defaultComboBox } from '../config/Constants'
import moment from 'moment';
class ReadVouchers extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      headerData: null,
      listMaster: { ...defaultComboBox }
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
      // const linesData = resLines.data.lines;
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
        headerData, listMaster: copyListMaster });
    } catch (e) {
      console.log(`error at did mount with error: ${e}`);
    }
  }

  handleInputHeader = (data: any) => {
    this.setState({ headerData: data })
  }

  
  handleCloseButton()
  {
    this.props.history.push("/sample-crud");
  }
  render() {
    const { headerData,
      listMaster } = this.state;
    return (
      <div>
        <HeaderForm
          headerData={headerData}
          handleInputHeader={(data: any) => this.handleInputHeader(data)}
          listMaster={listMaster}
          operation={"read"}
        />
       <ActionForm headerData={headerData}
       handleCloseButton={()=> this.handleCloseButton()}/>
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
export default connect(mapStateToProps)(ReadVouchers);