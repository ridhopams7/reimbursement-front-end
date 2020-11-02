import React, { Component } from 'react';
import {
  Row,
  Col, Input, Button, Table, Label, Card, Container, CardBody,
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import ModalDataLine from './ModalDataLine';
import { default as NumberFormat } from 'react-number-format';
import { journalEntryTypeList } from '../../../voucher/config/Constants';
import Select from 'react-virtualized-select';


class DataLineTab extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataLine: {},
      mapDataLine: [],
      mapDataLineTemp: [],
      alert: null,
      isAddDataLine: false,
    }
  }

  static getDerivedStateFromProps = (props: any, state: any) => {
    if (props.dataLine[props.type] !== state.dataLine[props.type]) {
      return {
        dataLine: props.dataLine,
        mapDataLine: props.dataLine.actual,

      }
    }
    return null;
  }
  componentDidUpdate = (props: any, state: any) => {
    const { isAddDataLine, mapDataLine } = state;
    if (isAddDataLine) {
      const el = document.getElementById(`actual${mapDataLine.length}`);
      if (el) {
        el.focus();
      }
      this.setState({ isAddDataLine: false });
    }
  }


  handleAddDataLine = () => {
    const {
      type,
    } = this.props;
    let isActual = true
    if (type === 'budget') {
      isActual = false;
    }
    this.setState({ isAddDataLine: true }, () => this.props.onAddDataLine(isActual));
  }

  handleDeleteDataLine = (index: number) => {
    this.props.onDeleteDataLine(true, index);
  }

  openAtrributeModal = (index: number, typeSet: string) => {
    try {
      const { mapDataLine } = this.state;
      const listAttribute = mapDataLine[index].attributeField;
      const listReference = mapDataLine[index].referenceField;

      const param = {
        type: 'default',
        title: typeSet,
        confirmBtnBsStyle: 'primary',
        listAttribute,
        listReference,
        typeSet,
        indexLine: index,
        focusConfirmBtn: false,
      };
      const onConfirm = () => { this.handleSubmitModal() };
      const onCancel = () => { this.handleCancelModal() };
      this.setState({
        alert: this.returnAttributeSweetAlert(param, onConfirm, onCancel),
      });

    } catch (e) {
      console.log('error at openAtrributeModal with error: ', e);
    }
  }

  handleChangeInputModal = (dataLine: any) => {
    try {
      const DataLineCopy = [...dataLine];
      this.setState({ mapDataLineTemp: DataLineCopy });

    } catch (e) {
      console.log('error at handleChangeInputModal with error: ', e);
    }
  }
  handleSubmitModal = () => {
    try {
      const { mapDataLineTemp } = this.state;
      const copyData = [...mapDataLineTemp];

      this.props.onSubmitModal(copyData);
      this.hideSweetAlert();
    } catch (e) {
      console.log('error at handleSubmitModal with error: ', e);
    }
  }

  returnAttributeSweetAlert = (param: any, onConfirm: any, onCancel: any) => {
    let {
      type, title, confirmBtnBsStyle,
      focusConfirmBtn,
      listAttribute,
      listReference,
      typeSet,
      indexLine
    } = param;
    const { mapDataLineTemp, mapDataLine } = this.state;
    const { isViewTransDetailMode } = this.props;
    const dataLineTemp = [...mapDataLine];
    let confirmBtnText = "Set";
    if (typeSet === "Attribute") {
      confirmBtnText = mapDataLine[indexLine].ischangeAttribute ? "Change" : "Set";
    }
    else {
      confirmBtnText = mapDataLine[indexLine].ischangeReference ? "Change" : "Set";
    }
    // type='default' || 'info' || 'success' || 'warning' || 'danger' || 'custom'
    return (
      <SweetAlert
        type={type}
        title={title}
        confirmBtnText={confirmBtnText}
        confirmBtnBsStyle={confirmBtnBsStyle || 'default'}
        cancelBtnText={isViewTransDetailMode ? 'Close' : 'Cancel'}
        cancelBtnBsStyle={isViewTransDetailMode ? 'primary' : 'default'}
        focusConfirmBtn={focusConfirmBtn}
        showConfirm={!isViewTransDetailMode}
        showCancel={true}
        allowEscape
        closeOnClickOutside
        onConfirm={() => onConfirm()}
        onCancel={() => onCancel()}
      >
        {(listAttribute.length > 0 || listReference.length > 0) &&

          <ModalDataLine
            isViewTransDetailMode={isViewTransDetailMode}
            dataLineTemp={dataLineTemp}
            dataLineModalTemp={mapDataLineTemp}
            listAttribute={listAttribute}
            listReference={listReference}
            onChangeInputModal={(e: any) => this.handleChangeInputModal(e)}
            typeSet={typeSet}
            indexLine={indexLine}>
          </ModalDataLine>
        }
      </SweetAlert>
    );
  }

  hideSweetAlert = () => {
    this.setState({ alert: null });
  }
  handleCancelModal = () => {
    let { mapDataLine } = this.state;
    this.props.onSubmitModal(mapDataLine);
    this.setState({ alert: null });
  }

  renderValue(option: any) {
    return <p style={{ color: option.color }}>{option.code}</p>;
  }
  render() {
    const {
      mapDataLine,
      // openModal
    } = this.state;

    const {
      listProduct,
      listProject,
      listCostCenter,
      listCustomer,
      listCurrency,
      listAccount,
      selectedOrganization,
      isViewTransDetailMode,
    } = this.props;

    return (
      <Container className="container-line-tab">
        {this.state.alert}

        <Row className="row-line-tab">
          <Col xs="12" md="12">
            <Card>
              <CardBody>
                <Row>
                  <Col xs="12">
                    <Table hover bordered striped responsive>
                      <thead>
                        <tr>
                          <th className="data-line-th">No.</th>
                          <th className="data-line-th min-width-120">Account</th>
                          <th className="data-line-th min-width-220">Description</th>
                          <th className="data-line-th min-width-150">Debit</th>
                          <th className="data-line-th min-width-150">Credit</th>
                          <th className="data-line-th min-width-60">Currency</th>
                          <th className="data-line-th min-width-150">Exchange Rate</th>
                          <th className="data-line-th min-width-150">Acc Debit</th>
                          <th className="data-line-th min-width-150">Acc Credit</th>
                          <th className="data-line-th min-width-200">Organization</th>
                          <th className="data-line-th min-width-120">Product</th>
                          <th className="data-line-th min-width-120">Project</th>
                          <th className="data-line-th min-width-120">Cost Center</th>
                          <th className="data-line-th min-width-120">Customer</th>
                          <th className="data-line-th min-width-100">Journal Entry Type</th>
                          <th className="data-line-th">Attributes</th>
                          <th className="data-line-th">References</th>
                          {
                            !isViewTransDetailMode && (
                              <th className="data-line-th">Action</th>
                            )}
                        </tr>
                      </thead>
                      <tbody>
                        {
                          mapDataLine.map((item: any, index: number) => {
                            const order = index;
                            const {
                              account,
                              enteredDebit,
                              enteredCredit,
                              currency,
                              exchangeRate,
                              accountedDebit,
                              accountedCredit,
                              product,
                              project,
                              costCenter,
                              customer,
                              isIDR,
                              attributeField,
                              referenceField,
                              ischangeAttribute,
                              ischangeReference,
                              description,
                              journalEntryType
                            } = item;

                            return (
                              <tr key={order}>
                                <td className="data-line-td">
                                  {index + 1}
                                </td>
                                <td className="data-line-td">
                                  <Select
                                    valueRenderer={this.renderValue}
                                    value={account.id}
                                    className="text-align-left"
                                    disabled={isViewTransDetailMode}
                                    clearable={false}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'accountid')}
                                    options={listAccount.map((account: any) => ({ value: account.id, label: account.codeName, code: account.code }))}
                                    id={`actual${index + 1}`}
                                  />
                                </td>
                                <td className="data-line-td">
                                  <Input
                                    type="text"
                                    id="text-input"
                                    value={description}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'description')}
                                    placeholder="Description"
                                    disabled={isViewTransDetailMode || account.id === ""}
                                    className="height-30"
                                    maxLength={300}
                                  />
                                </td>
                                <td className="data-line-td">
                                  <NumberFormat
                                    placeholder="Debit"
                                    thousandSeparator={true}
                                    decimalSeparator="."
                                    decimalScale={4}
                                    value={enteredDebit || ''}
                                    disabled={isViewTransDetailMode || account.id === ""}
                                    // allowNegative={(isCorrection || parseFloat(enteredDebit) < 0) ? true : false}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'enteredDebit')}
                                    className="input-number-format" />
                                </td>
                                <td className="data-line-td">
                                  <NumberFormat
                                    placeholder="Credit"
                                    thousandSeparator={true}
                                    decimalSeparator="."
                                    decimalScale={4}
                                    value={enteredCredit || ''}
                                    disabled={isViewTransDetailMode || account.id === ""}
                                    // allowNegative={(isCorrection || parseFloat(enteredCredit) < 0) ? true : false}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'enteredCredit')}
                                    className="input-number-format" />
                                </td>

                                <td className="data-line-td">
                                  <Input
                                    type="select"
                                    className="data-line-input-select"
                                    value={currency.code || ''}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'currency')}
                                    disabled={isViewTransDetailMode || account.id === ""}
                                  >
                                    {
                                      listCurrency.map((item: any, index: number) => {
                                        const { code } = item;

                                        if (isViewTransDetailMode || !listCurrency.find((obj: any) => obj.code === currency.code)) {
                                          return (
                                            <option value={currency.code} key={index}>{currency.code}</option>
                                          );
                                        }
                                        return (
                                          <option value={code} key={index}>{code}</option>
                                        );
                                      })
                                    }
                                  </Input>
                                </td>
                                <td className="data-line-td">
                                  <NumberFormat
                                    placeholder="Exchange Rate"
                                    thousandSeparator={true}
                                    decimalSeparator="."
                                    decimalScale={4}
                                    disabled={isViewTransDetailMode || account.id === "" || isIDR}
                                    value={exchangeRate}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'exchangeRate')}
                                    className="input-number-format"
                                  />
                                </td>
                                <td className="data-line-td">
                                  <NumberFormat
                                    placeholder="Acc. Debit"
                                    thousandSeparator={true}
                                    decimalSeparator="."
                                    decimalScale={4}
                                    disabled
                                    value={accountedDebit}
                                    className="input-number-format" />
                                </td>
                                <td className="data-line-td">
                                  <NumberFormat
                                    placeholder="Acc. Credit"
                                    thousandSeparator={true}
                                    decimalSeparator="."
                                    decimalScale={4}
                                    disabled
                                    value={accountedCredit}
                                    className="input-number-format"
                                  />
                                </td>
                                <td className="data-line-td">
                                  <Input
                                    type="select"
                                    className="text-align-left"
                                    disabled
                                  >
                                    <option value={selectedOrganization.id} className="font-size-13">
                                      {`${selectedOrganization.code} - ${selectedOrganization.name}`}
                                    </option>
                                  </Input>
                                </td>
                                <td className="data-line-td">
                                  <Select
                                    value={product.id}
                                    valueRenderer={this.renderValue}
                                    className="text-align-left"
                                    disabled={isViewTransDetailMode || account.id === ""}
                                    clearable={false}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'productId')}
                                    options={listProduct.map((product: any) => ({ value: product.id, label: product.codeName, code: product.code }))}
                                  />


                                </td>
                                <td className="data-line-td">
                                  <Select
                                    value={project.id}
                                    valueRenderer={this.renderValue}
                                    className="text-align-left"
                                    disabled={isViewTransDetailMode || account.id === ""}
                                    clearable={false}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'projectId')}
                                    options={listProject.map((project: any) => ({ value: project.id, label: project.codeName, code: project.code }))}
                                  />

                                </td>
                                <td className="data-line-td">
                                  <Select
                                    value={costCenter.id}
                                    className="text-align-left"
                                    valueRenderer={this.renderValue}
                                    disabled={isViewTransDetailMode || account.id === ""}
                                    clearable={false}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'costCenterId')}
                                    options={listCostCenter.map((costCenter: any) => ({ value: costCenter.id, label: costCenter.codeName, code: costCenter.code }))}
                                  />

                                </td>
                                <td className="data-line-td">
                                  <Select
                                    value={customer.id}
                                    valueRenderer={this.renderValue}
                                    className="text-align-left"
                                    disabled={isViewTransDetailMode || account.id === ""}
                                    clearable={false}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'customerId')}
                                    options={listCustomer && listCustomer.map((customer: any) => ({ value: customer.id, label: customer.codeName, code: customer.code }))}
                                  />

                                </td>
                                <td className="data-line-td">
                                  <Input
                                    type="select"
                                    className="data-line-input-select"
                                    value={journalEntryType.id || ''}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, 'journalEntryType')}
                                    disabled={isViewTransDetailMode || account.id === ""}
                                  >
                                    {
                                      journalEntryTypeList.map((item: any, index: number) => {
                                        const { id, name } = item;

                                        if (isViewTransDetailMode || !journalEntryTypeList.find((obj: any) => obj.id === journalEntryType.id)) {
                                          return (
                                            <option value={journalEntryType.id} key={index}>{journalEntryType.name}</option>
                                          );
                                        }
                                        return (
                                          <option value={id} key={index}>{name}</option>
                                        );
                                      })
                                    }
                                  </Input>
                                </td>
                                <td className="data-line-td">
                                  {attributeField && attributeField.length > 0 &&
                                    <Label
                                      className="data-line-attr-label"
                                      onClick={() => this.openAtrributeModal(index, 'Attribute')}
                                    >
                                      {ischangeAttribute ? "Change..." : "Set..."}

                                    </Label>

                                  }
                                </td>

                                <td className="data-line-td">
                                  {referenceField && referenceField.length > 0 &&
                                    <Label
                                      className="data-line-attr-label"
                                      onClick={() => this.openAtrributeModal(index, 'Reference')}
                                    >
                                      {ischangeReference ? "Change..." : "Set..."}
                                    </Label>
                                  }
                                </td>
                                {
                                  !isViewTransDetailMode && (
                                    <td className="data-line-td">
                                      <Label className="data-line-del-label"
                                        onClick={() => this.handleDeleteDataLine(index)}
                                      >
                                        <i className="icon-trash" />
                                      </Label>
                                    </td>
                                  )}
                              </tr>
                            );
                          })
                        }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <Button
                      type="button"
                      color="primary"
                      onClick={() => this.handleAddDataLine()}
                      className="color-white"
                      disabled={isViewTransDetailMode}
                    >
                      <i className="icon-plus" />&nbsp;
                      Add
                      </Button>
                  </Col>
                </Row>
                <Row className="mar-top-5">
                  <Col xs="12">
                    <Label className="mark-required">*&#41; At least one transaction must be filled before save the transaction</Label>
                  </Col>
                </Row>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default DataLineTab;
