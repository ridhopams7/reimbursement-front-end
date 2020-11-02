import React, { Component } from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Alert, Label, Input } from "reactstrap";
import { PdfViewer, DefaultAction, ReportTitle } from '../../components';
import { SweetAlert, RequiredMark } from '../../../../components';
import { HttpService, handleRedirectUser } from '../../../../utilities';
import { reportRoles } from '../../../../config';

class GeneralLedger extends Component<any, any> {

  //#region Initiallize
  constructor(props: any) {
    super(props);
    this.state = {
      isAlert: false,
      alertMessage: '',
      accounts: [],
      account: {},
      accountingPeriods: [],
      accountingPeriod: {},
      organizations: [],
      organization: {},
      customers: [],
      customer: {},
      products: [],
      costCenters: [],
      costCenter: {},
      product: {},
      projects: [],
      project: {},
      headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      sweetAlert: null,
      pdfSrc: null,
      pdf: null,
    }
  }

  componentDidMount = async () => {
    try {
      const { resAuth, accountAll, accPeriodAll } = this.props;
      const { headers } = this.state;

      const role = reportRoles.R_GL_View;
      const permission = resAuth.roles.find((obj: any) => obj.role === role);

      if (!permission) {
        const data = handleRedirectUser(resAuth);

        const { param, url } = data;

        const onConfirm = () => { this.props.history.push(url); };
        const onCancel = () => { this.props.history.push(url); };

        this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
        return;
      }

      const headers_ = {
        ...headers,
        role,
        permission: permission.permissions[0],
      };

      const resOrganization = await HttpService.get('organizations/permission', null, headers_);
      const organizationAll = resOrganization.data.organization;

      const organizations = organizationAll ? [...organizationAll] : [];
      let organization = organizations[0];

      if (organizations.length > 1) organization = {};

      this.setState({
        organizations,
        organization,
        accountingPeriods: accPeriodAll || [],
        accounts: accountAll || [],
      });
    } catch (e) {
      console.log('error at init load with error: ', e);
    }
  }
  //#endregion

  //#region event handler
  handleChangeOrganization = (e: any) => {
    try {
      const { organizations } = this.state;

      if (organizations.length === 1) return;

      let organization = organizations.find((obj: any) => obj.id === e.target.value);

      if (!organization) {
        organization = {};
        this.setState({
          organization,
          costCenter: {},
          customer: {},
          product: {},
          project: {},
          products: [],
          projects: [],
          customers: [],
        });
        return;
      }

      this.setState({ organization });
      this.getFndDataByOrganization(organization);
    } catch (e) {
      console.log(`error at handling change organization with error: ${e}`);
    }
  }

  getFndDataByOrganization = async (organization: any) => {
    try {
      const { resAuth } = this.props;
      const { headers } = this.state;

      if (!organization || Object.keys(organization).length === 0 || !organization.id) return;

      const permission = resAuth.roles.find((obj: any) => obj.role === reportRoles.R_GL_View);
      const headers_ = {
        ...headers,
        role: reportRoles.R_GL_View,
        permission: permission.permissions[0],
      }

      const products = await HttpService.get(`organizations/${organization.id}/products`, null, headers_);
      const projects = await HttpService.get(`organizations/${organization.id}/projects`, null, headers_);
      const costCenters = await HttpService.get(`organizations/${organization.id}/cost-centers`, null, headers_);
      const customers = await HttpService.get(`organizations/${organization.id}/customers`, null, headers_);

      this.setState({
        products: products.data.products,
        projects: projects.data.projects,
        costCenters: costCenters.data.costCenters,
        customers: customers.data.customers,
      });
    } catch (e) {
      console.log(`error at getFndDataByOrganization with error: ${e}`);
    }
  }

  handleChangeInputForm = (e: any) => {
    let errorAt: string = '';
    try {
      const { accountingPeriods, accounts, products, projects, costCenters, customers } = this.state;
      const { value, name } = e.target;

      let val = undefined;
      errorAt = name;

      switch (name) {
        case 'accountingPeriod':
          val = accountingPeriods.find((obj: any) => obj.id === value);
          break;
        case 'account':
          val = accounts.find((obj: any) => obj.id === value);
          break;
        case 'product':
          val = products.find((obj: any) => obj.id === value);
          break;
        case 'project':
          val = projects.find((obj: any) => obj.id === value);
          break;
        case 'costCenter':
          val = costCenters.find((obj: any) => obj.id === value);
          break;
        case 'customer':
          val = customers.find((obj: any) => obj.id === value);
          break;
        default:
          break;
      }

      if (!val) val = {};

      this.setState({ [name]: val });
    } catch (e) {
      console.log(`error at ${errorAt} with error: ${e}`);
    }
  }

