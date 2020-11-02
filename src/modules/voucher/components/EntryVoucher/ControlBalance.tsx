import React, { Component } from 'react';
import {
  Row, Col,
  Table,
  Container,
} from 'reactstrap';
import {
 thousandSeparator
} from '../../action/Lib';
class ControlBalance extends Component<any, any> {
 
  render() {
    const {
      actualDebit,
      actualCredit,
      budgetDebit,
      budgetCredit,

    } = this.props;

    return (
      <Container
        style={{
          padding: '3px 13px',
        }}
      >
        <Row>
          <Col xs="12">
            <Table hover bordered responsive className="control-balance-table">
              <thead className="bgc-light-gray">
                <tr>
                  <th className="control-balance-th">Actual Debit</th>
                  <th className="control-balance-th">Actual Credit</th>
                  <th className="control-balance-th">Budget Debit</th>
                  <th className="control-balance-th">Budget Credit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="control-balance-td">
                    IDR {thousandSeparator(actualDebit)}
                  </td>
                  <td className="control-balance-td">
                    IDR {thousandSeparator(actualCredit)}
                  </td>
                  <td className="control-balance-td">
                    IDR {thousandSeparator(budgetDebit)}
                  </td>
                  <td className="control-balance-td">
                    IDR {thousandSeparator(budgetCredit)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

    );
  }
}



export default ControlBalance;
