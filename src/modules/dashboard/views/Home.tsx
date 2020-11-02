/**
* @author: dwi.setiyadi@gmail.com
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, Row, Col, ButtonGroup, Label,
} from 'reactstrap';
// import Moment from 'moment';

import { nowPlayingFetch } from '../ActionDashboard';
import { NOWPLAYINGSUCCESS, NOWPLAYINGFAIL } from '../ConfigDashboard';
// import { Line } from 'react-chartjs-2';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HttpService } from '../../../utilities';
import { approvalCode } from '../../../config';

class DashboardHome extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      action: this.props.action,
      err: this.props.err,
      res: this.props.res,
      headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      small: false,
      isReimbursement: true,
      summary: {
        open: 0,
        needApproval: 0,
        finish: 0,
      }
    };

    this.toggleSmall = this.toggleSmall.bind(this);
  }

  toggleSmall() {
    this.setState({
      small: !this.state.small,
    });
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.action !== prevState.action) {
      let nextErr = prevState.err;
      if (nextProps.action === NOWPLAYINGFAIL) nextErr = nextProps.err;

      let nextRes = prevState.res;
      if (nextProps.action === NOWPLAYINGSUCCESS) nextRes = nextProps.res;

      return {
        action: nextProps.action,
        err: nextErr,
        res: nextRes,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.action !== this.state.action) {
      if (this.state.action === NOWPLAYINGFAIL) {
        this.toggleSmall();
      }
    }
  }
  handleOpenReimbursement = () => {
    try {
      const { isReimbursement } = this.state;
      if (isReimbursement) {
        this.props.history.push('/reimbursement/transaction');
      }
      else {
        this.props.history.push('/reimbursement/approval');
      }

    } catch (e) {
      console.log('error at handleOpenCreate with error: ', e);
    }
  }
  async componentDidMount() {
    // const start = Moment().startOf('month');
    // const end = Moment(start).add(2, 'month');
    // const data = {
    //   'primary_release_date.gte': start.format('YYYY-MM-DD'),
    //   'primary_release_date.lte': end.format('YYYY-MM-DD'),
    // };
    // this.props.onRequest(data);

    const token = this.props.resAuth ? this.props.resAuth.token : null;
    this.initialLoadViewSummary();
    // const missingAuthDataMessage: string = 'Missing auth data. Please login first to get permission to this page';
    if (!token) {
      // console.log(missingAuthDataMessage);
      return;
    }

  }

  initialLoadViewSummary = async () => {
    try {
      const { headers } = this.state;
      const { resAuth } = this.props;
      const { summary } = this.state;
      const copySummary = { ...summary };
      const roles = resAuth.roles[0].role;
      const isReimburse = roles === "Developer" || roles === "UI_UX" || roles === "SA" || roles === "Architect"  ? true : false;
      const statusCode = approvalCode.find((obj: any) => obj.id === roles);
      const status = statusCode === undefined ? '0' : statusCode.code;
      const data = {
        status: status,
        userName: resAuth.userName,
        role: roles,
      }

      const res = await HttpService.post(`reimbursements/summary`, data, headers);
      console.log(res.data.message);
      if (res.status === 200 && res.data) {
        const result = res.data.message;
        copySummary.open = result.open;
        copySummary.needApproval = result.needApproval;
        copySummary.finish = result.finish;
      }

      console.log(copySummary);

      this.setState({ isReimbursement: isReimburse, summary: copySummary });
    } catch (e) {
      console.log('error at initialLoadViewSummary with error: ', e);
    }
  }

  render() {
    const { isReimbursement, summary } = this.state;

    return (
      <div className="animated fadeIn">
        <Row className="mar-bot-10 margin-top-50">
          <Col>
            <Label className="report-title"><b>Summary</b></Label>
          </Col>

        </Row>
        <Row className="text-align-center">
          <Col xs="12">
            {/* <Card> */}
            {/* <CardHeader>
                <i className="fa fa-align-justify" /><strong>Home</strong>
              </CardHeader> */}
            {/* <CardBody> */}
            <Row>
              {isReimbursement &&
                <Col xs="12" sm="6" lg="4">
                  <Card className="text-white bg-info cursor-pointer" onClick={() => this.handleOpenReimbursement()}>
                    <CardBody className="pb-0">
                      <ButtonGroup className="float-right">

                      </ButtonGroup>
                      <div className="text-value">{summary.open}</div>
                      <div style={{ fontSize: '20px' }}>Open</div>
                    </CardBody>
                    <div className="chart-wrapper mx-3" style={{ height: '70px', fontSize: 'xx-large' }}>
                      <FontAwesomeIcon icon={faAddressBook} />
                      {/* <Line data={cardChartData2} options={cardChartOpts2} height={70} /> */}
                    </div>
                  </Card>
                </Col>
              }
              <Col xs="12" sm="6" lg="4">
                <Card className="text-white bg-primary cursor-pointer" onClick={() => this.handleOpenReimbursement()}>
                  <CardBody className="pb-0">
                    <ButtonGroup className="float-right">

                    </ButtonGroup>
                    <div className="text-value">{summary.needApproval}</div>
                    <div style={{ fontSize: '20px' }}>Need Approved</div>
                  </CardBody>
                  <div className="chart-wrapper mx-3" style={{ height: '70px', fontSize: 'xx-large' }}>
                    <FontAwesomeIcon icon={faAddressBook} />
                    {/* <Line data={cardChartData2} options={cardChartOpts2} height={70} /> */}
                  </div>
                </Card>
              </Col>
              {isReimbursement &&
                <Col xs="12" sm="6" lg="4">
                  <Card className="text-white bg-danger cursor-pointer" onClick={() => this.handleOpenReimbursement()}  >
                    <CardBody className="pb-0">
                      <ButtonGroup className="float-right">

                      </ButtonGroup>
                      <div className="text-value">{summary.finish}</div>
                      <div style={{ fontSize: '20px' }}>Finish</div>

                    </CardBody>
                    <div className="chart-wrapper mx-3" style={{ height: '70px', fontSize: 'xx-large' }}>
                      <FontAwesomeIcon icon={faAddressBook} />
                      {/* <Line data={cardChartData2} options={cardChartOpts2} height={70} /> */}
                    </div>
                  </Card>
                </Col>
              }
            </Row>
            {/* </CardBody> */}
            {/* </Card> */}
          </Col>
        </Row>


      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  fetch: state.nowPlaying.fetch,
  res: state.nowPlaying.res,
  err: state.nowPlaying.err,
  action: state.nowPlaying.action,
  resAuth: state.auth.res,
});

const mapDispatchToProps = (dispatch: any) => ({
  onRequest: (value: object) => dispatch(nowPlayingFetch(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHome);
