import React, {
  Component,
  Fragment
} from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { HttpService, handleRedirectUser } from '../../../utilities';
import {
  List,
  Pagination,
  Search,
} from '../components';
import {
  JOURNALENDPOINT,
  defaultComboBox,
  defaultFilter,
  defaultRequest,
  initialPage,
  defaultVoucherList,
} from '../config/ConstantsJournal';
import {
  JournalFilterValue
} from '../redux/ActionJournal'
import {
  accountingPeriods,
  organizations,
  changeOrganization,
  getPager,
  getFilterValue,
  isDateFromBigger,
  TransSubCategoriesByOrganization
} from '../helper/Helper';
import { ajRoles } from '../../../config';
import { SweetAlert } from '../../../components';

class SummaryJournal extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      journals: {...defaultVoucherList},
      pager: { ...defaultRequest },
      combobox: { ...defaultComboBox },
      filter: { ...defaultFilter },
      disablecombobox: true,
      disableOrganization: false,
      isAlert: false,
      isRoles: true,
      sweetAlert: null,
    }
  }
  componentDidMount = async () => {
    try {
      const { resAuth } = this.props;
      
      const permission = resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_View);
      
      if (!permission) {
        const data = handleRedirectUser(resAuth);
        
        const { param, url } = data;
        
        const onConfirm = () => { this.props.history.push(url); };
        const onCancel = () => { this.props.history.push(url); };
        
        this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
        return;
      }
      
      this.initialLoadViewSummary();
    } catch (e) {
      console.log('error at component did mount with error: ', e);
    }
  }
  
  initialLoadViewSummary = async () => {
    try {
      let { disablecombobox, disableOrganization, token, combobox } = this.state;
      let copyCombobox = { ...combobox };
      const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_View);
      const copyheaders = {
        ...token,
        role: ajRoles.AJ_View,
        permission: userRoles.permissions[0],
      }
      const copyAccountingPeriods: any = await accountingPeriods(copyheaders);
      copyCombobox.accountingPeriods = [{
        id: "", code: "",
        name: "Select Accounting Period"
      }, ...copyAccountingPeriods];
      if (userRoles) {
        const copyOrganizations: any = await organizations(copyheaders);
        const copyOrganizationId = copyOrganizations[0].id;
        copyCombobox.organizations = [{
          id: "", code: "", name: "Select Organization", codeName: "Select Organization"
        }, ...copyOrganizations];
        
        let filter = { ...defaultFilter };
        if (this.props.filterJournal === null) {
          this.props.getFilterJournal({ ...defaultFilter });
        } else {
          filter = { ...this.props.filterJournal };
        }
        let data = getFilterValue(filter);
        if (this.props.filterJournal === null) {
          this.props.getFilterJournal(filter);
        }
        
        if (copyOrganizations.length > 1) {
          copyCombobox = await changeOrganization("", copyCombobox, copyheaders);
          disablecombobox = true;
          disableOrganization = false;
        } else {
          copyCombobox = await changeOrganization(copyOrganizationId, copyCombobox, copyheaders);
          data.organizationId = copyOrganizationId;
          filter.ddlOrganization = copyOrganizationId;
          disablecombobox = false;
          disableOrganization = true;
        }
        this.setState({ filter, token: copyheaders, disablecombobox, disableorganization: disableOrganization, combobox: copyCombobox });
        this.getJournal(data, initialPage.order, initialPage.direction, initialPage.pagenumber, initialPage.pageSize);
      }
      else {
        this.setState({ isRoles: false });
      }
    } catch (e) {
      console.log('error at initialLoadViewTransDetail with error: ', e);
    }
  }
  toogleAlert = () => {
    this.setState({ isAlert: !this.state.isAlert });
  }
  setPage = (page: number) => {
    try {
      const { journals, pager } = this.state;
      let copyPager = { ...pager };
      const totalresults = journals ? journals.totalElements : 0;
      const pagesize = journals ? journals.pageSize : 0;
      const direction = copyPager && copyPager.direction ? copyPager.direction : initialPage.direction;
      const orderBy = copyPager && copyPager.orderBy ? copyPager.orderBy : initialPage.order;
      let totalPages = Math.ceil(totalresults / pagesize);
      if (page < 1 || page > totalPages) return;
      // get new pager object for specified page
      copyPager = getPager(totalresults, page, pagesize, direction, orderBy);
      this.setState({ pager: copyPager });
    } catch (e) {
      console.log('error at set Page with error: ', e);
    }
  }
  getJournal = async (filterData: any, orderBy: string, direction: string, page: number, pageSize: number) => {
    try {
      const data = {
        ...filterData,
        orderBy,
        direction,
        page,
        pageSize,
      };
      
      const res = await HttpService.post(JOURNALENDPOINT, data, this.state.token);
      const { pager } = this.state;
      const pagenumber: any = pager.currentPage === 0 ? 1 : pager.currentPage;
      if (res.data.statusCode === 200 && res.data.message) {
        this.setState({ journals: res.data.message }, () => this.setPage(pagenumber));
        
      }
    } catch (e) {
      console.log('error at get Journal List with error: ', e);
    }
  }
  handleOrderBy = (pager_: any) => {
    try {
      const { filter } = this.state;
      const data = getFilterValue(filter);
      let pageSize = initialPage.pageSize;
      if (pager_ && pager_.pageSize) {
        pageSize = pager_.pageSize;
      }
      this.getJournal(data, pager_.orderBy, pager_.direction, initialPage.pagenumber, pageSize);
      this.setState({ pager: pager_ });
    } catch (e) {
      console.log('error at handleOrderBy with error: ', e);
    }
  }
  
  handleOnClear = () => {
    try {
      const { pager, combobox, disablecombobox } = this.state;
      const copyCombobox = { ...combobox };
      copyCombobox.transactionsubcategorys =
      [{ id: "", code: "", name: "Select Sub Category" }];
      let isdisabled = disablecombobox;
      
      const filter_ = { ...defaultFilter };
      if (combobox.organizations.length > 2) {
        isdisabled = true;
      }else{
        filter_.ddlOrganization = combobox.organizations[1].id; 
      }
      this.props.getFilterJournal(filter_);
      const accountingPeriod = { startDate: '', endDate: '' };
      const data = getFilterValue(filter_);
      pager['currentPage'] = initialPage.pagenumber + 1;
      pager['orderBy'] = initialPage.order;
      pager['direction'] = initialPage.direction;
      this.setState({
        filter: filter_, pager, isAlert: false, accountingPeriod,
        combobox: copyCombobox, disablecombobox: isdisabled
      });
      this.getJournal(data, initialPage.order, initialPage.direction, initialPage.pagenumber, initialPage.pageSize);
    } catch (e) {
      console.log('error at handleOnClear with error: ', e);
    }
  }
  handleSearchChange = async (event: any) => {
    try {
      event.preventDefault();
      let { filter, disablecombobox, combobox, token } = this.state;
      const { name, value } = event.target;
      let copyCombobox = { ...combobox };
      let copyFilter = { ...filter };
      if (name === "ddlOrganization") {
        if (value && value !== '') {
          copyCombobox = await changeOrganization(value, copyCombobox, token);
          disablecombobox = false;
        } else {
          disablecombobox = true;
        }
        copyFilter[name] = value;
        copyFilter.ddlProduct = '';
        copyFilter.ddlProject = '';
        copyFilter.ddlPosting = '';
        copyFilter.ddlCostCenter = '';
        copyFilter.ddlCategory = '';
        copyFilter.ddlsubCategory = '';
        copyFilter.ddlCustomer = '';
        this.setState({ filter: copyFilter, disablecombobox, combobox: copyCombobox });
      } else if (name === "ddlCategory") {
        
        if (value && value !== '') {
          const copySubTransCategoryList: any = await TransSubCategoriesByOrganization(value, token);
          copyCombobox.transactionsubcategorys =
          [{ id: "", code: "", name: "Select Sub Category" }, ...copySubTransCategoryList];
        }
        else {
          copyCombobox.transactionsubcategorys =
          [{ id: "", code: "", name: "Select Sub Category" }];
        }
        if (copyFilter.ddlCategory !== value) {
          copyFilter.ddlsubCategory = '';
        }
        copyFilter[name] = value;
        this.setState({ filter: copyFilter, combobox: copyCombobox });
      } else {
        copyFilter[name] = value;
        this.setState({ filter: copyFilter });
      }
      
    } catch (e) {
      console.log('error at handleSearchChange with error: ', e);
    }
  }
  handleSearchjournals = (e: any) => {
    try {
      e.preventDefault();
      const { filter, pager } = this.state;
      this.props.getFilterJournal(filter);
      const data = getFilterValue(filter);
      const copyPager = { ...pager };
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
      if (copyPager && copyPager.pageSize) {
        pageSize = copyPager.pageSize;
      }
      let direction = initialPage.direction;
      
      this.getJournal(data, order, direction, currentPage, pageSize);
      copyPager['currentPage'] = currentPage === 0 ? 1 : currentPage;
      copyPager['direction'] = direction;
      copyPager['orderBy'] = order;
      this.setState({ pager: copyPager, isAlert: false });
    } catch (e) {
      console.log('error at handleSearchjournals with error: ', e);
    }
  }
  handleChangePage = (page: number) => {
    try {
      const { pager, filter } = this.state;
      const data = getFilterValue(filter);
      const copyPager = { ...pager };
      let order = initialPage.order;
      if (copyPager && copyPager.orderBy) {
        order = copyPager.orderBy;
      }
      let pageSize = initialPage.pageSize;
      if (copyPager && copyPager.pageSize && copyPager.pageSize !== '') {
        pageSize = copyPager.pageSize;
      }
      let direction = initialPage.direction;
      if (copyPager && copyPager.direction) {
        direction = copyPager.direction;
      }
      copyPager['currentPage'] = page;
      this.setState({ pager: copyPager });
      this.getJournal(data, order, direction, page - 1, pageSize);
    } catch (e) {
      console.log('error at handleChangePage with error: ', e);
    }
  }
  handlePageSizeGo = (e: any) => {
    try {
      e.preventDefault();
      const { pager, filter } = this.state;
      const data = getFilterValue(filter);
      const copyPager = { ...pager };
      let order = initialPage.order;
      if (copyPager && copyPager.orderBy) {
        order = pager.orderBy;
      }
      let currentPage = initialPage.pagenumber;
      let pageSize = initialPage.pageSize;
      if (copyPager && copyPager.pageSize) {
        pageSize = copyPager.pageSize;
      }
      let direction = initialPage.direction;
      if (copyPager && copyPager.direction) {
        direction = copyPager.direction;
      }
      copyPager['pageSize'] = pageSize;
      copyPager['currentPage'] = currentPage + 1;
      this.setState({ pager: copyPager });
      this.getJournal(data, order, direction, currentPage, pageSize);
    } catch (e) {
      console.log('error at handlePageSizeGo with error: ', e);
    }
  }
  handlePageSizeChange = (pager: any) => {
    this.setState({ pager });
  }
  render() {
    const {
      filter,
      combobox,
      disablecombobox,
      disableorganization,
      journals,
      pager,
      accountingPeriod,
      isRoles,
      sweetAlert,
    } = this.state;
    
    if (isRoles) {
      return (
        <div className="animated fadeIn">
        <Alert color="danger" isOpen={this.state.isAlert} toggle={this.toogleAlert} >
        {this.state.alertMessage}</Alert>
        {sweetAlert}
        <Search comboBoxList={combobox}
        filter={filter}
        accountingPeriod={accountingPeriod}
        onSearch={this.handleSearchjournals}
        onClear={this.handleOnClear}
        disablecombobox={disablecombobox}
        disableorganization={disableorganization}
        history={this.props.history}
        onHandleChange={this.handleSearchChange}></Search>
        <Fragment>
        <List
        history={this.props.history}
        journals={journals}
        pager={pager}
        onChangeOrderBy={this.handleOrderBy}
        />
        <Pagination
        journals={journals} pager={pager}
        onChangePage={this.handleChangePage}
        onChangePageSize={this.handlePageSizeChange}
        onChangePageSizeGo={this.handlePageSizeGo}
        />
        </Fragment>
        </div>
        );
      }
      else {
        return (null);
      }
    }
  }
  const mapStateToProps = (state: any) => ({
    resAuth: state.auth.res,
    filterJournal: state.automaticJournal.data,
  });
  
  const mapDispatchToProps = (dispatch: any) => ({
    getFilterJournal: (value: object) => dispatch(JournalFilterValue(value)),
  });
  export default connect(mapStateToProps, mapDispatchToProps)(SummaryJournal);