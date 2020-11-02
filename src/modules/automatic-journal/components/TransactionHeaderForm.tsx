import React, { Component } from 'react';
import {
  Row, Col,
  Label,
  Input,
  Container,
  FormText,
} from 'reactstrap';
import { default as NumberFormat } from 'react-number-format';
import { connect } from 'react-redux';
import download from 'downloadjs';
import { HttpService } from '../../../utilities';
import { SweetAlert, ToolTipWrapper, RequiredMark } from '../../../components';
import {
  descriptionPostingState, descriptionDescription,
  descriptionAccountingDate, descriptionExchangeRate,
  descriptionEvidence, postingStateList,
} from '../config/ConstantsJournal';
import { ajRoles } from '../../../config';

class TransactionHeaderForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      alert: null,
    };
  }

  handleBrowseEvidence = (e: any) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      document.getElementById('browseEvidence')!.click();
    }
  }

  handleDeleteEvidence = (index: number, action: string) => {
    const {
      disabledHeaderAttr, isViewTransDetailMode,
    } = this.props.state;

    if (isViewTransDetailMode || disabledHeaderAttr.includes('evidence')) {
      return;
    }

    this.props.handleChangeEvidence(index, action);
  }

  handleRequestImage = (id: string, fileName: string) => {
    try {
      const {
        resAuth
      } = this.props;

      const fileType = fileName.split('.')[1];

      let isFilePdf = false;
      if (fileType.includes('pdf')) {
        isFilePdf = true;
      }

      const permission = this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_View);
      const headers = {
        Authorization: `Bearer ${resAuth.token}`,
        role: ajRoles.AJ_View,
        permission: permission.permissions[0],
      };

      HttpService.get(`evidence/image/${id}`, null, headers)
        .then((response: any) => {
          const src = response.data.src;
          const isFileAvailable = response.data.isFileAvailable;
          if (!isFilePdf) {
            this.handleOpenImage(src, id, isFileAvailable);
            return;
          }

          this.handleOpenPdf(isFileAvailable, id);
        })
        .catch((err: any) => {
          console.log('error when load image with error: ', err);
        });
    } catch (e) {
      console.log('error at request image with error: ', e);
    }
  }

  handleOpenPdf = (isFileAvailable: boolean, id: string) => {
    try {
      if (isFileAvailable) {
        this.handleDownloadImage(id);
        return;
      }

      const message = 'File is not available. Please contact your admin for more information';

      const param = {
        type: 'error',
        confirmBtnBsStyle: 'primary',
        confirmBtnText: 'Close',
        title: 'Sorry',
        showCancel: false,
        message,
        focusConfirmBtn: false,
      };

      const onConfirm = () => { this.handleHideImage(); };
      const onCancel = () => { this.handleHideImage(); };

      this.setState({
        alert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
      });
    } catch (e) {
      console.log('error at handleOpenPdf with error: ', e);
    }
  }

  handleOpenImage = (source: string, id: string, isImageAvailable: boolean) => {
    try {
      const message = <div className="image-view-container">
        <img
          src={source}
          alt="img"
          className="width-100-percent"
        />
      </div>;

      const param = {
        type: 'default',
        confirmBtnBsStyle: 'primary',
        confirmBtnText: 'Download',
        title: '',
        showConfirm: isImageAvailable,
        showCancel: true,
        cancelBtnBsStyle: 'default',
        cancelBtnText: 'Close',
        message,
        focusConfirmBtn: false,
      };

      const onConfirm = () => { this.handleDownloadImage(id); };
      const onCancel = () => { this.handleHideImage() };

      this.setState({
        alert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
      });
    } catch (e) {
      console.log('error at handleOpenImage with error: ', e);
    }
  }

  handleHideImage = () => {
    this.setState({ alert: null });
  }

  handleDownloadImage = (id: string) => {
    const permission = this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_View);
    const headers = {
      Authorization: `Bearer ${this.props.resAuth.token}`,
      role: ajRoles.AJ_View,
      permission: permission.permissions[0],
    };

    HttpService.get(`evidence/image/${id}/download`, null, headers)
      .then((res: any) => {
        const contentType = res.headers['content-type'];
        const fileName = (res.headers['content-disposition']).split('= ')[1];
        download(res.data.src, fileName, contentType);
      })
      .catch((err: any) => {
        console.log('err: ', err);
      });
  }

  render() {
    const {
      isViewTransDetailMode,
      postingState,
      postingCode,
      isCorrection,
      correctionAjCode,
      transactionCode,
      selectedOrganization,
      selectedProduct,
      selectedProject,
      selectedCostCenter,
      selectedCustomer,
      selectedCurrency,
      accountingDate,
      description,
      exchangedRate,
      listProduct,
      listProject,
      listCostCenter,
      listCustomer,
      listEvidence,
      accountingPeriod,
      listCurrency,
      disabledHeaderAttr,
      mandatoryHeaderAttr,
      headerDescriptionPlaceholderTemplate,
    } = this.props.state;

    return (
      <Container className="header-form-container">
        {this.state.alert}
        <Container className="header-form-left">
          <Row className="align-content-center pad-3-13">
            <Col md="4" lg="4" className="align-self-center">
              <Label className="font-size-13">
                Code
              </Label>
            </Col>
            <Col md="8" lg="8" className="align-self-center">
              <Label className="font-size-13">
                {
                  isCorrection ? `${transactionCode} (Correction for: ${correctionAjCode})` : transactionCode
                }
              </Label>
            </Col>
          </Row>

          <Row className="align-content-center pad-3-13">
            <Col md="4" lg="4" className="align-self-center">
              <Label
                className="font-size-13"
                data-for="postingStateDescription"
                data-tip={descriptionPostingState}
              >
                Posting State
              </Label>
              <ToolTipWrapper id="postingStateDescription" />
            </Col>
            <Col md="8" lg="8" className="align-self-center">
              <Label className="font-size-13">
                {
                  postingState === 'PS' ? `${postingStateList[postingState]} - ${postingCode}` : postingStateList[postingState]
                }
              </Label>
            </Col>
          </Row>

          <Row className="align-content-center pad-3-13">
            <Col md="4" lg="4" className="align-self-center">
              <Label
                className="font-size-13"
                data-for="accountingDateDescription"
                data-tip={descriptionAccountingDate}
              >
                Accounting Date <RequiredMark />
              </Label>
              <ToolTipWrapper id="accountingDateDescription" />
            </Col>
            <Col md="4" lg="4" className="align-self-center">
              <Input
                type="date"
                id="date-input"
                className="remove-date-arrow"
                name="accountingDate"
                placeholder="date"
                disabled={isViewTransDetailMode || !accountingPeriod.startDate || !accountingPeriod.endDate}
                value={accountingDate}
                min={accountingPeriod.startDate} // yyyy-mm-dd
                max={accountingPeriod.endDate} // yyyy-mm-dd
                onChange={e => this.props.handleChangeInputField(e)}
              />
            </Col>
          </Row>

          <Row className="align-content-center pad-3-13">
            <Col md="4" lg="4" className="align-self-flex-start">
              <Label
                className="font-size-13"
                data-for="descriptionDescription"
                data-tip={descriptionDescription}
              >
                Description <RequiredMark />
              </Label>
              <ToolTipWrapper id="descriptionDescription" />
            </Col>
            <Col md="8" lg="8" className="align-self-center">
              <Input
                type="textarea"
                name="description"
                id="textarea-input"
                rows="6"
                placeholder={headerDescriptionPlaceholderTemplate}
                value={description}
                onChange={e => this.props.handleChangeInputField(e)}
                className="font-size-13"
                disabled={isViewTransDetailMode}
                maxLength={300}
              />
            </Col>
          </Row>

          <Row className="align-content-center pad-3-13">
            <Col md="4" lg="4" className="align-self-center">
              <Label
                className="font-size-13"
                data-for="exchangeRateDescription"
                data-tip={descriptionExchangeRate}
              >
                Exchange Rate <RequiredMark />
              </Label>
              <ToolTipWrapper id="exchangeRateDescription" />
            </Col>
            <Col md="3" lg="3" className="align-self-center">
              <Input
                type="select"
                name="selectedCurrency"
                id="SelectLm"
                value={selectedCurrency}
                onChange={e => this.props.handleChangeInputField(e)}
                disabled={isViewTransDetailMode}
              >
                {
                  listCurrency.map((item: any, index: number) => {
                    return (
                      <option value={item.code} key={index}>{item.code}</option>
                    );
                  })
                }
              </Input>
            </Col>

            <Col md="3" lg="3" className="align-self-center">
              <NumberFormat
                name="exchangedRate"
                placeholder="Rate"
                thousandSeparator={true}
                decimalSeparator="."
                decimalScale={4}
                value={exchangedRate}
                allowNegative={false}
                disabled={isViewTransDetailMode || selectedCurrency === 'IDR'}
                onChange={e => this.props.handleChangeInputField(e)}
                className="exchange-rate"
              />
            </Col>
          </Row>
        </Container>

        <Container className="header-form-right">
          <Row className="align-content-center pad-3-13">
            <Col md="3" lg="3" className="align-self-center">
              <Label className="font-size-13">Organization</Label>
            </Col>
            <Col md="6" lg="6" className="align-self-center">
              <Input
                type="select"
                name="selectedOrganization"
                disabled
                className="font-size-13"
              >
                <option value={selectedOrganization.id} className="font-size-13">
                  {`${selectedOrganization.code} - ${selectedOrganization.name}`}
                </option>
              </Input>
            </Col>
            <Col md="3" lg="3" />
          </Row>

          <Row className="align-content-center pad-3-13">
            <Col md="3" lg="3" className="align-self-center">
              <Label className="font-size-13">
                Product {mandatoryHeaderAttr.includes('product') && (<RequiredMark />)}
              </Label>
            </Col>
            <Col md="6" lg="6" className="align-self-center">
              <Input
                type="select"
                name="selectedProduct"
                className="font-size-13"
                onChange={e => this.props.handleChangeInputField(e)}
                value={selectedProduct}
                disabled={isViewTransDetailMode || disabledHeaderAttr.includes('product')}
              >
                {
                  listProduct.map((item: any, index: number) => {
                    const { id, name, code } = item;
                    const code_ = code ? `${code} - ` : '';
                    return (
                      <option value={id} className="font-size-13" key={index}>{code_}{name}</option>
                    );
                  })
                }
              </Input>
            </Col>
            <Col md="3" lg="3" />
          </Row>

          <Row className="align-content-center pad-3-13">
            <Col md="3" lg="3" className="align-self-center">
              <Label className="font-size-13">
                Project {mandatoryHeaderAttr.includes('project') && (<RequiredMark />)}
              </Label>
            </Col>
            <Col md="6" lg="6" className="align-self-center">
              <Input
                type="select"
                name="selectedProject"
                className="font-size-13"
                onChange={e => this.props.handleChangeInputField(e)}
                value={selectedProject}
                disabled={isViewTransDetailMode || disabledHeaderAttr.includes('project')}
              >
                {
                  listProject.map((item: any, index: number) => {
                    const { id, name, code } = item;
                    const code_ = code ? `${code} - ` : '';
                    return (
                      <option value={id} className="font-size-13" key={index}>{code_}{name}</option>
                    );
                  })
                }
              </Input>
            </Col>
            <Col md="3" lg="3" />
          </Row>

          <Row className="align-content-center pad-3-13">
            <Col md="3" lg="3" className="align-self-center">
              <Label className="font-size-13">
                Cost Center {mandatoryHeaderAttr.includes('costCenter') && (<RequiredMark />)}
              </Label>
            </Col>
            <Col md="6" lg="6" className="align-self-center">
              <Input
                type="select"
                name="selectedCostCenter"
                className="font-size-13"
                onChange={e => this.props.handleChangeInputField(e)}
                value={selectedCostCenter}
                disabled={isViewTransDetailMode || disabledHeaderAttr.includes('costCenter')}
              >
                {
                  listCostCenter.map((item: any, index: number) => {
                    const { id, name, code } = item;
                    const code_ = code ? `${code} - ` : '';
                    return (
                      <option value={id} className="font-size-13" key={index}>{code_}{name}</option>
                    );
                  })
                }
              </Input>
            </Col>
            <Col md="3" lg="3" />
          </Row>

          <Row className="align-content-center pad-3-13">
            <Col md="3" lg="3" className="align-self-center">
              <Label className="font-size-13">
                Customer {mandatoryHeaderAttr.includes('customer') && (<RequiredMark />)}
              </Label>
            </Col>
            <Col md="6" lg="6" className="align-self-center">
              <Input
                type="select"
                name="selectedCustomer"
                className="font-size-13"
                onChange={e => this.props.handleChangeInputField(e)}
                value={selectedCustomer}
                disabled={isViewTransDetailMode || disabledHeaderAttr.includes('customer')}
              >
                {
                  listCustomer.map((item: any, index: number) => {
                    const { id, name, code } = item;
                    const code_ = code ? `${code} - ` : '';
                    return (
                      <option value={id} className="font-size-13" key={index}>{code_}{name}</option>
                    );
                  })
                }
              </Input>
            </Col>
            <Col md="3" lg="3" />
          </Row>
        </Container>

        <Container className="evidence-container">
          <Row className="align-content-center pad-3-13 mar-bot-15">
            <Col md="2" lg="2" className="align-self-flex-start">
              <Label
                className="font-size-13"
                data-for="descriptionEvidence"
                data-tip={descriptionEvidence}
              >
                Evidence {mandatoryHeaderAttr.includes('evidence') && (<RequiredMark />)}
                <FormText>Max. 10 MB (PDF/Image)</FormText>
                <ToolTipWrapper id="descriptionEvidence" />
              </Label>
            </Col>
            <Col md="1" lg="1" className="align-self-flex-start">
              <Label
                for="browseEvidence"
                className={`no-select ${isViewTransDetailMode ? 'evidence-disable' : 'evidence-avail'}`}
                tabIndex={isViewTransDetailMode ? undefined : 0}
                role="button"
                onKeyDown={e => this.handleBrowseEvidence(e)}
              >
                Browse
              </Label>
              <Input
                type="file"
                style={{
                  display: 'none',
                  opacity: isViewTransDetailMode || disabledHeaderAttr.includes('evidence') ? 0.65 : 1,
                }}
                id="browseEvidence"
                onChange={(e: any) => this.props.handleChangeEvidence(e, 'add')}
                multiple
                accept=".jpg,.png,.jpeg,.pdf"
                disabled={isViewTransDetailMode || disabledHeaderAttr.includes('evidence')}
              />
            </Col>
            <Col md="9" lg="9" className="align-self-flex-start">
              <Row>
                {
                  listEvidence.map((item: any, index: number) => {
                    const imageName = item.fileName ? item.fileName : item.name;
                    const name = imageName.length > 30 ? `${imageName.slice(0, 29)}...` : imageName;
                    return (
                      <Col md="6" lg="6" key={index}>
                        {
                          item.fileName && (
                            <span
                              onClick={() => this.handleRequestImage(item.id, imageName)}
                              className="cursor-pointer"
                            >
                              {name}
                            </span>
                          )
                        }
                        {
                          item.name && (
                            <span>
                              {name}
                            </span>
                          )
                        }
                        <i className="icon-close" onClick={() => this.handleDeleteEvidence(index, 'delete')} />
                      </Col>
                    )
                  })
                }
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

export default connect(mapStateToProps, null)(TransactionHeaderForm);