  handleValidateInputForm = () => {
    try {
      const { organization, isAlert } = this.state;

      let isOrganizationEmpty: boolean = false;

      if (Object.keys(organization).length === 0) isOrganizationEmpty = true;

      let alertMessage = '';
      if (isOrganizationEmpty) {
        alertMessage = `Organization cannot be empty.`;

        if (isAlert) {
          this.setState({ alertMessage });
          return false;
        }

        this.setState({ alertMessage }, () => { this.toogleAlert(); });
        return false;
      }

      this.setState({ alertMessage }, () => { if (isAlert) this.toogleAlert(); });
      return true;
    } catch (e) {
      console.log(`error at handling validate input form with error: ${e}`);
    }
  }

  handleClearForm = () => {
    try {
      const { organizations } = this.state;

      this.setState({
        accountingPeriod: {},
        account: {},
        costCenter: {},
        customer: {},
        product: {},
        project: {},
        pdf: null,
        pdfSrc: null,
        products: [],
        projects: [],
        costCenters: [],
        customers: [],
      });

      if (organizations.length > 1) this.setState({ organization: {} });
    } catch (e) {
      console.log(`error at handling clear form with error: ${e}`);
    }
  }

  handleGenerateReport = () => {
    try {
      const {
        accountingPeriod, organization,
        headers, account, customer,
        costCenter, product, project,
      } = this.state;

      const isPassed = this.handleValidateInputForm();

      if (!isPassed) return;

      const data = {
        accountingPeriod,
        organization,
        account,
        customer,
        costCenter,
        product,
        project,
      }

      let message = 'The report is being generated. Please wait a moment';

      let param = {
        type: 'info',
        title: 'Please wait...',
        message,
        showCancel: false,
        showConfirm: false,
        focusConfirmBtn: false,
      };

      const onConfirm = () => { this.hideSweetAlert(); };
      const onCancel = () => { this.hideSweetAlert() };

      const permission = this.props.resAuth.roles.find((obj: any) => obj.role === reportRoles.R_GL_View);
      const headers_ = {
        ...headers,
        responseType: 'arraybuffer',
        role: reportRoles.R_GL_View,
        permission: permission.permissions[0],
      }

      HttpService.post('report/general-ledger', data, headers_)
        .then((res: any) => {
          // console.log('res: ', res);
          if (res.data.src) {
            const contentType = res.headers['content-type'];
            const fileName = (res.headers['content-disposition']).split('= ')[1];

            const pdf = res.data.src;

            const pdfSrc = {
              src: `data:;base64,${Buffer.from(res.data.src).toString('base64')}`,
              fileName,
              contentType,
            };

            this.setState({
              pdf: null,
              pdfSrc: null,
            }, () => {
              this.setState({
                pdf,
                pdfSrc,
              })
            });

            this.hideSweetAlert();
            return;
          }

          message = res.data.message;
          param.type = 'error';
          param.title = 'Sorry...';
          param.message = message;

          this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
        })
        .catch((err: any) => {
          console.log('err: ', err);
        });

      this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
    } catch (e) {
      console.log(`error at handling generate report with error: ${e}`);
    }
  }
  //#endregion

  //#region Properties
  toogleAlert = () => { this.setState({ isAlert: !this.state.isAlert }); }

  hideSweetAlert = () => { this.setState({ sweetAlert: null }); }
  //#endregion

