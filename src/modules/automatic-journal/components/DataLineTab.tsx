import React, { Component } from 'react';
import {
  Row, Col,
  Input,
  Button,
  Table,
  Label,
} from 'reactstrap';
import { default as NumberFormat } from 'react-number-format';
import { ToolTipWrapper } from '../../../components';

class DataLineTab extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataLine: {},
      mapDataLine: [],
      isAddDataLine: false,
    }
  }

  static getDerivedStateFromProps = (props: any, state: any) => {
    if (props.dataLine[props.tabType] !== state.dataLine[props.tabType]) {
      return {
        dataLine: props.dataLine,
        mapDataLine: props.tabType === 'actual' ? props.dataLine.actual : props.dataLine.budget,
      }
    }
    return null;
  }

  componentDidUpdate = (props: any, state: any) => {
    const { isAddDataLine, mapDataLine } = state;
    if (isAddDataLine) {
      const el = document.getElementById(`${props.tabType}${mapDataLine.length}`);
      if (el) {
        el.focus();
      }

      this.setState({ isAddDataLine: false });
    }
  }

  handleAddDataLine = () => {
    const {
      tabType,
    } = this.props;

    let isActual = true

    if (tabType === 'budget') {
      isActual = false;
    }

    this.setState({ isAddDataLine: true }, () => this.props.onAddDataLine(isActual));
  }

  handleDeleteDataLine = (index: number) => {
    const {
      mapDataLine,
    } = this.state;

    const {
      tabType,
      isViewTransDetailMode,
    } = this.props;

    if (mapDataLine.length <= 1 || isViewTransDetailMode) return;

    let isActual = true;

    if (tabType === 'budget') {
      isActual = false;
    }

    this.props.onDeleteDataLine(isActual, index);
  }

  render() {
    const {
      mapDataLine,
    } = this.state;

    const {
      listTransType,
      tabType,
      isViewTransDetailMode,
      isCorrection,
      attributeField,
    } = this.props;

    return (
      <div>
        <Row>
          <Col xs="12">
            <Table hover bordered striped responsive>
              <thead>
                <tr>
                  <th className="data-line-th small">No.</th>
                  <th className="data-line-th large">Transaction Type</th>
                  <th className="data-line-th large">Amount</th>
                  <th className="data-line-th large">Acc. Amount</th>
                  <th className="data-line-th large">Remark</th>
                  {
                    attributeField && (
                      attributeField.map((item: any, index: number) => {
                        const { isHeader, title } = item;
                        if (isHeader) {
                          return null;
                        }
                        return (
                          <th className="data-line-th large" key={index}>{title}</th>
                        );
                      })
                    )
                  }
                  <th className="data-line-th small">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  mapDataLine.map((item: any, index: number) => {
                    const order = index;
                    const {
                      transactionType,
                      enteredAmount,
                      accountedAmount,
                      description,
                      // journalEntryType
                    } = item;
                    const transTypeDescription = listTransType.find((obj: any) => obj.id === transactionType.id);

                    return (
                      <tr key={order}>
                        <td className="data-line-td">
                          {index + 1}
                        </td>
                        <td className="data-line-td">
                          <span
                            data-for={`tooltip${index}`}
                            data-tip={
                              transactionType.id
                              ? transTypeDescription
                              ? `${transTypeDescription.description}`
                              : 'Please select one'
                              : 'Please select one'
                            }
                          >
                            <Input
                              type="select"
                              className="transaction-type"
                              value={transactionType.id || ''}
                              onChange={(e: any) => this.props.handleChangeDataLine(e, index, tabType, 'transactionType')}
                              disabled={isViewTransDetailMode || !listTransType.find((obj: any) => obj.id === transactionType.id)}
                              id={`${tabType}${index + 1}`}
                            >
                              {
                                listTransType.map((item: any, index: number) => {
                                  const { id, name } = item;

                                  if (isViewTransDetailMode || !listTransType.find((obj: any) => obj.id === transactionType.id)) {
                                    return (
                                      <option value={transactionType.id} key={index}>{transactionType.name}</option>
                                    );
                                  }
                                  return (
                                    <option value={id} key={index}>{name}</option>
                                  );
                                })
                              }
                            </Input>
                          </span>
                          { 
                            (!isViewTransDetailMode || listTransType.find((obj: any) => obj.id === transactionType.id)) && (
                              <ToolTipWrapper id={`tooltip${index}`} />
                            )
                          }
                        </td>
                        <td className="data-line-td">
                          <NumberFormat
                            placeholder="Amount"
                            thousandSeparator={true}
                            decimalSeparator="."
                            decimalScale={4}
                            value={enteredAmount}
                            disabled={isViewTransDetailMode || !listTransType.find((obj: any) => obj.id === transactionType.id)}
                            allowNegative={(isCorrection || parseFloat(enteredAmount) < 0) ? true : false}
                            onChange={(e: any) => this.props.handleChangeDataLine(e, index, tabType, 'enteredAmount')}
                            className="data-line-amount"
                          />
                        </td>
                        <td className="data-line-td">
                          <NumberFormat
                            placeholder="Acc. Amount"
                            thousandSeparator={true}
                            decimalSeparator="."
                            decimalScale={4}
                            disabled
                            value={accountedAmount}
                            className="data-line-amount"
                          />
                        </td>
                        <td className="data-line-td">
                          <Input
                            type="text"
                            id="text-input"
                            value={description}
                            onChange={(e: any) => this.props.handleChangeDataLine(e, index, tabType, 'description')}
                            placeholder="Remark"
                            disabled={isViewTransDetailMode || !listTransType.find((obj: any) => obj.id === transactionType.id)}
                            className="height-30"
                            maxLength={300}
                          />
                        </td>
                        {
                          attributeField && (
                            attributeField.map((item: any, index_: number) => {
                              const { name, title, length, type, isHeader } = item;
                              if (isHeader) {
                                return null;
                              }
                              return (
                                <td key={index_}>
                                  <Input
                                    type={type || 'text'}
                                    name={name || 'name'}
                                    maxLength={length || undefined}
                                    placeholder={title || 'title'}
                                    className={`height-30 ${type === 'date' ? "remove-date-arrow" : ''}`}
                                    value={mapDataLine[index][name]}
                                    onChange={(e: any) => this.props.handleChangeDataLine(e, index, tabType, name)}
                                    disabled={isViewTransDetailMode}
                                  />
                                </td>
                              )
                            })
                          )
                        }
                        <td className="data-line-del">
                          <Label
                            className="data-line-del-label"
                            style={{ opacity: mapDataLine.length === 1 || isViewTransDetailMode ? 0.65 : 1 }}
                            onClick={() => this.handleDeleteDataLine(index)}
                          >
                            <i className="icon-trash" />
                          </Label>
                        </td>
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
      </div>
    )
  }
}

export default DataLineTab;
