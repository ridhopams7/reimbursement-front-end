
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  initialPage,
  defaultRequest, defaultFilter, defaultRoleList, ROLEENDPOINT,
} from '../config/Constants';
import { List, Pagination, Search } from '../components';
import { Alert } from 'reactstrap';
import { HttpService, handleRedirectUser } from '../../../utilities';
import { getPager, getFilterValue, messageAction } from '../action/Lib';
import { SweetAlert } from '../../../components';
// import { VoucherFilterValue } from '../redux/ActionVoucher'
// import moment from 'moment';

class ListRole extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      action: '',
      err: '',
      res: { ...defaultRoleList },
      headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      request: { ...defaultRequest },
      filter: { ...defaultFilter },
      isAlert: false,
      alertMessage: '',
      sweetAlert: null,
    };
  }

  componentDidMount = async () => {
    try {
      // const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_View);
      // if (!userRoles) {
      //   this.handleRedirectUser();
      //   return;
      // }
      this.initialLoadViewSummary();
    } catch (e) {
      console.log('error at component did mount with error: ', e);
    }
  }

  initialLoadViewSummary = async () => {
    try {
      const { headers } = this.state;
      // const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_View);
      const copyheaders = {
        ...headers,
        // role: voucherRoles.V_View,
        // permission: userRoles.permissions[0],
      }
      let { disablecombobox } = this.state;
      let filter = { ...defaultFilter };
      if (this.props.filterVoucher === null) {
        this.props.getFilterVoucher({ ...defaultFilter });
      } else {
        filter = { ...this.props.filterVoucher };
      }
      const data = getFilterValue(filter);

      await this.getRoleDatas(data, initialPage.order, initialPage.direction, initialPage.pagenumber, initialPage.pageSize, copyheaders);

      this.setState({ filter, headers: copyheaders, disablecombobox });
    } catch (e) {
      console.log('error at initialLoadViewVoucherDetail with error: ', e);
    }
  }
  hideSweetAlert = () => {
    this.setState({
      sweetAlert: null,
    });
  }
  setSweetAlert = (param: any, roleDataId: string) => {
    let onConfirm = null;

    onConfirm = () => { this.handleRemoveTransaction(roleDataId) };


    const onCancel = () => { this.hideSweetAlert() };

    this.setState({
      sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
    });
  }

  handleRemoveTransaction = async (roleDataId: string) => {
    try {
      const { headers } = this.state;
      // const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Remove);
      const token: any = { ...headers };
      const copyheaders = {
        Authorization: token.Authorization,
        // role: voucherRoles.V_Remove,
        // permission: userRoles.permissions[0],
      }
      await HttpService.delete(`role/${roleDataId}`, null, copyheaders)
        .then((res: any) => {
          const params = messageAction(res, "Deleted");
          let filter = { ...defaultFilter };
          const data = getFilterValue(filter);
          let onConfirm = async () => {
            this.hideSweetAlert();
            await this.getRoleDatas(data, initialPage.order, initialPage.direction, initialPage.pagenumber, initialPage.pageSize, null);
          };
          let onCancel = () => {
            this.hideSweetAlert();
          };
          if (!params.isSucces) {
            onConfirm = async () => { this.hideSweetAlert(); };
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


  getRoleDatas = async (filterData: any, orderBy: string, direction: string, page: number, pageSize: number, headers: any) => {
    try {
      const data = {
        ...filterData,
        orderBy,
        direction,
        page,
        pageSize,
      };

      const res = await HttpService.post(ROLEENDPOINT, data, headers);
      //  console.log(res);
      const { request } = this.state;
      const pagenumber: any = request.currentPage === 0 ? 1 : request.currentPage;

      const roles = { ...defaultRoleList };
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
      this.setState({ res: roles, alertMessage: errorMessage, isAlert: true }, () => {
        window.scrollTo({ top: 0 });
      });
    } catch (e) {
      console.log('error at get Journal List with error: ', e);
    }
  }

  handleSearchChange = (event: any) => {
    try {
      event.preventDefault();
      let { filter } = this.state;
      const { name, value } = event.target;
      const copyFilter = { ...filter };
      copyFilter[name] = value;
      this.setState({ filter: copyFilter })
    } catch (e) {
      console.log('error at handleSearchChange with error: ', e);
    }

  }


  handleOnClear = () => {
    try {
      const { request, headers } = this.state;
      const filter_ = { ...defaultFilter };
      const data = getFilterValue(filter_);
      request['currentPage'] = initialPage.pagenumber + 1;
      request['orderBy'] = initialPage.order;
      request['direction'] = initialPage.direction;
      this.setState({ filter: filter_, request, isAlert: false });
      this.getRoleDatas(data, initialPage.order, initialPage.direction, initialPage.pagenumber, initialPage.pageSize, headers);
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
      this.getRoleDatas(data, order, direction, page - 1, pageSize, headers);
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
      this.getRoleDatas(data, order, direction, currentPage, pageSize, headers);
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

      this.getRoleDatas(data, order, direction, currentPage, pageSize, headers);
      request['direction'] = direction;
      request['orderBy'] = order;
      request['currentPage'] = 1;
      this.setState(request);
    } catch (e) {
      console.log('error at handleChangePage with error: ', e);
    }

  }

  handleSearchData = (e: any) => {
    try {
      e.preventDefault();

      const { filter, request, headers } = this.state;
      console.log(filter);
      // this.props.getFilterVoucher(filter);
      const data = getFilterValue(filter);
      // if (data.createdDateFrom !== '' && data.createdDateTo !== '') {
      //   if (isDateFromBigger(data.createdDateFrom, data.createdDateTo)) {
      //     this.setState({ alertMessage: 'Created Date To must be greater than Created Date From', isAlert: true });
      //     window.scrollTo({ top: 0 });
      //     return;
      //   }
      // }

      let order = initialPage.order;
      let currentPage = initialPage.pagenumber;
      let pageSize = initialPage.pageSize;
      if (request && request.pageSize) {
        pageSize = request.pageSize;
      }
      let direction = initialPage.direction;

      this.getRoleDatas(data, order, direction, currentPage, pageSize, headers);

      request['currentPage'] = currentPage === 0 ? 1 : currentPage;
      request['direction'] = direction;
      request['orderBy'] = order;
      this.setState({ request, isViewList: true, isAlert: false });
    } catch (er) {
      console.log('error at handleChangePage with error: ', er);
    }

  }

  render() {
    const { res, request, filter, sweetAlert } = this.state;

    return (
      <div className="animated fadeIn">

        <Alert color="danger" isOpen={this.state.isAlert} toggle={this.toogleAlert} >
          {this.state.alertMessage}</Alert>
        {sweetAlert}
        <Search filter={filter} history={this.props.history}
          onSearch={this.handleSearchData}
          onClear={this.handleOnClear}
          onHandleChange={this.handleSearchChange}></Search>
        <Fragment>
          <List itemslist={res} request={request}
            onChangeOrderBy={this.handleOrderBy}
            setSweetAlert={(param: any, roleDataId: string) => this.setSweetAlert(param, roleDataId)}
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
});

export default connect(mapStateToProps)(ListRole);