  render() {
    const {
      accounts, account,
      accountingPeriods, accountingPeriod,
      costCenters, costCenter,
      customers, customer,
      organizations, organization,
      isAlert, alertMessage, sweetAlert,
      pdf, pdfSrc,
      products, product,
      projects, project,
    } = this.state;

    return (
      <Container>
        {sweetAlert}
        {
          isAlert && (
            <Row>
              <Col>
                <Alert color="danger" isOpen={isAlert} toggle={this.toogleAlert}>
                  {alertMessage}
                </Alert>
              </Col>
            </Row>
          )
        }

        <ReportTitle title="General Ledger" />

        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2" className="align-self-center">
            <Label>
              Organization <RequiredMark />
            </Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="select"
              name="organization"
              disabled={organizations.length === 1}
              className="form-tight-space"
              onChange={e => this.handleChangeOrganization(e)}
              value={organization.id || ''}
            >
              <option value="">-- Select --</option>
              {
                organizations.map((item: any, index: number) => {
                  const {
                    id, code, name,
                  } = item;
                  return (
                    <option key={index} value={id}>{code} - {name}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row>
        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2">
            <Label>
              Accounting Period
            </Label>
          </Col>
          <Col md="4" lg="4">
            <Input
              type="select"
              name="accountingPeriod"
              onChange={e => this.handleChangeInputForm(e)}
              value={accountingPeriod.id || ''}
              className="form-tight-space"
            >
              <option value="">All</option>
              {
                accountingPeriods.map((item: any, index: number) => {
                  const {
                    id, code,
                  } = item;
                  return (
                    <option key={index} value={id}>{code}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row>
        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2" className="align-self-center">
            <Label>
              Account
            </Label>
          </Col>
          <Col md="4" lg="4">
            <Input
              type="select"
              name="account"
              onChange={e => this.handleChangeInputForm(e)}
              value={account.id || ''}
              className="form-tight-space"
            >
              <option value="">All</option>
              {
                accounts.map((item: any, index: number) => {
                  const {
                    id, code, description
                  } = item;
                  return (
                    <option key={index} value={id}>{code} - {description}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row>
        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2">
            <Label>
              Product
            </Label>
          </Col>
          <Col md="4" lg="4">
            <Input
              type="select"
              name="product"
              onChange={e => this.handleChangeInputForm(e)}
              value={product.id || ''}
              className="form-tight-space"
              disabled={Object.keys(organization).length === 0 && products.length === 0}
            >
              <option value="">All</option>
              {
                products.map((item: any, index: number) => {
                  const {
                    id, code, name
                  } = item;
                  return (
                    <option key={index} value={id}>{code} - {name}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row>
        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2">
            <Label>
              Project
            </Label>
          </Col>
          <Col md="4" lg="4">
            <Input
              type="select"
              name="project"
              onChange={e => this.handleChangeInputForm(e)}
              value={project.id || ''}
              className="form-tight-space"
              disabled={Object.keys(organization).length === 0 && products.length === 0}
            >
              <option value="">All</option>
              {
                projects.map((item: any, index: number) => {
                  const {
                    id, code, name
                  } = item;
                  return (
                    <option key={index} value={id}>{code} - {name}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row>
        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2">
            <Label>
              Cost Center
            </Label>
          </Col>
          <Col md="4" lg="4">
            <Input
              type="select"
              name="costCenter"
              onChange={e => this.handleChangeInputForm(e)}
              value={costCenter.id || ''}
              className="form-tight-space"
              disabled={Object.keys(organization).length === 0 && products.length === 0}
            >
              <option value="">All</option>
              {
                costCenters.map((item: any, index: number) => {
                  const {
                    id, code, name
                  } = item;
                  return (
                    <option key={index} value={id}>{code} - {name}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row>
        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2">
            <Label>
              Customer
            </Label>
          </Col>
          <Col md="4" lg="4">
            <Input
              type="select"
              name="customer"
              onChange={e => this.handleChangeInputForm(e)}
              value={customer.id || ''}
              className="form-tight-space"
              disabled={Object.keys(organization).length === 0 && products.length === 0}
            >
              <option value="">All</option>
              {
                customers.map((item: any, index: number) => {
                  const {
                    id, code, name
                  } = item;
                  return (
                    <option key={index} value={id}>{code} - {name}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row>

        <DefaultAction handleGenerateReport={this.handleGenerateReport} handleClearForm={this.handleClearForm} />

        {pdf && (<PdfViewer pdf={pdf} pdfSrc={pdfSrc} />)}
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
  accPeriodAll: state.accPeriodAll.res,
  accountAll: state.account.res,
});

export default connect(mapStateToProps)(GeneralLedger);
