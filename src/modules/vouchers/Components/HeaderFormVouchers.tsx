import React, { Component } from 'react';
import {
  Row, Col,
  Label,
  Input,
  Container,
  Nav,
  NavItem,
  TabContent,
  NavLink,
} from 'reactstrap';
import { default as NumberFormat } from 'react-number-format';
import { connect } from 'react-redux';
import { journalCategoryList , postingStateList} from '../config/Constants';


class HeaderForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      alert: null,
      headerData: null,
    };
  }

  static getDerivedStateFromProps = (nexProps: any, prevState: any) => {
    if (nexProps.headerData !== prevState.headerData) {
      return {
        headerData: nexProps.headerData,
      }
    }
    return null;
  }

  componentDidMount = () => {
    try {

    } catch (e) {
      console.log(`error at didmount with error : ${e}`);
    }
  }

  handleChangeInputField = (e: any) => {
    try {

      const { headerData, listMaster } = this.props;
      let copy = { ...headerData };
      if (e.target.name === "currencyCode" && e.target.value === 'IDR') {
        copy["exchangeRate"] = '1';
      }
      else if (e.target.name === "productId") {
        const product = listMaster.products.find((obj: any) => obj.id === e.target.value);
        copy["productCode"] = product.code;
        copy["productName"] = product.name;
      }
      else if (e.target.name === "projectId") {
        const project = listMaster.projects.find((obj: any) => obj.id === e.target.value);
        copy["projectCode"] = project.code;
        copy["projectName"] = project.name;
      }
      else if (e.target.name === "costCenterId") {
        const costCenter = listMaster.costcenters.find((obj: any) => obj.id === e.target.value);
        copy["costCenterCode"] = costCenter.code;
        copy["costCenterName"] = costCenter.name;
      }
      else if (e.target.name === "customerId") {
        const customer = listMaster.customers.find((obj: any) => obj.id === e.target.value);
        copy["customerCode"] = customer.code;
        copy["customerName"] = customer.name;
      }
      else if (e.target.name === "accountingPeriodId") {

        const accountingPeriod = listMaster.accountingperiods.find((obj: any) => obj.id === e.target.value);
        if (accountingPeriod.id !== copy["accountingPeriodId"]) {
          copy["accountingDate"] = "";
        }
        copy["accountingPeriodCode"] = accountingPeriod.code;
        copy["accountingPeriodName"] = accountingPeriod.name;
      }
      copy[e.target.name] = e.target.value;
      this.props.handleInputHeader(copy);
    } catch (e) {
      console.log(`error at handleChangeInputField with error : ${e}`);
    }
  }

  handleSubmit = () => {
    console.log('child jalan');
  }

  render() {
   
    const {
      headerData,
      listMaster,
    } = this.props;
    console.log(headerData)
    return (
      <Container
        style={{
          padding: 0,
          overflow: 'hidden'
        }}>
        {this.state.alert}
        <Container
          style={{
            float: 'left',
            width: '50%',
          }}>
          <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
            <Col md="4" lg="4" style={{ alignSelf: 'center' }}>
              <Label style={{ fontSize: 13 }}>Code</Label>
            </Col>
            <Col md="8" lg="8" style={{ alignSelf: 'center' }}>
              <Label style={{ fontSize: 13 }}>
                {
                  headerData && headerData.headerCode
                }
              </Label>
            </Col>
          </Row>

          <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
            <Col md="4" lg="4" style={{ alignSelf: 'center' }}>
              <Label style={{ fontSize: 13 }}>Posting State</Label>
            </Col>
            <Col md="8" lg="8" style={{ alignSelf: 'center' }}>
              <Label style={{ fontSize: 13 }}>
                {
                  headerData && 
                  (headerData.postingState  === "PS" ? 
                   `${postingStateList[headerData.postingState]} - ${headerData.postingCode}` : 
                  postingStateList[headerData.postingState])
                }
              </Label>
            </Col>
          </Row>
          <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
            <Col md="4" lg="4" style={{ alignSelf: 'center' }}>
              <Label style={{ fontSize: 13 }}>Journal Category</Label>
              <span style={{ color: 'red', fontSize: 10 }}>*</span>
            </Col>
            <Col md="4" lg="4" style={{ alignSelf: 'center' }}>
              <Input
                type="select"
                name="journalCategory"
                id="journalCategory"
                onChange={e => this.handleChangeInputField(e)}
                value={headerData && headerData.journalCategory}
                disabled={this.props.operation === "read"}>
                {
                  journalCategoryList.map((item: any, index: number) => {
                    return (
                      <option value={item.id} key={index}>{item.name}</option>
                    );
                  })
                }
              </Input>
            </Col>
          </Row>

          <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
            <Col md="4" lg="4" style={{ alignSelf: 'center' }}>
              <Label style={{ fontSize: 13 }}>
                Accounting Period
                <span style={{ color: 'red', fontSize: 10 }}>*</span>
              </Label>
            </Col>
            <Col md="4" lg="4" style={{ alignSelf: 'center' }}>
              <Input
                type="select"
                name="accountingPeriodId"
                id="accountingPeriodId"
                value={headerData && headerData.accountingPeriodId}
                onChange={e => this.handleChangeInputField(e)}
                disabled={this.props.operation === "read"}>
                {listMaster.accountingperiods &&
                  listMaster.accountingperiods.map((item: any, index: number) => {
                    const { id, name } = item;
                    return (
                      <option value={id} style={{ fontSize: 13 }} key={index}>{name}</option>
                    );
                  })
                }
              </Input>
            </Col>
            <Col md="4" lg="4" style={{ alignSelf: 'center' }}>
              <Input
                type="date"
                id="date-input"
                className="remove-date-arrow"
                name="accountingDate"
                placeholder="date"
                onChange={e => this.handleChangeInputField(e)}
                value={headerData && headerData.accountingDate}
                disabled={this.props.operation === "read"}/>
            </Col>

          </Row>

          <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
            <Col md="4" lg="4" style={{ alignSelf: 'flex-start' }}>
              <Label style={{ fontSize: 13 }}>
                Description
                <span style={{ color: 'red', fontSize: 10 }}>*</span>
              </Label>
            </Col>
            <Col md="8" lg="8" style={{ alignSelf: 'center' }}>
              <Input
                type="textarea"
                name="description"
                id="textarea-input"
                rows="6"
                placeholder="Description"
                onChange={e => this.handleChangeInputField(e)}
                value={headerData && headerData.description}
                style={{ fontSize: 13 }}
                maxLength={300}
                disabled={this.props.operation === "read"}/>
            </Col>
          </Row>
        </Container>
        <Container
          style={{
            float: 'right',
            width: '50%',
          }}
        >
          <Nav tabs>
            <NavItem>
              <NavLink
                active={true}>
                Default Value
                  </NavLink>
            </NavItem>
          </Nav>
          <TabContent>
            <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
              <Col md="3" lg="3" style={{ alignSelf: 'center' }}>
                <Label style={{ fontSize: 13 }}>Organization</Label>
              </Col>
              <Col md="6" lg="6" style={{ alignSelf: 'center' }}>
                <Input
                  type="select"
                  name="organizationId"
                  disabled
                  value={headerData && headerData.organizationId}
                  style={{ fontSize: 13 }}
                >{
                    headerData &&
                    <option value={headerData.organizationId} style={{ fontSize: 13 }}>
                      {`${headerData.organizationCode} - ${headerData.organizationName}`}
                    </option>
                  }
                </Input>
              </Col>
              <Col md="1" lg="1" />
            </Row>

            <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
              <Col md="3" lg="3" style={{ alignSelf: 'center' }}>
                <Label style={{ fontSize: 13 }}>
                  Product
                </Label>
              </Col>
              <Col md="6" lg="6" style={{ alignSelf: 'center' }}>
                <Input
                  type="select"
                  name="productId"
                  style={{ fontSize: 13 }}
                  value={headerData && headerData.productId}
                  onChange={e => this.handleChangeInputField(e)}
                  disabled={this.props.operation === "read"}>
                  {listMaster.products &&
                    listMaster.products.map((item: any, index: number) => {
                      const { id, codeName } = item;
                      return (
                        <option value={id} style={{ fontSize: 13 }} key={index}>{codeName}</option>
                      );
                    })
                  }
                </Input>
              </Col>
              <Col md="1" lg="1" />
            </Row>
            <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
              <Col md="3" lg="3" style={{ alignSelf: 'center' }}>
                <Label style={{ fontSize: 13 }}>
                  Project
                      </Label>
              </Col>
              <Col md="6" lg="6" style={{ alignSelf: 'center' }}>
                <Input
                  type="select"
                  name="projectId"
                  onChange={e => this.handleChangeInputField(e)}
                  value={headerData && headerData.projectId}
                  style={{ fontSize: 13 }}
                  disabled={this.props.operation === "read"}>
                  { listMaster.projects &&
                    listMaster.projects.map((item: any, index: number) => {
                      const { id, codeName } = item;
                      return (
                        <option value={id} style={{ fontSize: 13 }} key={index}>{codeName}</option>
                      );
                    })
                  }
                </Input>
              </Col>
              <Col md="1" lg="1" />
            </Row>

            <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
              <Col md="3" lg="3" style={{ alignSelf: 'center' }}>
                <Label style={{ fontSize: 13 }}>
                  Cost Center
                      </Label>
              </Col>
              <Col md="6" lg="6" style={{ alignSelf: 'center' }}>
                <Input
                  type="select"
                  name="costCenterId"
                  onChange={e => this.handleChangeInputField(e)}
                  value={headerData && headerData.costCenterId}
                  style={{ fontSize: 13 }}
                  disabled={this.props.operation === "read"}>
                  {listMaster.costcenters &&
                    listMaster.costcenters.map((item: any, index: number) => {
                      const { id, codeName } = item;
                      return (
                        <option value={id} style={{ fontSize: 13 }} key={index}>{codeName}</option>
                      );
                    })
                  }
                </Input>
              </Col>
              <Col md="1" lg="1" />
            </Row>
            <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
              <Col md="3" lg="3" style={{ alignSelf: 'center' }}>
                <Label style={{ fontSize: 13 }}>
                  Customer
                </Label>
              </Col>
              <Col md="6" lg="6" style={{ alignSelf: 'center' }}>
                <Input
                  type="select"
                  name="customerId"
                  style={{ fontSize: 13 }}
                  onChange={e => this.handleChangeInputField(e)}
                  value={headerData && headerData.customerId}
                  disabled={this.props.operation === "read"}>
                  {listMaster.customers &&
                    listMaster.customers.map((item: any, index: number) => {
                      const { id, codeName } = item;
                      return (
                        <option value={id} style={{ fontSize: 13 }} key={index}>{codeName}</option>
                      );
                    })
                  }
                </Input>
              </Col>
              <Col md="1" lg="1" />
            </Row>

            <Row style={{ alignContent: 'center', padding: '3px 13px' }}>
              <Col md="3" lg="3" style={{ alignSelf: 'center' }}>
                <Label style={{ fontSize: 13 }}>
                  Exchange Rate
                      </Label>
              </Col>
              <Col md="3" lg="3" style={{ alignSelf: 'center' }}>
                <Input
                  type="select"
                  name="currencyCode"
                  id="currencyCode"
                  value={headerData && headerData.currencyCode}
                  onChange={e => this.handleChangeInputField(e)}
                  disabled={this.props.operation === "read"}>
                  {listMaster.currencies &&
                    listMaster.currencies.map((item: any, index: number) => {
                      return (
                        <option value={item.code} key={index}>{item.code}</option>
                      );
                    })
                  }
                </Input>
              </Col>
              <Col md="3" lg="3" style={{ alignSelf: 'center' }}>
                <NumberFormat
                  name="exchangeRate"
                  placeholder="Rate"
                  thousandSeparator={true}
                  decimalSeparator="."
                  decimalScale={4}
                  allowNegative={false}
                  value={headerData && headerData.exchangeRate}
                  disabled={this.props.operation === "read"}
                  style={{ width: '100%', position: 'relative', height: 30, padding: '0.375rem 0.75rem', borderWidth: 0, borderRadius: '0.25rem' }}
                />
              </Col>
            </Row>

          </TabContent>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

export default connect(mapStateToProps, null)(HeaderForm);
