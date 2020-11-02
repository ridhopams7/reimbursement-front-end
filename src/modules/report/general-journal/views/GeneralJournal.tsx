import React, { Component } from 'react';
import {
  Container, Col, Row,
  Label, Input, Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { SweetAlert } from '../../../../components';
import { HttpService } from '../../../../utilities';
import { PdfViewer, DefaultAction, ReportTitle } from '../../components';
import { reportRoles } from '../../../../config';
import { accountingPeriods } from '../../../../utilities/Master';
import { comboboxFormat, filterFormat } from '../../config';

class GeneralJournal extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAlert: false,
      alertMessage: '',
      combobox: { ...comboboxFormat },
      filter: { ...filterFormat },
      headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      sweetAlert: null,
      pdfSrc: null,
      pdf: null,
      postingStateList: [{ id: '', name: 'All' }, { id: 'UP', name: 'Unposted' }, { id: 'PS', name: 'Posted' }],
      postingState: {},
    }
  }

  componentDidMount = async () => {
    try {
      const { headers, combobox } = this.state;
      const copycombobox = { ...combobox };

      const role = reportRoles.Report_View;
      const headers_ = {
        ...headers,
        role,
      };
      const accountingPeriodList: any = await accountingPeriods(headers_);
      copycombobox.accountingPeriods = accountingPeriodList;
      this.setState({
        combobox: copycombobox,
      });
    } catch (e) {
      console.log(`error at component did mount with error: ${e}`);
    }
  }

  toogleAlert = () => { this.setState({ isAlert: !this.state.isAlert }); }

  hideSweetAlert = () => { this.setState({ sweetAlert: null }); }

  handleChangeInputField = (e: any) => {
    try {
      const { filter, combobox } = this.state;
      const copyData = { ...filter };
      switch (e.target.name) {
        case "accountingPeriodId":
          const accountingPeriods = combobox.accountingPeriods.find((obj: any) => obj.id === e.target.value);
          copyData.accountingPeriodCode = accountingPeriods.code;
          copyData.accountingPeriodName = accountingPeriods.name;
          // copyData.masterName = accountingPeriods.name;
          copyData[e.target.name] = e.target.value;
          break;
        default:
          copyData[e.target.name] = e.target.value;
      }
      this.setState({ flagChange: true, filter: copyData });

    } catch (e) {
      console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
    }
  }

  handleChangeAccountingDate = (e: any) => {
    try {
      const { accountingDateEnd } = this.state;
      const { name, value } = e.target;

      if (name === 'accountingDateStart') {
        const accDateStart = new Date(value).getTime();
        const accDateEnd = new Date(accountingDateEnd).getTime();
        const isStartBiggerThanEnd = accDateStart > accDateEnd;

        if (accountingDateEnd && isStartBiggerThanEnd) {
          this.setState({ accountingDateStart: value, accountingDateEnd: '' });
          return;
        }

        this.setState({ accountingDateStart: value });
        return;
      }

      this.setState({ accountingDateEnd: value });
    } catch (e) {
      console.log(`error at handling change accounting date with error: ${e}`);
    }
  }

  handleGenerateReport = () => {
    try {
      const {
        filter,
        headers
      } = this.state;
      const copyFilter = { ...filter };
      const data = copyFilter;

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

      // const permission = this.props.resAuth.roles.find((obj: any) => obj.role === reportRoles.R_GJ_View);
      const headers_ = {
        ...headers,
        responseType: 'arraybuffer',
        // role: reportRoles.R_GJ_View,
        // permission: permission.permissions[0],
      }

      HttpService.post('report/general-journal', data, headers_)
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

  handleClearForm = () => {
    try {
      // const { organizations } = this.state;

      this.setState({
        filter: { ...filterFormat },
        pdf: null,
        pdfSrc: null,
        postingState: {},
      });

      // if (organizations.length > 1) this.setState({ organization: {} });
    } catch (e) {
      console.log(`error at handling clear form with error: ${e}`);
    }
  }

  render() {
    const {
      isAlert,
      alertMessage,
      pdf,
      pdfSrc,
      sweetAlert,
      filter,
      combobox,
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

        <ReportTitle title="General Journal" />

        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2">
            <Label>
              Accounting Period
            </Label>
          </Col>
          <Col md="4" lg="4">
            <Input
              type="select"
              name="accountingPeriodId"
              onChange={e => this.handleChangeInputField(e)}
              value={filter && filter.accountingPeriodId}
              className="form-tight-space"
            >
              {
                combobox && combobox.accountingPeriods.map((item: any, index: number) => {
                  const {
                    id, name,
                  } = item;
                  return (
                    <option key={index} value={id}>{name}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row>

        {/* <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2">
            <Label>
              Accounting Date
            </Label>
          </Col>
          <Col md="4" lg="4">
            <InputGroup>
              <Label className="label-date-from-to">
                From
              </Label>
              <Input
                type="date"
                className="remove-date-arrow"
                name="accountingDateStart"
                placeholder="date"
                value={accountingDateStart}
                min={accountingPeriod.startDate} // yyyy-mm-dd
                max={accountingPeriod.endDate} // yyyy-mm-dd
                onChange={e => this.handleChangeAccountingDate(e)}
              />
              <Label className="label-date-from-to">
                To
              </Label>
              <Input
                type="date"
                className="remove-date-arrow"
                name="accountingDateEnd"
                placeholder="date"
                value={accountingDateEnd}
                min={accountingDateStart || accountingPeriod.startDate} // yyyy-mm-dd
                max={accountingPeriod.endDate} // yyyy-mm-dd
                onChange={e => this.handleChangeAccountingDate(e)}
              />
            </InputGroup>
          </Col>
        </Row>

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
              <option value="">-- select --</option>
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
              Posting State
            </Label>
          </Col>
          <Col md="4" lg="4">
            <Input
              type="select"
              name="postingState"
              onChange={e => this.handleChangePostingState(e)}
              value={postingState.id || ''}
              className="form-tight-space"
            >
              {
                postingStateList.map((item: any, index: number) => {
                  const {
                    id, name,
                  } = item;
                  return (
                    <option key={index} value={id}>{name}</option>
                  );
                })
              }
            </Input>
          </Col>
        </Row> */}

        <DefaultAction
          handleGenerateReport={this.handleGenerateReport}
          handleClearForm={this.handleClearForm}
        />

        {pdf && (<PdfViewer pdf={pdf} pdfSrc={pdfSrc} />)}
      </Container>
    )
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
  accPeriodAll: state.accPeriodAll.res,
});

export default connect(mapStateToProps)(GeneralJournal);