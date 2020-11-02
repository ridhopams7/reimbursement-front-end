
import React, { Component } from 'react';
import {
  Input, Label, Row, Col, FormGroup
} from 'reactstrap';
import { RequiredMark } from '../../../../components';
class ModalDataline extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataLineModal: props.dataLineTemp,
    };
  }

  handleChangeInputModal = (e: any, column: string) => {
    try {
      const { indexLine } = this.props;
      const { dataLineModal } = this.state;
      // const dataLine: any = [...dataLineModal];
      const copyDataLine = [...dataLineModal];
      const copyData = { ...dataLineModal[indexLine] };
      copyData[column] = e.target.value;
      copyDataLine[indexLine] = copyData;
      this.setState({ dataLineModal: copyDataLine }, () => this.props.onChangeInputModal(copyDataLine));

    } catch (e) {
      console.log('error at handleChangeInputModal with error: ', e);
    }
  }
  render() {

    const { typeSet, indexLine, isViewTransDetailMode,
      listAttribute, listReference } = this.props;

    const { dataLineModal } = this.state;

    if (typeSet === "Attribute") {
      return (
        <div className="animated fadeIn" style={listAttribute.length > 3 ? { overflowY: "scroll", marginTop: 20 } : { marginTop: 20 }} >
          <Row>
            <Col>
              {listAttribute && listAttribute.map((item: any, index: number) => {

                const { name, title, length, type, isMandatory } = item;
                const svaluefromData = dataLineModal[indexLine][`attribute${index + 1}`];
                return (
                  <Row key={index}>
                    <Col>
                      <FormGroup style={{ marginBottom: 5 }} row>
                        <Col md="4">
                          <Label sm="100" htmlFor={name}>{title}
                            {
                              isMandatory && <RequiredMark />
                            }
                          </Label>
                        </Col>
                        <Col xs="6" md="6">
                          <Input
                            type={type || 'text'}
                            name={name || 'name'}
                            maxLength={length || undefined}
                            placeholder={title || 'title'}
                            value={svaluefromData}
                            onChange={(e) => this.handleChangeInputModal(e, `attribute${index + 1}`)}
                            disabled={isViewTransDetailMode} />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
        </div>
      );
    }
    else {
      return (
        <div className="animated fadeIn" style={listReference.length > 3 ? { overflowY: "scroll", marginTop: 20 } : { marginTop: 20 }} >
          <Row>
            <Col>
              {listReference && listReference.map((item: any, index: number) => {

                const { name, title, length, type, isMandatory } = item;
                const svaluefromData = dataLineModal[indexLine][`reference${index + 1}`];
                // let value = svaluefromData === "" ? valueFromProps : value;
                return (
                  <Row key={index}>
                    <Col>
                      <FormGroup style={{ marginBottom: 5 }} row>
                        <Col md="4">
                          <Label sm="100" htmlFor={name}>{title}
                            {
                              isMandatory && <RequiredMark />
                            }
                          </Label>
                        </Col>
                        <Col xs="6" md="6">
                          <Input
                            type={type || 'text'}
                            name={name || 'name'}
                            maxLength={length || undefined}
                            placeholder={title || 'title'}
                            value={svaluefromData}
                            onChange={(e) => this.handleChangeInputModal(e, `reference${index + 1}`)}
                            disabled={isViewTransDetailMode} />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                );
              }
              )}
            </Col>
          </Row>
        </div>
      );
    }
  }
}

export default ModalDataline;
