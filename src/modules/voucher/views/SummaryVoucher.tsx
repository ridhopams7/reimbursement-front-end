
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Search } from '../components';
import { voucherRoles } from '../../../config'
import {
  initialPage, VOUCHERLISTENDPOINT, defaultComboBox,
  defaultRequest, defaultFilter, defaultVoucherList,
} from '../config/Constants';
import { List, Pagination } from '../components';
import { Alert } from 'reactstrap';
import { HttpService, handleRedirectUser } from '../../../utilities';
import { getPager, getFilterValue, isDateFromBigger } from '../action/Lib';
import { SweetAlert } from '../../../components';
import { VoucherFilterValue } from '../redux/ActionVoucher'
import moment from 'moment';

class ViewVoucher extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      action: '',
      err: '',
      res: { ...defaultVoucherList },
      headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      combobox: { ...defaultComboBox },
      small: false,
      accountingPeriod: { startDate: '', endDate: '' },
      request: { ...defaultRequest },
      disablecombobox: true,
      disableorganization: false,
      isViewList: this.props.isViewList,
      filter: { ...defaultFilter },
      isAlert: false,
      alertMessage: '',
      sweetAlert: null,
    };
  }

  componentDidMount = async () => {
    try {
      const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_View);
      if (!userRoles) {
        this.handleRedirectUser();
        return;
      }
      this.initialLoadViewSummary();
    } catch (e) {
      console.log('error at component did mount with error: ', e);
    }
  }

  initialLoadViewSummary = async () => {
    try {
      const { headers } = this.state;
      const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_View);
      const copyheaders = {
        ...headers,
        role: voucherRoles.V_View,
        permission: userRoles.permissions[0],
      }
      await this.getTransOrganizationList(copyheaders);
      await this.getAccountingPeriodList(copyheaders);

      let { disablecombobox, disableorganization, combobox } = this.state;
      let filter = { ...defaultFilter };
      if (this.props.filterVoucher === null) {
        this.props.getFilterVoucher({ ...defaultFilter });
      } else {
        filter = { ...this.props.filterVoucher };
      }
      const data = getFilterValue(filter);
      if (combobox.organizations.length > 1) {
        disablecombobox = true;
        disableorganization = false;
        await this.getProductList('', copyheaders);
        await this.getProjectList('', copyheaders);
        await this.getCostCenterList('', copyheaders);
        await this.getCustomerList('', copyheaders);
        await this.getJournal(data, initialPage.order,
          initialPage.direction, initialPage.pagenumber,
          initialPage.pageSize, copyheaders);
      } else {
        const organizationId = combobox.organizations[0].id;
        data.organizationId = organizationId;
        filter.ddlOrganization = organizationId;
        disablecombobox = false;
        disableorganization = true;
        await this.getProductList(organizationId, copyheaders);
        await this.getProjectList(organizationId, copyheaders);
        await this.getCostCenterList(organizationId, copyheaders);
        await this.getCustomerList(organizationId, copyheaders);
        await this.getJournal(data, initialPage.order, initialPage.direction, initialPage.pagenumber, initialPage.pageSize, copyheaders);
      }
      this.setState({ filter, headers: copyheaders, disablecombobox, disableorganization });
    } catch (e) {
      console.log('error at initialLoadViewVoucherDetail with error: ', e);
    }
  }

  handleRedirectUser = () => {
    try {
      const { resAuth } = this.props;

      const data = handleRedirectUser(resAuth);

      const { param, url } = data;

      const onConfirm = () => { this.props.history.push(url); };
      const onCancel = () => { this.props.history.push(url); };

      this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
    } catch (e) {
      console.log(`error at handleRedirectUser with error: ${e}`);
    }
  }

  setPage = (page: number) => {
    try {
      const { res } = this.state;
      let pager = this.state.request;
      const totalresults = res ? res.totalElements : 0;
      const pagesize = res ? res.pageSize : 0;
      const direction = pager && pager.direction ? pager.direction : initialPage.direction;
      const orderBy = pager && pager.orderBy ? pager.orderBy : initialPage.order;
      let totalPages = Math.ceil(totalresults / pagesize);

      if (page < 1 || page > totalPages) return;

      // get new pager object for specified page
      pager = getPager(totalresults, page, pagesize, direction, orderBy);

      this.setState({ request: pager });
    } catch (e) {
      console.log('error at set Page with error: ', e);
    }
  }

  toogleAlert = () => { this.setState({ isAlert: !this.state.isAlert }); }

  getTransOrganizationList = async (headers: any) => {
    try {
      const { combobox } = this.state;
      const copyCombobox = { ...combobox };

      // const userRoles = this.props.resRoles.permission.find((obj: any) => obj.roles === voucherRoles.V_View);
      if (headers.permission) {
        const res = await HttpService.get(`organizations/permission`, null, headers);
        let organizations = []
        if (res.data.organization.length > 1) {
          organizations = [{ id: '', name: 'Select Organization' }, ...res.data.organization];
        }
        else {
          organizations = [...res.data.organization];
        }
        copyCombobox.organizations = organizations;
      }
      else {
        const organizations = [{ id: '', code: '', name: 'Select Organization' }];
        copyCombobox.organizations = organizations;
      }

      this.setState({ combobox: copyCombobox });
    } catch (e) {
      console.log('error at getOrganizatonList with error: ', e);
    }
  }

  getProductList = async (selectedOrganization: any, headers: any) => {
    try {
      const { combobox } = this.state;
      const copyCombobox = { ...combobox };

      if (selectedOrganization === '') {
        const listProduct = [{ id: '', code: '', name: 'Select Product' }];
        copyCombobox.products = listProduct;
      } else {
        const res = await HttpService.get(`organizations/${selectedOrganization}/products`, null, headers);
        const listProduct = [{ id: '', code: '', name: 'Select Product' }, ...res.data.products];
        copyCombobox.products = listProduct;
      }
      this.setState({ combobox: copyCombobox });
    } catch (e) {
      console.log('error at getProductList with error: ', e);
    }
  }

  getProjectList = async (selectedOrganization: any, headers: any) => {
    try {
      const { combobox } = this.state;
      const copyCombobox = { ...combobox };
      if (selectedOrganization === '') {
        const listProject = [{ id: '', code: '', name: 'Select Project' }];
        copyCombobox.projects = listProject;
      } else {
        const res = await HttpService.get(`organizations/${selectedOrganization}/projects`, null, headers);
        const listProject = [{ id: '', code: '', name: 'Select Project' }, ...res.data.projects];
        copyCombobox.projects = listProject;
      }
      this.setState({ combobox: copyCombobox });
    } catch (e) {
      console.log('error at getProjectList with error: ', e);
    }
  }

  getCostCenterList = async (selectedOrganization: any, headers: any) => {
    try {
      const { combobox } = this.state;
      const copyCombobox = { ...combobox };
      if (selectedOrganization === '') {
        const listCostCenter = [{ id: '', code: '', name: 'Select Cost Center' }];
        copyCombobox.costcenters = listCostCenter;
      } else {
        const res = await HttpService.get(`organizations/${selectedOrganization}/cost-centers`, null, headers);
        const listCostCenter = [{ id: '', code: '', name: 'Select Cost Center' }, ...res.data.costCenters];
        copyCombobox.costcenters = listCostCenter;
      }
      this.setState({ combobox: copyCombobox });
    } catch (e) {
      console.log('error at getCostCenterList with error: ', e);
    }
  }

  getCustomerList = async (selectedOrganization: any, headers: any) => {
    try {
      const { combobox } = this.state;
      const copyCombobox = { ...combobox };
      if (selectedOrganization === '') {
        const listCustomer = [{ id: '', code: '', name: 'Select Customer' }];
        copyCombobox.customers = listCustomer;
      } else {
        const res = await HttpService.get(`organizations/${selectedOrganization}/customers`, null, headers);
        const listCustomer = [{ id: '', code: '', name: 'Select Customer' }, ...res.data.customers];
        copyCombobox.customers = listCustomer;
      }
      this.setState({ combobox: copyCombobox });
    } catch (e) {
      console.log('error at getCustomerList with error: ', e);
    }
  }

  getAccountingPeriodList = async (headers: any) => {
    try {
      const { combobox } = this.state;
      const copyCombobox = { ...combobox };
      const res = await HttpService.get(`accounting-periods`, null, headers);
      const listPeriod = [{ id: '', code: '', name: 'Select Period' }, ...res.data.accountingPeriod];
      copyCombobox.AccountingPeriods = listPeriod;
      this.setState({ combobox: copyCombobox });
    } catch (e) {
      console.log('error at getPeriodList with error: ', e);
    }
  }

  getJournal = async (filterData: any, orderBy: string, direction: string, page: number, pageSize: number, headers: any) => {
    try {
      const data = {
        ...filterData,
        orderBy,
        direction,
        page,
        pageSize,
      };

      const res = await HttpService.post(VOUCHERLISTENDPOINT, data, headers);
      const { request } = this.state;
      const pagenumber: any = request.currentPage === 0 ? 1 : request.currentPage;

      const vouchers = { ...defaultVoucherList };
      let errorMessage = "";
      if (res.data) {
        if (res.data.statusCode === 200 && res.data.message) {
          this.setState({ res: res.data.message }, () => this.setPage(pagenumber));
          return;
        } else {
          errorMessage = res.data.message;
        }
      } else {
        errorMessage = res.message;
      }
      this.setState({ res: vouchers, alertMessage: errorMessage, isAlert: true }, () => {
        window.scrollTo({ top: 0 });
      });
    } catch (e) {
      console.log('error at get Journal List with error: ', e);
    }
  }

  getComboBox = async (selectedOrganization: any, headers: any) => {
    try {
      await this.getProductList(selectedOrganization, headers);
      await this.getProjectList(selectedOrganization, headers);
      await this.getCostCenterList(selectedOrganization, headers);
      await this.getCustomerList(selectedOrganization, headers);
    } catch (e) {
      console.log('error at getComboBox with error: ', e);
    }

  }

  handleSearchChange = (event: any) => {
    try {
      event.preventDefault();
      let { filter, disablecombobox, headers } = this.state;
      const { name, value } = event.target;
      const copyFilter = { ...filter };
      copyFilter[name] = value;
      if (name === "ddlOrganization") {
        if (value && value !== '') {
          this.getComboBox(value, headers);
          disablecombobox = false;
        } else {
          disablecombobox = true;
        }
        copyFilter.ddlProduct = '';
        copyFilter.ddlProject = '';
        copyFilter.ddlPosting = '';
        copyFilter.ddlCostCenter = '';
        copyFilter.ddlCategory = '';
        copyFilter.ddlsubCategory = '';
        copyFilter.ddlCustomer = '';
        this.setState({ disablecombobox, filter: copyFilter })
        return;
      } else if (name === "ddlAccPeriod") {
        if (value && value !== '') {
          const { combobox } = this.state;
          copyFilter.dtpCreatedDateFrom = '';
          copyFilter.dtpCreatedDateTo = '';
          const accountingPeriod = combobox.AccountingPeriods.find((obj: any) => obj.id === value);
          this.setState({ filter: copyFilter }, () => { this.setAccountingPeriod(accountingPeriod) });
        } else {
          copyFilter.dtpAccDateFrom = '';
          copyFilter.dtpAccDateTo = '';
          const accountingPeriod = {
            startDate: '',
            endDate: ''
          };
          this.setState({ filter: copyFilter, accountingPeriod });
        }
        return;
      }

      this.setState({ filter: copyFilter })
    } catch (e) {
      console.log('error at handleSearchChange with error: ', e);
    }

  }

  setAccountingPeriod = (accountingPeriods: any) => {
    try {
      const startDate = accountingPeriods.startDate;
      const endDate = accountingPeriods.endDate;

      interface accountingDate {
        startDate: string,
        endDate: string,
      }

      const hasil: accountingDate = {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD')
      };

      const accountingPeriod = hasil;
      this.setState({ accountingPeriod });
    } catch (e) {
      console.log('error at getAccountingPeriod with error: ', e);
    }
  }

  handleOnClear = () => {
    try {
      const { request, combobox, disablecombobox, headers } = this.state;
      let isdisabled = disablecombobox;
      const filter_ = { ...defaultFilter };
      if (combobox.organizations.length > 1) {
        isdisabled = true;
      }
      this.props.getFilterVoucher(filter_);
      const data = getFilterValue(filter_);

      const listsubCategory = [{ id: '', name: 'Select SubCategory' }];
      combobox.transactionsubcategorys = listsubCategory;

      request['currentPage'] = initialPage.pagenumber + 1;
      request['orderBy'] = initialPage.order;
      request['direction'] = initialPage.direction;
      this.setState({ filter: filter_, request, isAlert: false, combobox, disablecombobox: isdisabled });
      this.getJournal(data, initialPage.order, initialPage.direction, initialPage.pagenumber, initialPage.pageSize, headers);
    } catch (e) {
      console.log('error at handleOnClear with error: ', e);
    }

  }

  handlePageSizeChange = (event: any) => {
    try {
      const { request } = this.state;
      const { name, value } = event.target;

      request[name] = value;
      if (value > 100) request[name] = 100;

      this.setState({ request })
    } catch (e) {
      console.log('error at handlePageSizeChange with error: ', e);
    }
  }

  handleChangePage = (page: number) => {
    try {
      const { request, filter, headers } = this.state;

      const data = getFilterValue(filter);

      let order = initialPage.order;
      if (request && request.orderBy) {
        order = request.orderBy;
      }
      let pageSize = initialPage.pageSize;
      if (request && request.pageSize && request.pageSize !== '') {
        pageSize = request.pageSize;
      }
      let direction = initialPage.direction;
      if (request && request.direction) {
        direction = request.direction;
      }
      request['currentPage'] = page;
      this.setState(request);
      this.getJournal(data, order, direction, page - 1, pageSize, headers);
    } catch (e) {
      console.log('error at handleChangePage with error: ', e);
    }
  }

  handlePageSizeGo = (e: any) => {
    try {
      e.preventDefault();
      const { request, filter, headers } = this.state;

      const data = getFilterValue(filter);

      let order = initialPage.order;
      if (request && request.orderBy) {
        order = request.orderBy;
      }
      let currentPage = initialPage.pagenumber;

      let pageSize = initialPage.pageSize;
      if (request && request.pageSize) {
        pageSize = request.pageSize;
      }

      let direction = initialPage.direction;
      if (request && request.direction) {
        direction = request.direction;
      }
      this.getJournal(data, order, direction, currentPage, pageSize, headers);
      request['pageSize'] = pageSize;
      request['currentPage'] = currentPage + 1;
      this.setState(request);
    } catch (er) {
      console.log('error at handleChangePage with error: ', er);
    }
  }

  handleOrderBy = (order: string) => {
    try {
      const { filter, request, headers } = this.state;

      const data = getFilterValue(filter);

      let direction = initialPage.direction;
      if (request && request.direction && request.orderBy) {
        if (request.orderBy === order) {
          if (request.direction === initialPage.direction) {
            direction = "ASC";
          } else {
            direction = "DESC";
          }
        } else {
          direction = "ASC";
        }
      }

      let pageSize = initialPage.pageSize;
      if (request && request.pageSize) {
        pageSize = request.pageSize;
      }
      let currentPage = initialPage.pagenumber;

      this.getJournal(data, order, direction, currentPage, pageSize, headers);
      request['direction'] = direction;
      request['orderBy'] = order;
      request['currentPage'] = 1;
      this.setState(request);
    } catch (e) {
      console.log('error at handleChangePage with error: ', e);
    }

  }

  handleSearchJournal = (e: any) => {
    try {
      e.preventDefault();
      const { filter, request, headers } = this.state;
      this.props.getFilterVoucher(filter);
      const data = getFilterValue(filter);

      if (data.accountingDateFrom !== '' && data.accountingDateTo !== '') {
        if (isDateFromBigger(data.accountingDateFrom, data.accountingDateTo)) {
          this.setState({ alertMessage: 'Account Date To must be greater than Account Date From', isAlert: true });
          window.scrollTo({ top: 0 });
          return;
        }
      }

      if (data.createdDateFrom !== '' && data.createdDateTo !== '') {
        if (isDateFromBigger(data.createdDateFrom, data.createdDateTo)) {
          this.setState({ alertMessage: 'Created Date To must be greater than Created Date From', isAlert: true });
          window.scrollTo({ top: 0 });
          return;
        }
      }

      let order = initialPage.order;
      let currentPage = initialPage.pagenumber;
      let pageSize = initialPage.pageSize;
      if (request && request.pageSize) {
        pageSize = request.pageSize;
      }
      let direction = initialPage.direction;

      this.getJournal(data, order, direction, currentPage, pageSize, headers);

      request['currentPage'] = currentPage === 0 ? 1 : currentPage;
      request['direction'] = direction;
      request['orderBy'] = order;
      this.setState({ request, isViewList: true, isAlert: false });
    } catch (er) {
      console.log('error at handleChangePage with error: ', er);
    }

  }

  render() {
    const { res, request, filter, sweetAlert, combobox, disablecombobox, disableorganization, accountingPeriod } = this.state;

    return (
      <div className="animated fadeIn">

        <Alert color="danger" isOpen={this.state.isAlert} toggle={this.toogleAlert} >
          {this.state.alertMessage}</Alert>
        {sweetAlert}
        <Search comboBoxList={combobox} dataitems={res} resquest={request} filter={filter} accountingPeriod={accountingPeriod}
          onSearch={this.handleSearchJournal} onClear={this.handleOnClear} disablecombobox={disablecombobox}
          disableorganization={disableorganization}
          onHandleChange={this.handleSearchChange}
          history={this.props.history}></Search>
        <Fragment>
          <List itemslist={res} request={request}
            onChangeOrderBy={this.handleOrderBy}
            history={this.props.history}></List>
          <Pagination itemspage={res} request={request} onChangePageSize={this.handlePageSizeChange}
            onChangePage={this.handleChangePage} onChangePageSizeGo={this.handlePageSizeGo} />
        </Fragment>


      </div>
    );

  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
  filterVoucher: state.voucher.data,
});
const mapDispatchToProps = (dispatch: any) => ({
  getFilterVoucher: (value: object) => dispatch(VoucherFilterValue(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ViewVoucher);
