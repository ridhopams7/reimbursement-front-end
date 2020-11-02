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
  FormText,
} from 'reactstrap';
import { default as NumberFormat } from 'react-number-format';
import SweetAlert from 'react-bootstrap-sweetalert';
import { connect } from 'react-redux';
import { postingStateList, journalCategoryList } from '../../config/Constants';
import { HttpService } from '../../../../utilities';
import { RequiredMark } from '../../../../components';

import download from 'downloadjs';

class HeaderForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      alert: null,
      activeTab: new Array(1).fill('1'),
      
    };
  }

  handleBrowseEvidence = (e: any) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      document.getElementById('browseEvidence')!.click();
    }
  }

  handleDeleteEvidence = (index: number, action: string) => {
    const {isViewTransDetailMode,
    } = this.props;

    if (isViewTransDetailMode) {
      return;
    }

    this.props.handleChangeEvidence(index, action);
  }

  returnSweetAlert = (param: any, onConfirm: any, onCancel: any) => {
    const {
      type, title,
      confirmBtnText, confirmBtnBsStyle,
      cancelBtnText, cancelBtnBsStyle,
      focusConfirmBtn,
      showConfirm, showCancel,
      message,
    } = param;

    // type='default' || 'info' || 'success' || 'warning' || 'danger' || 'custom'
    return (
      <SweetAlert
        type={type}
        title={title}
        confirmBtnText={confirmBtnText || 'Yes'}
        confirmBtnBsStyle={confirmBtnBsStyle || 'default'}
        cancelBtnText={cancelBtnText || 'Cancel'}
        cancelBtnBsStyle={cancelBtnBsStyle || 'default'}
        focusConfirmBtn={focusConfirmBtn}
        showConfirm={showConfirm}
        showCancel={showCancel}
        allowEscape
        closeOnClickOutside
        onConfirm={() => onConfirm()}
        onCancel={() => onCancel()}
      >
        {message}
      </SweetAlert>
    );
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

      const permission = resAuth.roles.find((obj: any) => obj.role === 'V_View');
      const headers = {
        Authorization: `Bearer ${this.props.resAuth.token}`,
        role: 'V_View',
        permission: permission.permissions[0],
      };
  

      HttpService.get(`je-evidences/image/${id}`, null, headers)
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
        alert: this.returnSweetAlert(param, onConfirm, onCancel),
      });
    } catch (e) {
      console.log('error at handleOpenPdf with error: ', e);
    }
  }

  handleOpenImage = (source: string, id: string, isImageAvailable: boolean) => {
    try {
      console.log(source);
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
        alert: this.returnSweetAlert(param, onConfirm, onCancel),
      });
    } catch (e) {
      console.log('error at handleOpenImage with error: ', e);
    }
  }

  handleHideImage = () => {
    this.setState({ alert: null });
  }

  handleDownloadImage = (id: string) => {
   
    const permission = this.props.resAuth.roles.find((obj: any) => obj.role === 'V_View');
    const headers = {
      Authorization: `Bearer ${this.props.resAuth.token}`,
      role: 'V_View',
      permission: permission.permissions[0],
    };
    HttpService.get(`je-evidences/image/${id}/download`, null, headers)
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
      transactionCode,
      selectedOrganization,
      selectedJournalCategory,
      selectedAccountingPeriod,
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
      listAccountingPeriod,
      accountingPeriod,
      listCurrency,
    } = this.props;

    return (
      <Container className="container-header">
        {this.state.alert}
        <Container className="container-header-left">
          <Row className="row-header center">
            <Col md="4" lg="4" className="align-self-center">
              <Label className="font-size-13">Code</Label>
            </Col>
            <Col md="8" lg="8" className="align-self-center">
              <Label className="font-size-13">
                {
                   transactionCode
                }
              </Label>
            </Col>
          </Row>

          <Row className="row-header center">
            <Col md="4" lg="4" className="align-self-center">
              <Label className="font-size-13">Posting State</Label>
            </Col>
            <Col md="8" lg="8" className="align-self-center">
              <Label className="font-size-13">
                {
                  postingState === "PS" ? `${postingStateList[postingState]} - ${postingCode}` : postingStateList[postingState]
                }
              </Label>
            </Col>
          </Row>
          <Row className="row-header center">
            <Col md="4" lg="4" className="align-self-center">
              <Label className="font-size-13">Journal Category</Label>
              <RequiredMark />
            </Col>
            <Col md="4" lg="4" className="align-self-center">
                  <Input
                        type="select"
                        name="selectedJournalCategory"
                        id="selectedJournalCategory"
                        value={selectedJournalCategory}
                        onChange={e => this.props.handleChangeInputField(e)}
                        disabled={isViewTransDetailMode}
                      >
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

          <Row className="row-header center">
            <Col md="4" lg="4" className="align-self-center">
              <Label className="font-size-13">
                Accounting Period
                <RequiredMark />
              </Label>
            </Col>
            <Col md="4" lg="4" className="align-self-center">
                  <Input
                        type="select"
                        name="selectedAccountingPeriod"
                        id="selectedAccountingPeriod"
                        value={selectedAccountingPeriod}
                        onChange={e => this.props.handleChangeInputField(e)}
                        disabled={isViewTransDetailMode}
                      >
                        {
                          listAccountingPeriod.map((item: any, index: number) => {
                            return (
                              <option value={item.id} key={index}>{item.name}</option>
                            );
                          })
                        }
                  </Input>
              </Col>
            <Col md="4" lg="4" className="align-self-center">
              <Input
                type="date"
                id="date-input"
                className="remove-date-arrow"
                name="accountingDate"
                placeholder="date"
                disabled={isViewTransDetailMode}
                value={accountingDate}
                min={accountingPeriod.startDate} // yyyy-mm-dd
                max={accountingPeriod.endDate} // yyyy-mm-dd
                onChange={e => this.props.handleChangeInputField(e)}
              />
            </Col>
            
          </Row>

          <Row className="row-header center">
            <Col md="4" lg="4" className="align-self-flex-start">
              <Label className="font-size-13">
                Description
                <RequiredMark />
              </Label>
            </Col>
            <Col md="8" lg="8" className="align-self-center">
              <Input
                type="textarea"
                name="description"
                id="textarea-input"
                rows="6"
                placeholder="Description"
                value={description}
                onChange={e => this.props.handleChangeInputField(e)}
                className="font-size-13"
                disabled={isViewTransDetailMode}
                maxLength={300}
              />
            </Col>
          </Row>
        </Container>
        <Container className="container-header-right">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    active={true}>
                    Default Value
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent>
                  <Row className="row-header center">
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
                    <Col md="1" lg="1" />
                  </Row>

                  <Row className="row-header center">
                    <Col md="3" lg="3" className="align-self-center">
                      <Label className="font-size-13">
                        Product
                      </Label>
                    </Col>
                    <Col md="6" lg="6" className="align-self-center">
                      <Input
                        type="select"
                        name="selectedProduct"
                        className="font-size-13"
                        onChange={e => this.props.handleChangeInputField(e)}
                        value={selectedProduct}
                        disabled={isViewTransDetailMode}
                      >
                        {
                          listProduct.map((item: any, index: number) => {
                            const { id, code, name } = item;
                            return (
                              <option value={id} className="font-size-13" key={index}>{code} - {name}</option>
                            );
                          })
                        }
                      </Input>
                    </Col>
                    <Col md="1" lg="1" />
                  </Row>

                  <Row className="row-header center">
                    <Col md="3" lg="3" className="align-self-center">
                      <Label className="font-size-13">
                        Project
                        
                      </Label>
                    </Col>
                    <Col md="6" lg="6" className="align-self-center">
                      <Input
                        type="select"
                        name="selectedProject"
                        className="font-size-13"
                        onChange={e => this.props.handleChangeInputField(e)}
                        value={selectedProject}
                        disabled={isViewTransDetailMode }
                      >
                        {
                          listProject.map((item: any, index: number) => {
                            const { id, code, name } = item;
                            return (
                              <option value={id} className="font-size-13" key={index}>{code} - {name}</option>
                            );
                          })
                        }
                      </Input>
                    </Col>
                    <Col md="1" lg="1" />
                  </Row>

                  <Row className="row-header center">
                    <Col md="3" lg="3" className="align-self-center">
                      <Label className="font-size-13">
                        Cost Center
                      </Label>
                    </Col>
                    <Col md="6" lg="6" className="align-self-center">
                      <Input
                        type="select"
                        name="selectedCostCenter"
                        className="font-size-13"
                        onChange={e => this.props.handleChangeInputField(e)}
                        value={selectedCostCenter}
                        disabled={isViewTransDetailMode }>
                        {
                          listCostCenter.map((item: any, index: number) => {
                            const { id, code, name } = item;
                            return (
                              <option value={id} className="font-size-13" key={index}>{code} - {name}</option>
                            );
                          })
                        }
                      </Input>
                    </Col>
                    <Col md="1" lg="1" />
                  </Row>

                  <Row className="row-header center">
                    <Col md="3" lg="3" className="align-self-center">
                      <Label className="font-size-13">
                        Customer
                      </Label>
                    </Col>
                    <Col md="6" lg="6" className="align-self-center">
                      <Input
                        type="select"
                        name="selectedCustomer"
                        className="font-size-13"
                        onChange={e => this.props.handleChangeInputField(e)}
                        value={selectedCustomer}
                        disabled={isViewTransDetailMode }
                      >
                        {
                         listCustomer && listCustomer.map((item: any, index: number) => {
                          const { id, code, name } = item;

                            return (
                              <option value={id} className="font-size-13" key={index}>{code} - {name}</option>
                            );
                          })
                        }
                      </Input>
                    </Col>
                    <Col md="1" lg="1" />
                  </Row>

                  <Row className="row-header center">
                    <Col md="3" lg="3" className="align-self-center">
                      <Label className="font-size-13">
                        Exchange Rate
                      </Label>
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
                        className="input-number-format"
                      />
                    </Col>
                  </Row>
         
            </TabContent>
             </Container>
        <Container className="container-header-evidence">
          <Row className="row-header center mar-bot-15">
            <Col md="2" lg="2" className="align-self-flex-start">
              <Label className="font-size-13">
                Evidence
                <RequiredMark />
                <FormText>Max. 10 MB (PDF/Image)</FormText>
              </Label>
            </Col>
            <Col md="1" lg="1" className="align-self-flex-start">
              <Label
                for="browseEvidence"
                style={{
                  border: isViewTransDetailMode ? '1px solid #cccccc' : '1px solid #20A8D8',
                  borderRadius: 5,
                  backgroundColor: isViewTransDetailMode ? '#cccccc' : '#20A8D8',
                  padding: '1px 12px',
                  cursor: isViewTransDetailMode ? '' : 'pointer',
                  color: isViewTransDetailMode ? 'black' : 'white',
                }}
                className="no-select"
                tabIndex={0}
                role="button"
                onKeyDown={e => this.handleBrowseEvidence(e)}
              >
                Browse
              </Label>
              <Input
                type="file"
                style={{
                  display: 'none',
                  opacity: isViewTransDetailMode ? 0.65 : 1,
                }}
                id="browseEvidence"
                onChange={(e: any) => this.props.handleChangeEvidence(e, 'add')}
                multiple
                accept=".jpg,.png,.jpeg,.pdf"
                disabled={isViewTransDetailMode}
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

export default connect(mapStateToProps, null)(HeaderForm);
