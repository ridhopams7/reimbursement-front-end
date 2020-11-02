import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'reactstrap';
import { HttpService } from '../../../utilities';
import { VOUCHERLISTENDPOINT } from '../config/Constants';
import Moment from 'moment';

class SummaryVouchers extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      vouchers: [],
    }
  }
  componentDidMount = async () => {
    const res = await HttpService.post(VOUCHERLISTENDPOINT, null, this.state.token);
    this.setState({ vouchers: res.data });
  }

  handleOpenDetail = (headerId: any, isPost: any) => {
    if (headerId) {
      if (isPost === "PS") {
        this.props.history.push(`/sample-crud/read/${headerId}`);
      }
      else {
        this.props.history.push(`/sample-crud/update/${headerId}`);
      }
    }
    else {
      this.props.history.push(`/sample-crud/create`);
    }
  }

  render() {
    return (
      <div>
        <Button type="submit" onClick={() => this.handleOpenDetail("","")} color="info"><i className="fa fa-plus"></i> Create New Transaction </Button>
        <Table hover bordered responsive size="sm" style={{ backgroundColor: "white" }} >
          <thead>
            <tr >
              <th style={{ minWidth: 40, textAlign: "center", verticalAlign: "middle", }}>No</th>
              <th style={{ minWidth: 170, textAlign: "center", verticalAlign: "middle", cursor: "pointer", }}
              >Code&nbsp;&nbsp;</th>
              <th style={{ minWidth: 100, textAlign: "center", verticalAlign: "middle", cursor: "pointer", }}
              >Accounting Period&nbsp;&nbsp;</th>
              <th style={{ minWidth: 100, textAlign: "center", verticalAlign: "middle", cursor: "pointer", }}
              >Accounting Date&nbsp;&nbsp;</th>
              <th style={{ minWidth: 200, maxWidth: 400, textAlign: "center", verticalAlign: "middle", cursor: "pointer", }}
              >Description&nbsp;&nbsp;</th>
              <th style={{ minWidth: 100, textAlign: "center", verticalAlign: "middle", cursor: "pointer", }}
              >Posting State&nbsp;&nbsp;</th>
              <th style={{ minWidth: 100, textAlign: "center", verticalAlign: "middle", cursor: "pointer", }}
              >Journal Category&nbsp;&nbsp;</th>
              <th style={{ minWidth: 100, textAlign: "center", verticalAlign: "middle", cursor: "pointer", }}
              >Actual Debit&nbsp;&nbsp;</th>
              <th style={{ minWidth: 100, textAlign: "center", verticalAlign: "middle", cursor: "pointer", }}
              >Actual Credit&nbsp;&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.state.vouchers.content && this.state.vouchers.content.map((voucher: any, key: number) =>
              <tr className="tableodd" key={key}
                onClick={() => this.handleOpenDetail(voucher.headerId, voucher.postingState)}
                style={{ cursor: "pointer" }}  >
                <td style={{ textAlign: "center" }}>{key + (this.state.vouchers.page * this.state.vouchers.pageSize + 1)}.</td>
                <td>{voucher.headerCode}</td>
                <td style={{ textAlign: "center" }}>{voucher.accountingPeriodCode}</td>
                <td style={{ textAlign: "center" }}>{voucher.accountingDate ? Moment(voucher.accountingDate).format("DD-MMM-YYYY") : ""}</td>
                <td>{voucher.description}</td>
                <td style={{ textAlign: "center" }}>{voucher.postingState}</td>
                <td style={{ textAlign: "center" }}>{voucher.journalCategory}</td>
                <td style={{ textAlign: "right" }}>{voucher.actualAccountedDr}</td>
                <td style={{ textAlign: "right" }}>{voucher.actualAccountedCr}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});
export default connect(mapStateToProps)(SummaryVouchers);