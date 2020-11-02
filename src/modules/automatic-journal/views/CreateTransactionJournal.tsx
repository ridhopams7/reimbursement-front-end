import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Label,
  Input,
  Container,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  Table,
  Card,
  CardBody,
  Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faShare } from '@fortawesome/free-solid-svg-icons';
import lodash from 'lodash';
import moment from 'moment';

import { HttpService, handleRedirectUser } from '../../../utilities';

import { DataLineTab, TransactionHeaderForm } from '../components';
import { saveFormat } from '../config/ConstantsJournal';
import { ajRoles } from '../../../config';
import { SweetAlert, ToolTipWrapper, RequiredMark } from '../../../components';

class CreateTransaction extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headerId: "",
      activeTab: new Array(1).fill('1'),
      dataLine: {
        actual: [
          {
            transactionType: {
              id: "",
              name: ""
            },
            description: "",
            journalEntryType: "A",
            enteredAmount: "",
            accountedAmount: ""
          }
        ],
        budget: [
          {
            transactionType: {
              id: "",
              name: ""
            },
            description: "",
            journalEntryType: "B",
            enteredAmount: "",
            accountedAmount: ""
          }
        ],
      },
      listCategory: [{ id: '', name: 'Category', description: 'Select One' }],
      listSubCategory: [{ id: '', name: 'Sub Category', description: 'Select One' }],
      postingState: 'UP',
      transactionCode: '',
      postingCode: '',
      selectedTransCategory: '',
      selectedSubTransCategory: '',
      tmpSelectedTransCategory: '',
      tmpSelectedSubTransCategory: '',
      selectedOrganization: '',
      selectedProduct: '',
      selectedProject: '',
      selectedCostCenter: '',
      selectedCustomer: '',
      selectedCurrency: 'IDR',
      accountingDate: '',
      description: '',
      exchangedRate: '1',
      listProduct: [],
      listProject: [],
      listCostCenter: [],
      listCustomer: [],
      listTransTypeActual: [{ id: '', name: 'Type', description: 'Select Transaction Type' }],
      listEvidence: [],
      listCurrency: [],
      accountingPeriod: { startDate: '', endDate: '' },
      isTransCategoryDisabled: false,
      isSubTransCategoryDisabled: true,
      isCategoryHasSubCategory: true,
      isViewTransDetailMode: false,
      isWarning: false,
      attributeField: null,
      actualEnteredAmount: 0,
      budgetEnteredAmount: 0,
      actualAccountedAmount: 0,
      budgetAccountedAmount: 0,
      flagChange: false,
      lastModifiedBy: "",
      lastModifiedDate: "",
      isAlert: false,
      alertMessage: '',
      disabledHeaderAttr: [],
      mandatoryHeaderAttr: [],
      listDeletedEvidence: [],
      listCreatedEvidence: [],
      sweetAlert: null,
      isCorrection: false,
      correctionAjCode: '',
      isTransactionCorrected: null,
      headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
      isMinimumOneAttrOnHeader: true,
      headerDescriptionPlaceholderTemplate: '',
    };
  }

  componentDidMount = async () => {
    try {
      const { resAuth } = this.props;
      const headerId = this.props.match.params ? this.props.match.params.headerId : null;
      const { headers } = this.state;

      const role = headerId ? ajRoles.AJ_View : ajRoles.AJ_Entry;
      const permission = this.props.resAuth.roles.find((obj: any) => obj.role === role);

      if (!permission) {
        const data = handleRedirectUser(resAuth);

        const { param, url } = data;

        const onConfirm = () => { this.props.history.push(url); };
        const onCancel = () => { this.props.history.push(url); };

        this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
        return;
      }

      const headers_ = {
        ...headers,
        role,
        permission: permission.permissions[0],
      }

      this.setState({ headers: headers_ }, () => {
        if (headerId) {
          this.initialLoadViewTransDetail();
          return;
        }

        this.initialLoadCreateTransaction();
      });
    } catch (e) {
      console.log('error at didmount with error: ', e);
    }
  }

  hideSweetAlert = () => {
    this.setState({
      sweetAlert: null,
      tmpSelectedTransCategory: '',
      tmpSelectedSubTransCategory: '',
    });
  }

  toogleAlert = () => {
    this.setState({
      isAlert: !this.state.isAlert,
    });
  }

  initialLoadCreateTransaction = async () => {
    try {
      this.getOrganization();
      this.getAccountingPeriod();
      this.getCurrencyList();
    } catch (e) {
      console.log('error at initialLoadCreateTrans with error: ', e);
    }
  }

  initialLoadViewTransDetail = async () => {
    try {
      const { headers } = this.state;
      const headerId = this.props.match.params ? this.props.match.params.headerId : null;
      const resHeader = await HttpService.post(`automatic-journal/${headerId}`, null, headers);
      const resLines = await HttpService.post(`automatic-journal/${headerId}/lines`, null, headers);

      const param = {
        type: 'danger',
        title: 'Attention!',
        confirmBtnBsStyle: 'primary',
        confirmBtnText: 'Ok',
        message: '',
        showCancel: false,
        focusConfirmBtn: false,
      };

      const onConfirm = () => { this.props.history.push('/automatic-journal') };
      const onCancel = () => { this.props.history.push('/automatic-journal') };

      // console.log('res: ', resHeader);
      if (resHeader.status !== 200 || resLines.status !== 200) {
        param.message = resHeader.status !== 200 ? resHeader.data.message : resLines.data.message;
        this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
        return;
      }

      if (!resHeader.data.header || (resHeader.data.header && resHeader.data.header.length === 0)) {
        param.message = `Data with id ${headerId} is not exist. Please contact your admin`;
        this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
        return;
      }

      if (!resLines.data.lines || (resLines.data.lines && resLines.data.lines.length === 0)) {
        param.message = `Data with id ${headerId} not have transaction lines. Please contact your admin`;
        this.setState({ sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} /> });
        return;
      }

      const headerData = resHeader.data.header[0];
      const linesData = resLines.data.lines;

      const postingState = headerData.postingState;

      // console.log('headerData: ', headerData);
      // console.log('linesData: ', linesData);

      const selectedOrganization = {
        id: headerData.organizationId,
        code: headerData.organizationCode,
        name: headerData.organizationName,
      };

      this.getAccountingPeriod();
      this.getCurrencyList();
      this.getEvidence(headerId);

      if (postingState === 'UP') {
        this.getTransCategoryList(selectedOrganization);
        this.getProductList(selectedOrganization);
        this.getProjectList(selectedOrganization);
        this.getCostCenterList(selectedOrganization);
        this.getCustomerList(selectedOrganization);
      } else if (postingState === 'PS') {
        const listCategory = [{ id: headerData.transactionCategory.id, name: headerData.transactionCategoryName }];
        const listProduct = [{ id: headerData.productId, code: headerData.productCode, name: headerData.productName }];
        const listProject = [{ id: headerData.projectId, code: headerData.projectCode, name: headerData.projectName }];
        const listCostCenter = [{ id: headerData.costCenterId, code: headerData.costCenterCode, name: headerData.costCenterName }];
        const listCustomer = [{ id: headerData.customerId, code: headerData.customerCode, name: headerData.customerName }];

        this.setState({ listCategory, listProduct, listProject, listCostCenter, listCustomer });
      }

      const selectedTransCategory = headerData.transactionCategory.id;

      const isSubTransCategoryDisabled = true;
      const isTransCategoryDisabled = true;

      const selectedSubTransCategory = headerData.transactionSubCategory ? headerData.transactionSubCategory.id : '';

      let listSubCategory = [{
        id: headerData.transactionSubCategory.id,
        name: headerData.transactionSubCategoryName || 'Sub Category',
      }];

      if (postingState === 'UP') {
        const res: any = await this.getTransSubCategoryList(selectedTransCategory);
        listSubCategory = [{ id: '', name: 'Sub Category', description: 'Select Sub Category' }, ...res];
      }

      let isTransactionCorrected = null;
      if (!headerData.isCorrection) isTransactionCorrected = await this.getTransactionStatus(headerData.headerCode);

      const transactionCode = headerData.headerCode;
      const postingCode = headerData.postingCode;
      const accountingDate = moment(headerData.accountingDate).format('YYYY-MM-DD');
      const description = headerData.description;
      const exchangedRate = parseFloat(headerData.exchangeRate);
      const selectedCurrency = headerData.currencyCode;

      const selectedProduct = headerData.productId;
      const selectedProject = headerData.projectId;
      const selectedCostCenter = headerData.costCenterId;
      const selectedCustomer = headerData.customerId;
      const actualEnteredAmount = parseFloat(headerData.actualEnteredAmount);
      const budgetEnteredAmount = parseFloat(headerData.budgetEnteredAmount);
      const actualAccountedAmount = parseFloat(headerData.actualAccountedAmount);
      const budgetAccountedAmount = parseFloat(headerData.budgetAccountedAmount);
      const lastModifiedBy = headerData.lastUpdatedBy;
      const lastModifiedDate = moment(headerData.lastUpdatedDate).format('DD-MMM-YYYY (HH:mm:ss)');
      const isCorrection = headerData.isCorrection;
      const correctionAjCode = headerData.correctionAjCode;
      let isViewTransDetailMode = false;

      if (linesData && linesData.length > 0) {
        const firstDataLine = { ...linesData[0] };
        const value: string[] = [];
        Object.keys(firstDataLine).forEach((item: any) => {
          if (item.includes('attribute') && firstDataLine[item]) {
            value.push(firstDataLine[item]);
          }
        })
        this.getAttributeField(selectedTransCategory, selectedSubTransCategory, value, linesData);

        if (postingState === 'UP') {
          this.getTransactionTypeList(selectedTransCategory, selectedSubTransCategory);
        }
      }

      if (postingState === 'UP') {
        const ajEntryData = this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_Entry);
        const permission = ajEntryData ? ajEntryData.permissions[0] : '';
        if (!ajEntryData || (ajEntryData && selectedOrganization.code !== permission)) {
          isViewTransDetailMode = true;
        }
      } else if (postingState === 'PS') {
        isViewTransDetailMode = true;
      }

      this.setState({
        headerId,
        postingState,
        postingCode,
        transactionCode,
        selectedTransCategory,
        selectedSubTransCategory,
        selectedOrganization,
        selectedProduct,
        selectedProject,
        selectedCostCenter,
        selectedCustomer,
        selectedCurrency,
        accountingDate,
        description,
        exchangedRate,
        isSubTransCategoryDisabled,
        isTransCategoryDisabled,
        isCategoryHasSubCategory: false,
        isViewTransDetailMode,
        isWarning: false,
        actualEnteredAmount,
        budgetEnteredAmount,
        actualAccountedAmount,
        budgetAccountedAmount,
        flagChange: false,
        listSubCategory,
        lastModifiedBy,
        lastModifiedDate,
        isCorrection,
        correctionAjCode,
        isTransactionCorrected,
      })
    } catch (e) {
      console.log('error at initialLoadViewTransDetail with error: ', e);
    }
  }

  getTransCategoryList = async (selectedOrganization: any) => {
    try {
      // call api
      const { headers } = this.state;

      const id = selectedOrganization.id;
      const res = await HttpService.get(`organizations/${id}/transaction-categories`, null, headers);
      const listCategory = [{ id: '', name: 'Category', description: 'Select Transaction Category' }, ...res.data.transactionCategories];

      this.setState({ listCategory });
    } catch (e) {
      console.log('error at getTransCategoryList with error: ', e);
    }
  }

  getTransSubCategoryList = (categoryId: string) => new Promise(async (resolve, reject) => {
    try {
      // call api
      const { headers } = this.state;
      const id = categoryId;
      const response = await HttpService.get(`transaction-categories/${id}/sub-categories`, null, headers);

      resolve(response.data.subCategories);
    } catch (e) {
      console.log('error at getTransSubCategoryList with error: ', e);
      reject(e);
    }
  })

  getOrganization = async () => {
    try {
      // call api get organization
      const { headers } = this.state;

      const organization = await HttpService.get('organizations/permission', null, headers);
      const selectedOrganization = organization.data.organization[0];

      this.getTransCategoryList(selectedOrganization);
      this.getProductList(selectedOrganization);
      this.getProjectList(selectedOrganization);
      this.getCostCenterList(selectedOrganization);
      this.getCustomerList(selectedOrganization);

      this.setState({ selectedOrganization });
    } catch (e) {
      console.log('error at getOrganization with error: ', e);
    }
  }

  getEvidence = async (headerId: string) => {
    try {
      const { headers } = this.state;

      const res = await HttpService.get(`evidence/${headerId}`, null, headers);

      const rawData = [...res.data.evidences];
      const listEvidence: object[] = [];
      rawData.forEach((item: any) => {
        listEvidence.push(item);
      });

      this.setState({ listEvidence });
    } catch (e) {
      console.log('error at getEvidence with error: ', e);
    }
  }

  getCurrencyList = async () => {
    try {
      const { headers } = this.state;

      const res = await HttpService.get('currencies', null, headers);
      const listCurrency = [...res.data.currency];
      this.setState({ listCurrency });
    } catch (e) {
      console.log('error at getCurrencyList with error: ', e);
    }
  }

  getProductList = async (selectedOrganization: any) => {
    try {
      // call api get product list
      const { headers, isAlert } = this.state;

      const id = selectedOrganization.id;
      const res = await HttpService.get(`organizations/${id}/products`, null, headers);

      if (res.message === 'Network Error' && res.name === 'Error') {
        const alertMessage = 'Network Error';
        if (isAlert) {
          this.setState({ alertMessage });
        }

        this.setState({ isAlert: true, alertMessage });
        return;
      }

      const listProduct = [...res.data.products];

      this.setState({ listProduct });
    } catch (e) {
      console.log('error at getProductList with error: ', e);
    }
  }

  getProjectList = async (selectedOrganization: any) => {
    try {
      // call api get project list
      const { headers } = this.state;

      const id = selectedOrganization.id;
      const res = await HttpService.get(`organizations/${id}/projects`, null, headers);
      const listProject = [...res.data.projects];

      this.setState({ listProject });
    } catch (e) {
      console.log('error at getProjectList with error: ', e);
    }
  }

  getCostCenterList = async (selectedOrganization: any) => {
    try {
      // call api get cost center list
      const { headers } = this.state;

      const id = selectedOrganization.id;
      const res = await HttpService.get(`organizations/${id}/cost-centers`, null, headers);
      const listCostCenter = [...res.data.costCenters];

      this.setState({ listCostCenter });
    } catch (e) {
      console.log('error at getCostCenterList with error: ', e);
    }
  }

  getCustomerList = async (selectedOrganization: any) => {
    try {
      // call api get customer list
      const { headers } = this.state;

      const id = selectedOrganization.id;
      const res = await HttpService.get(`organizations/${id}/customers`, null, headers);
      const listCustomer = [...res.data.customers];

      this.setState({ listCustomer });
    } catch (e) {
      console.log('error at getCustomerList with error: ', e);
    }
  }

  getTransactionCode = async (categoryId: string, subCategoryId: any, isCorrection: boolean) => {
    try {
      const param: any = {
        categoryId,
      };

      if (subCategoryId) {
        param.subCategoryId = subCategoryId;
      }

      const { headers, transactionCode } = this.state;

      const copyTransactionCode = transactionCode;

      const res = await HttpService.get('automatic-journal/transaction-code', { param }, headers);
      const transactionCode_ = res.data.code.code;

      if (isCorrection) {
        this.setState({ correctionAjCode: copyTransactionCode, transactionCode: transactionCode_ });
        return;
      }

      this.setState({ transactionCode: transactionCode_ });
    } catch (e) {
      console.log('error at getTransactionCode with error: ', e);
    }
  }

  getPostingCode = (categoryId: string, subCategoryId: any, accountingDate: any) => new Promise(async (resolve, reject) => {
    try {
      const param: any = {
        categoryId,
        accountingDate,
      };

      if (subCategoryId) {
        param.subCategoryId = subCategoryId;
      }

      const { headers } = this.state;

      const res = await HttpService.get('posting-code', { param }, headers);

      if (res.status !== 200) {
        const message = res.data.message;
        const param = {
          type: 'danger',
          title: 'Attention!',
          confirmBtnBsStyle: 'primary',
          confirmBtnText: 'Ok',
          message,
          showCancel: false,
          focusConfirmBtn: false,
        };

        const onConfirm = () => { this.hideSweetAlert(); };
        const onCancel = () => { this.hideSweetAlert(); };

        this.setState({
          sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
        });

        return;
      }

      const postingCode = res.data.code.code;

      resolve(postingCode);
    } catch (e) {
      console.log('error at getTransactionCode with error: ', e);
      reject(e);
    }
  })

  getTransactionTypeList = async (categoryId: string, subCategoryId: any) => {
    try {
      const param: any = {
        categoryId,
      };

      if (subCategoryId) {
        param.subCategoryId = subCategoryId;
      }

      // call api with param
      const { headers } = this.state;

      const a = await HttpService.get('transaction-types', { param }, headers);
      const res = a.data.transactionTypes;

      const listTransTypeActual = [{ id: '', name: 'Type', description: 'Select Transaction Type' }, ...res];
      this.setState({ listTransTypeActual });
    } catch (e) {
      console.log('error at getTransactionType with error: ', e);
    }
  }

  getAttributeField = async (categoryId: string, subCategoryId: any, attributeData: any, dataLine: any = undefined) => {
    try {
      const param: any = {
        categoryId,
      };

      if (subCategoryId) {
        param.subCategoryId = subCategoryId;
      }

      const { headers } = this.state;

      let templateDataLine: any = {
        actual: [
          {
            transactionType: {
              id: "",
              name: ""
            },
            description: "",
            journalEntryType: "A",
            enteredAmount: "",
            accountedAmount: ""
          }
        ],
        budget: [
          {
            transactionType: {
              id: "",
              name: ""
            },
            description: "",
            journalEntryType: "B",
            enteredAmount: "",
            accountedAmount: ""
          }
        ],
      };

      const listAttributeOnLine: object[] = [];

      const response = await HttpService.get('transaction-parameters', { param }, headers);

      if (response.data.transactionParameter.length > 0) {
        const res = response.data.transactionParameter[0];

        let headerDescriptionPlaceholderTemplate = '';
        if (res.descriptionPlaceHolder) headerDescriptionPlaceholderTemplate = res.descriptionPlaceHolder;

        const disabledHeaderAttr: string[] = [];
        const mandatoryHeaderAttr: string[] = [];

        const keys = Object.keys(res);
        let attributeField: any = [];
        let fieldFormat: any = {
          title: '',
          isMandatory: true,
          type: '',
          length: '',
          name: '',
          isHeader: true,
          description: '',
        };

        const keyWithMandatoryName = Object.keys(res).filter(keys => keys.includes('MandatoryType'));

        keyWithMandatoryName.forEach((item, index) => {
          const property = keyWithMandatoryName[index];
          const value = res[property];

          if (value === 'MN') mandatoryHeaderAttr.push(item.slice(0, -13));
          if (value === 'DS') disabledHeaderAttr.push(item.slice(0, -13));
        })

        const changeValueAttribute = (name: string, index: number) => {
          // this is for autopopulate attribute value. this might change due to different condition of attribute in header/line
          if (attributeData && attributeData.length > 0) {
            if (index < attributeData.length) {
              this.setState({ [name]: attributeData[index] });
            }
          }
        };

        let counterIsHeader = 0;
        let fieldIndex = 0;

        for (const a in keys) {
          const property = keys[a];
          const value = res[property];

          if (property.includes('attribute')) {
            if (property.includes('Title')) {
              if (!value) break;
              fieldFormat.title = value;
              fieldFormat.name = lodash.camelCase(value);
            }

            if (property.includes('IsMandatory')) {
              fieldFormat.isMandatory = value;
            }

            if (property.includes('Type')) {
              fieldFormat.type = value;
            }

            if (property.includes('Length')) {
              fieldFormat.length = value;
            }

            if (property.includes('IsHeader')) {
              fieldFormat.isHeader = value;

              if (value) {
                counterIsHeader += 1;
                changeValueAttribute(lodash.camelCase(fieldFormat.name), fieldIndex);
              }

              if (!dataLine && !value) {
                // on create form and attribute on line
                templateDataLine.actual[0][fieldFormat.name] = '';
                templateDataLine.budget[0][fieldFormat.name] = '';
              }

              if (dataLine && !value) {
                const attr = { [`attribute${fieldIndex + 1}`]: fieldFormat.name };
                listAttributeOnLine.push(attr);
              }
            }

            if (property.includes('Description')) {
              fieldFormat.description = value;

              attributeField.push(fieldFormat);

              fieldFormat = {}
              fieldIndex += 1;
            }
          }
        }

        if (dataLine) {
          templateDataLine.actual = [];
          dataLine.forEach((item: any, index: number) => {
            templateDataLine.actual[index] = {};
            templateDataLine.actual[index].transactionType = item.transactiontype;
            templateDataLine.actual[index].description = item.description;
            templateDataLine.actual[index].journalEntryType = item.journalEntryType;
            templateDataLine.actual[index].enteredAmount = parseFloat(item.enteredAmount);
            templateDataLine.actual[index].accountedAmount = parseFloat(item.accountedAmount);

            listAttributeOnLine.forEach((itemAttr: any) => {
              Object.keys(itemAttr).forEach((item_: any) => {
                templateDataLine.actual[index][itemAttr[item_]] = item[item_];
              })
            })
          })
        }

        // console.log('tmp: ', templateDataLine);

        let isMinimumOneAttrOnHeader = false;
        if (counterIsHeader > 0) isMinimumOneAttrOnHeader = true;

        if (attributeField.length === 0) attributeField = null;

        this.setState({
          attributeField,
          disabledHeaderAttr,
          mandatoryHeaderAttr,
          isMinimumOneAttrOnHeader,
          dataLine: templateDataLine,
          headerDescriptionPlaceholderTemplate,
        });
      }
    } catch (e) {
      console.log('error at getAttributeField with error: ', e);
    }
  }

  getAccountingPeriod = async () => {
    try {
      const { headers } = this.state;

      const data = {
        state: ['FE', 'OP'],
      };

      const res = await HttpService.post('accounting-periods/state/start-end-date', data, headers);
      const result = res.data.datePeriod;
      const startDate = result.startDate;
      const endDate = result.endDate;

      interface accountingDate {
        startDate: string,
        endDate: string,
      }

      const hasil: accountingDate = {
        startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : startDate,
        endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : endDate
      };

      const accountingPeriod = hasil;
      this.setState({ accountingPeriod });
    } catch (e) {
      console.log('error at getAccountingPeriod with error: ', e);
    }
  }

  getTransactionStatus = (headerCode: string) => new Promise(async (resolve, reject) => {
    try {
      const data = { headerCode };
      const { headers } = this.state;

      const res = await HttpService.post('automatic-journal/corrected-transaction', data, headers);

      resolve(res.data.isCorrected);
    } catch (e) {
      console.log('error at getTransactionStatus with error: ', e);
      reject(e);
    }
  })

  showTransAndSubTransPopUp = () => {
    const message = 'This action may discard your change and cannot be undo. Are you sure?';

    const param = {
      type: 'warning',
      title: 'Attention!',
      confirmBtnBsStyle: 'default',
      cancelBtnBsStyle: 'danger',
      message,
      showCancel: true,
      focusConfirmBtn: false,
    };

    const onConfirm = () => { this.handleResetForm(); };
    const onCancel = () => { this.hideSweetAlert() };

    this.setState({
      sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
    });
  }

  handleChangeTransCategory = async (categoryId: string) => {
    try {
      const { flagChange } = this.state;
      if (categoryId === '') return;

      this.setState({ tmpSelectedTransCategory: categoryId, tmpSelectedSubTransCategory: '' });

      if (flagChange) {
        this.showTransAndSubTransPopUp();
        // if ganti category dan udah diisi form, muncul popup, kalo oke, reset semua dan call get list sub category
        // kalau ada sub category, setState listSubCategory
        // kalau gak ada sub category, call get transaction type based on category only
      } else {
        // if belom diisi, call api get list sub category based on category
        this.wrapperGetTransSubCategoryList(categoryId);
      }
    } catch (e) {
      console.log('error at handleChangeTransCategory with error: ', e);
    }
  }

  handleChangeSubTransCategory = async (subCategoryId: any) => {
    try {
      const { flagChange } = this.state;
      if (subCategoryId === '') return;

      this.setState({ tmpSelectedSubTransCategory: subCategoryId, tmpSelectedTransCategory: '' });

      const {
        selectedTransCategory,
      } = this.state

      if (flagChange) {
        // if ganti sub category dan udah diisi form, muncul popup
        // kalo oke, reset semua (kecuali selectedTransCategory) dan call get list transaction type based on cat and sub cat
        this.showTransAndSubTransPopUp();
      } else {
        // if belom diisi, call get list transaction type based on cat and sub cat
        this.getTransactionTypeList(selectedTransCategory, subCategoryId);
        this.getTransactionCode(selectedTransCategory, subCategoryId, false);
        this.getAttributeField(selectedTransCategory, subCategoryId, null);

        const selectedSubTransCategory = subCategoryId;
        this.setState({ selectedSubTransCategory });
      }
    } catch (e) {
      console.log('error at handleChangeSubTransCategory with error: ', e);
    }
  }

  wrapperGetTransSubCategoryList = async (categoryId: string) => {
    let res: any = await this.getTransSubCategoryList(categoryId);

    if (res.length <= 0) {
      // kalau gak ada sub category, call get transaction type based on category only
      const selectedTransCategory = categoryId;
      const isSubTransCategoryDisabled = true;
      const isCategoryHasSubCategory = false;
      this.setState({
        selectedTransCategory,
        isSubTransCategoryDisabled,
        isCategoryHasSubCategory,
        selectedSubTransCategory: ''
      });

      this.getTransactionTypeList(categoryId, null);
      this.getTransactionCode(categoryId, null, false);
      this.getAttributeField(categoryId, null, null);
    } else {
      // kalau ada sub category, setState listSubCategory dan selectedTransCategory
      const listSubCategory = [{ id: '', name: 'Sub Category', description: 'Select Sub Category' }, ...res];
      const selectedTransCategory = categoryId;
      const isSubTransCategoryDisabled = false;
      const isCategoryHasSubCategory = true;

      this.setState({
        listSubCategory,
        selectedTransCategory,
        isCategoryHasSubCategory,
        isSubTransCategoryDisabled,
        selectedSubTransCategory: '',
      });
    }
  }

  handleResetForm = () => {
    const {
      tmpSelectedTransCategory,
      tmpSelectedSubTransCategory,
      selectedTransCategory,
      selectedSubTransCategory,
      listSubCategory,
      attributeField,
    } = this.state;

    this.hideSweetAlert();

    let isChangeCategory = true;
    if (tmpSelectedSubTransCategory) isChangeCategory = false;

    if (attributeField) {
      attributeField.forEach((item: any) => {
        const { name } = item;

        this.setState({ [name]: null });
      })
    }

    this.setState({
      listSubCategory: isChangeCategory ? [{ id: '', name: 'Sub Category', description: 'Select One' }] : listSubCategory,
      transactionCode: '',
      selectedTransCategory: tmpSelectedTransCategory || selectedTransCategory,
      tmpSelectedTransCategory: '',
      selectedSubTransCategory: tmpSelectedSubTransCategory || selectedSubTransCategory,
      tmpSelectedSubTransCategory: '',
      selectedProduct: '',
      selectedProject: '',
      selectedCostCenter: '',
      selectedCustomer: '',
      selectedCurrency: 'IDR',
      accountingDate: '',
      description: '',
      exchangedRate: '1',
      listTransTypeActual: [{ id: '', name: 'Type', description: 'Select Transaction Type' }],
      listEvidence: [],
      attributeField: null,
      dataLine: {
        actual: [
          {
            transactionType: {
              id: "",
              name: ""
            },
            description: "",
            journalEntryType: "A",
            enteredAmount: "",
            accountedAmount: ""
          }
        ],
        budget: [
          {
            transactionType: {
              id: "",
              name: ""
            },
            description: "",
            journalEntryType: "B",
            enteredAmount: "",
            accountedAmount: ""
          }
        ],
      },
      actualEnteredAmount: 0,
      budgetEnteredAmount: 0,
      actualAccountedAmount: 0,
      budgetAccountedAmount: 0,
      flagChange: false,
    }, () => {
      if (isChangeCategory) {
        this.wrapperGetTransSubCategoryList(this.state.selectedTransCategory);
      } else {
        this.getTransactionTypeList(this.state.selectedTransCategory, this.state.selectedSubTransCategory);
        this.getTransactionCode(this.state.selectedTransCategory, this.state.selectedSubTransCategory, false);
        this.getAttributeField(this.state.selectedTransCategory, this.state.selectedSubTransCategory, null);
      }
    });
  }

  toggleTab = (tabPane: any, tab: any) => {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }

  handleAddDataLine = (isActual: boolean) => {
    const {
      dataLine,
    } = this.state;

    const templateData = { ...dataLine.actual[0] };
    Object.keys(templateData).forEach((item: any, index: number) => {
      templateData[item] = '';
      if (item === 'transactionType') templateData[item] = { id: '', name: '' };
      if (item === 'journalEntryType') templateData[item] = isActual ? 'A' : 'B';
    })

    const copyDataLine = { ...dataLine };
    if (isActual) {
      copyDataLine.actual.push(templateData);
    } else {
      copyDataLine.budget.push(templateData);
    }

    this.handleSumControlBalance(copyDataLine);

    this.setState({ dataLine: copyDataLine, flagChange: true });
  }

  handleDeleteDataLine = (isActual: boolean, index: number) => {
    const {
      dataLine,
    } = this.state;

    const copyDataLine = { ...dataLine };
    if (isActual) {
      copyDataLine.actual.splice(index, 1);
    } else {
      copyDataLine.budget.splice(index, 1);
    }

    this.handleSumControlBalance(copyDataLine);

    this.setState({ dataLine: copyDataLine, flagChange: true });
  }

  handleChangeEvidence = (e: any, action: string) => {
    if (action === 'add') {
      this.handleAddEvidence(e);
    } else {
      this.handleDeleteEvidence(e);
    }
  }

  handleAddEvidence = (e: any) => {
    const {
      headerId,
      listEvidence,
      listCreatedEvidence,
    } = this.state;

    const copyListCreatedEvidence = [...listCreatedEvidence, ...Array.from(e.target.files)];
    const newEvidenceData: Array<any> = [...listEvidence, ...Array.from(e.target.files)];

    if (headerId) {
      this.setState({ listEvidence: newEvidenceData, flagChange: true, listCreatedEvidence: copyListCreatedEvidence });
      return;
    }

    this.setState({ listEvidence: newEvidenceData, flagChange: true });
  }

  handleDeleteEvidence = (index: number) => {
    const {
      headerId,
      listEvidence,
      listDeletedEvidence,
      listCreatedEvidence,
    } = this.state;

    const copyEvidenceData = [...listEvidence];
    copyEvidenceData.splice(index, 1);

    if (headerId) {
      const isDeletedFileANewImage = listEvidence[index].name; // .name means new image
      if (!isDeletedFileANewImage) {
        const copyListDeletedEvidence = [...listDeletedEvidence, listEvidence[index]];
        this.setState({ listEvidence: copyEvidenceData, flagChange: true, listDeletedEvidence: copyListDeletedEvidence });
        return;
      }

      const findIndex = listCreatedEvidence.findIndex((obj: any) => obj.name === listEvidence[index].name);
      const copyListCreatedEvidence = [...listCreatedEvidence];
      copyListCreatedEvidence.splice(findIndex, 1);
      this.setState({ listEvidence: copyEvidenceData, flagChange: true, listCreatedEvidence: copyListCreatedEvidence });
      return;
    }
    this.setState({ listEvidence: copyEvidenceData, flagChange: true });
  }

  handleChangeInputField = (e: any) => {
    try {
      this.setState({ flagChange: true });

      if (e.target.name === 'selectedCurrency') {
        if (e.target.value === 'IDR') {
          this.setState({
            [e.target.name]: e.target.value,
            exchangedRate: '1',
          }, () => {
            this.handleChangeDataLineFromExchangedRate();
          });
          return;
        }

        this.setState({
          [e.target.name]: e.target.value,
        }, () => {
          this.handleChangeDataLineFromExchangedRate();
        });
        return;
      }

      if (e.target.name === 'exchangedRate') {
        this.setState({
          [e.target.name]: e.target.value,
        }, () => {
          this.handleChangeDataLineFromExchangedRate();
        });
        return;
      }

      this.setState({ [e.target.name]: e.target.value });
    } catch (e) {
      console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
    }
  }

  thousandSeparator = (x: any) => {
    let numb = x;
    if (typeof numb === 'string') numb = Number(numb);
    return numb.toLocaleString('en', { maximumFractionDigits: 4 });
  }

  handleCloseButton = () => {
    try {
      const { flagChange, isViewTransDetailMode, isCorrection } = this.state;

      if ((flagChange && !isViewTransDetailMode) || (flagChange && isCorrection)) {
        const message = 'This action may discard your change and cannot be undo. Are you sure?';

        const param = {
          type: 'warning',
          title: 'Attention!',
          confirmBtnBsStyle: 'default',
          showCancel: true,
          cancelBtnBsStyle: 'danger',
          message,
          focusConfirmBtn: false,
        };

        const onConfirm = () => { this.props.history.push("/automatic-journal"); };
        const onCancel = () => { this.hideSweetAlert() };

        this.setState({
          sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
        });

        return;
      }

      this.props.history.push("/automatic-journal");
    } catch (e) {
      console.log('error at handleCloseButton with error: ', e);
    }
  }

  handleChangeDataLineFromExchangedRate = () => {
    try {
      const { dataLine, exchangedRate } = this.state;

      let convertedExchangedRate = exchangedRate;
      if (typeof exchangedRate === 'string') convertedExchangedRate = Number(exchangedRate.replace(/,/g, ''));

      const copyDataLine = { ...dataLine };

      copyDataLine.actual.forEach((item: any) => {
        let convertedEnteredAmount = item.enteredAmount;
        if (typeof item.enteredAmount === 'string') convertedEnteredAmount = Number(item.enteredAmount.replace(/,/g, ''));
        item.accountedAmount = (convertedEnteredAmount * convertedExchangedRate).toString();
      });

      copyDataLine.budget.forEach((item: any) => {
        let convertedEnteredAmount = item.enteredAmount;
        if (typeof item.enteredAmount === 'string') convertedEnteredAmount = Number(item.enteredAmount.replace(/,/g, ''));
        item.accountedAmount = (convertedEnteredAmount * convertedExchangedRate).toString();
      });

      this.handleSumControlBalance(copyDataLine);

      this.setState({ dataLine: copyDataLine });
    } catch (e) {
      console.log('error at handleChangeDataLineFromExchangedRate with error: ', e);
    }
  }

  handleChangeDataLine = (e: any, index_: number, tabType: string, field: string) => {
    try {
      const { dataLine, listTransTypeActual, exchangedRate } = this.state;
      const copyDataLine = { ...dataLine };

      let convertedExchangedRate = exchangedRate;
      if (typeof exchangedRate === 'string') convertedExchangedRate = Number(exchangedRate.replace(/,/g, ''));

      const data = tabType === 'actual' ? copyDataLine.actual : copyDataLine.budget;

      data.forEach((item: any, index: number) => {
        if (index === index_) {
          if (field === 'transactionType') {
            if (e.target.value === '') return;
            item[field] = listTransTypeActual.find((obj: any) => obj.id === e.target.value);
          } else if (field === 'enteredAmount') {
            const enteredAmountInteger = Number(e.target.value.replace(/,/g, ''));
            item[field] = e.target.value;
            item.accountedAmount = (enteredAmountInteger * convertedExchangedRate).toString();
          } else {
            item[field] = e.target.value;
          }
        }
      })

      this.handleSumControlBalance(copyDataLine);

      this.setState({ dataLine: copyDataLine, flagChange: true });
    } catch (e) {
      console.log('error at handleChangeDataLine with error: ', e);
    }
  }

  handleSumControlBalance = (dataLine: any) => {
    try {
      let actualEnteredAmount = 0;
      let budgetEnteredAmount = 0;
      let actualAccountedAmount = 0;
      let budgetAccountedAmount = 0;

      dataLine.actual.forEach((item: any, index: number) => {
        const enteredAmount = item.enteredAmount.toString();
        const accountedAmount = item.accountedAmount.toString();

        actualEnteredAmount += Number(enteredAmount.replace(/,/g, ''));
        actualAccountedAmount += Number(accountedAmount.replace(/,/g, ''));
      })

      dataLine.budget.forEach((item: any, index: number) => {
        budgetEnteredAmount += Number(item.enteredAmount.replace(/,/g, ''));
        budgetAccountedAmount += Number(item.accountedAmount.replace(/,/g, ''));
      })

      this.setState({ actualEnteredAmount, budgetEnteredAmount, actualAccountedAmount, budgetAccountedAmount });
    } catch (e) {
      console.log('error at handleSumControlBalance with error: ', e);
    }
  }

  handleRemoveTransaction = async () => {
    try {
      const { headers } = this.state;

      await HttpService.delete(`automatic-journal/${this.state.headerId}`, null, headers);

      const message = 'Transaction Successfully Removed';
      const param = {
        type: 'success',
        title: 'Transaction Removed!',
        confirmBtnText: 'Ok',
        confirmBtnBsStyle: 'success',
        message,
        showCancel: false,
        focusConfirmBtn: false,
      };

      const onConfirm = () => { this.props.history.push("/automatic-journal"); };
      const onCancel = () => { this.props.history.push("/automatic-journal"); };

      this.setState({
        sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
      });
    } catch (e) {
      console.log('error at remove transaction with error: ', e);
    }
  }

  confirmRemoveTransaction = () => {
    try {
      const message = 'This action cannot be undo. Are you sure?';

      const param = {
        type: 'warning',
        title: 'Attention!',
        confirmBtnBsStyle: 'default',
        cancelBtnBsStyle: 'danger',
        message,
        showCancel: true,
        focusConfirmBtn: false,
      };

      const onConfirm = () => { this.handleRemoveTransaction(); };
      const onCancel = () => { this.hideSweetAlert(); };

      this.setState({
        sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
      });
    } catch (e) {
      console.log('error at confirmRemoveTransaction with error: ', e);
    }
  }

  handleSaveTransaction = async (isPostToGL: boolean) => {
    try {
      const {
        headerId,
        transactionCode,
        selectedTransCategory,
        selectedSubTransCategory,
        selectedOrganization,
        selectedProduct,
        selectedProject,
        selectedCostCenter,
        selectedCustomer,
        selectedCurrency,
        accountingDate,
        description,
        exchangedRate,
        listEvidence,
        listCreatedEvidence,
        listDeletedEvidence,

        listProduct,
        listProject,
        listCustomer,
        listCostCenter,
        listCategory,
        listSubCategory,
        listTransTypeActual,
        attributeField,
        actualEnteredAmount,
        budgetEnteredAmount,
        actualAccountedAmount,
        budgetAccountedAmount,
        dataLine,
        listCurrency,
        mandatoryHeaderAttr,
        isCorrection,
        correctionAjCode,
      } = this.state;
      const { resAuth } = this.props;
      if (headerId) {
        saveFormat.headerId = headerId;
      }

      let unFilledField = [];
      let message = '';
      if (!accountingDate || !exchangedRate || !description) {
        if (!accountingDate) unFilledField.push('Accounting Date');

        if (!exchangedRate) unFilledField.push('Exchanged Rate');

        if (!description) unFilledField.push('Description');
      }

      const defaultProduct = listProduct.find((obj: any) => obj.code === '000');
      const defaultProject = listProject.find((obj: any) => obj.code === '000');
      const defaultCostCenter = listCostCenter.find((obj: any) => obj.code === '000');
      const defaultCustomer = listCustomer.find((obj: any) => obj.code === '000');

      mandatoryHeaderAttr.forEach((item: string) => {
        if (item.includes('product') && (!selectedProduct || selectedProduct === defaultProduct.id)) {
          unFilledField.push('Product');
        }

        if (item.includes('project') && (!selectedProject || selectedProject === defaultProject.id)) {
          unFilledField.push('Project');
        }

        if (item.includes('costCenter') && (!selectedCostCenter || selectedCostCenter === defaultCostCenter.id)) {
          unFilledField.push('Cost Center');
        }

        if (item.includes('customer') && (!selectedCustomer || selectedCustomer === defaultCustomer.id)) {
          unFilledField.push('Customer');
        }

        if (item.includes('evidence') && listEvidence.length <= 0) {
          unFilledField.push('Evidence');
        }
      })

      const createdBy = resAuth.userName;

      saveFormat.postingState = isPostToGL ? 'PS' : 'UP';
      saveFormat.headerCode = transactionCode;
      saveFormat.transactionCategory = listCategory.find((obj: any) => obj.id === selectedTransCategory);
      saveFormat.transactionSubCategory = listSubCategory.find((obj: any) => obj.id === selectedSubTransCategory);
      saveFormat.organization = selectedOrganization;
      saveFormat.product = listProduct.find((obj: any) => selectedProduct ? obj.id === selectedProduct : obj.code === '000');
      saveFormat.project = listProject.find((obj: any) => selectedProject ? obj.id === selectedProject : obj.code === '000');
      saveFormat.costCenter = listCostCenter.find((obj: any) => selectedCostCenter ? obj.id === selectedCostCenter : obj.code === '000');
      saveFormat.customer = listCustomer.find((obj: any) => selectedCustomer ? obj.id === selectedCustomer : obj.code === '000');
      saveFormat.accountingDate = accountingDate;
      saveFormat.description = description;

      const currencyCode = listCurrency.find((obj: any) => obj.code === selectedCurrency);
      saveFormat.currencyCode = '';

      if (currencyCode) {
        saveFormat.currencyCode = currencyCode.code;
      }

      let exchangedRateValue = exchangedRate;
      if (typeof exchangedRate === 'string') exchangedRateValue = exchangedRate.replace(/,/g, '');
      saveFormat.exchangedRate = exchangedRateValue;

      if (attributeField) {
        attributeField.forEach((item: any, index: number) => {
          saveFormat[`attribute${index + 1}`] = '';
          if (item.isMandatory && !this.state[item.name] && item.isHeader) unFilledField.push(`${item.title}`);
          if (item.isHeader) saveFormat[`attribute${index + 1}`] = this.state[item.name] || '';
        });
      }

      saveFormat.actualEnteredAmount = actualEnteredAmount.toString();
      saveFormat.budgetEnteredAmount = budgetEnteredAmount.toString();
      saveFormat.actualAccountedAmount = actualAccountedAmount.toString();
      saveFormat.budgetAccountedAmount = budgetAccountedAmount.toString();

      let lineFormat: any = {};

      saveFormat.lines = [];
      const lines: Array<object> = [];

      let counterEmptyFieldOnDataLine = 0;

      dataLine.actual.forEach((item: any, index: number) => {
        const isTransTypeAvailInList = listTransTypeActual.find((obj: any) => obj.id === item.transactionType.id);

        if ((item.transactionType.id && isTransTypeAvailInList) || (isCorrection)) {
          lineFormat.lineNumber = index + 1;

          Object.keys(item).forEach((item_: any, index_: number) => {
            let dataValue = dataLine.actual[index][item_];

            let isDataValueANumber = false;

            if (dataValue) {
              const commaRemoved = typeof dataValue === 'string' ? dataValue.replace(/,/g, '') : dataValue;
              isDataValueANumber = !isNaN(commaRemoved) && isFinite(commaRemoved) && !/e/i.test(commaRemoved);
              if (isDataValueANumber) dataValue = parseFloat(commaRemoved);
            }

            let property = item_;

            if (attributeField) {
              const attribute = attributeField.find((obj: any) => obj.name === item_);
              const attributeIndex = attributeField.findIndex((obj: any) => obj.name === item_);

              if (attribute) {
                if (attribute.isHeader) return;
                property = `attribute${attributeIndex + 1}`;
              }
            }

            if (!dataValue || dataValue === 0 || dataValue === '0') counterEmptyFieldOnDataLine += 1;

            lineFormat[property] = dataValue;
          })
          lines.push(lineFormat);
          lineFormat = {};
        }
      });

      if (lines.length === 0) {
        unFilledField.push(`Transaction data line`);
      }

      if (isPostToGL && counterEmptyFieldOnDataLine > 0) {
        unFilledField.push('Field on data line');
      }

      if (!isCorrection) {
        if (unFilledField.length > 0) {
          unFilledField.forEach((item: string) => {
            message += `${item}, `;
          })

          const report = message.slice(0, -2);

          this.setState({ alertMessage: `Required but not filled yet: ${report}` }, () => {
            if (this.state.isAlert) {
              window.scrollTo({ top: 0 })
              return;
            }

            window.scrollTo({ top: 0 })
            this.toogleAlert();
          })
          return;
        }
      }

      saveFormat.lines = [...lines];

      saveFormat.isCorrection = isCorrection;
      saveFormat.correctionAjCode = "";

      if (isCorrection) {
        saveFormat.correctionAjCode = correctionAjCode;
      }

      saveFormat.totalEvidence = listEvidence.length;

      saveFormat.createdBy = createdBy;
      saveFormat.lastUpdatedBy = createdBy;

      if (isPostToGL) {
        saveFormat.postingCode = await this.getPostingCode(selectedTransCategory, selectedSubTransCategory, accountingDate);
        saveFormat.postingDate = new Date();
      }

      // console.log(saveFormat);

      const data = JSON.stringify(saveFormat);

      const formData = new FormData();
      formData.append('data', data);

      const headers: object = {
        Authorization: `Bearer ${this.props.resAuth.token}`,
        'Content-Type': 'multipart/form-data',
      };

      const pleaseWaitAlert = {
        type: 'info',
        title: 'Processing...',
        message: 'Please wait a moment...',
        showCancel: false,
        showConfirm: false,
      };

      let onConfirm = () => { };
      let onCancel = () => { };

      this.setState({ sweetAlert: <SweetAlert param={pleaseWaitAlert} onConfirm={onConfirm} onCancel={onCancel} /> });

      if (!this.state.headerId) {
        listEvidence.forEach((item: any) => {
          formData.append('evidence', item);
        });

        const role = isPostToGL ? ajRoles.AJ_PostToGl : ajRoles.AJ_Save;

        const permission = this.props.resAuth.roles.find((obj: any) => obj.role === role);
        const headers_ = {
          ...headers,
          role,
          permission: permission.permissions[0],
        }

        HttpService.post('automatic-journal', formData, headers_)
          .then((res: any) => {
            // console.log('res aj: ', res);
            const message = res.status === 413 ? 'File too large. Total maximum size is 10 MB' : res.data.message;

            const param = {
              type: 'success',
              title: 'Data Saved!',
              confirmBtnBsStyle: 'success',
              confirmBtnText: 'Ok',
              message,
              showCancel: false,
              focusConfirmBtn: false,
            };

            let onConfirm = () => { this.props.history.push("/automatic-journal"); };
            let onCancel = () => { this.props.history.push("/automatic-journal"); };

            if (res.status !== 200) {
              param.type = 'danger';
              param.title = 'Attention!';
              param.confirmBtnBsStyle = 'primary';

              onConfirm = () => { this.hideSweetAlert(); };
              onCancel = () => { this.hideSweetAlert(); };
            }

            this.setState({
              sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
            });
          })
          .catch((err: any) => {
            console.log('err: ', err);
          });
      } else if (isCorrection) {
        const permission = this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_CreateCorrection);
        const headers_ = {
          ...headers,
          role: ajRoles.AJ_CreateCorrection,
          permission: permission.permissions[0],
        }

        HttpService.post('automatic-journal/create-correction', formData, headers_)
          .then((res: any) => {
            // console.log('res: ', res);
            const message = res.data.message;

            const param = {
              type: 'success',
              title: 'Data Updated!',
              confirmBtnBsStyle: 'success',
              confirmBtnText: 'Ok',
              message,
              showCancel: false,
              focusConfirmBtn: false,
            };

            let onConfirm = () => { this.props.history.push("/automatic-journal"); };
            let onCancel = () => { this.props.history.push("/automatic-journal"); };

            if (res.status !== 200) {
              param.type = 'danger';
              param.title = 'Attention!';
              param.confirmBtnBsStyle = 'primary';

              onConfirm = () => { this.hideSweetAlert(); };
              onCancel = () => { this.hideSweetAlert(); };
            }

            this.setState({
              sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
            });
          })
          .catch((err: any) => {
            console.log('err: ', err);
          });
      } else {
        listCreatedEvidence.forEach((item: any) => {
          formData.append('createdEvidence', item);
        })

        listDeletedEvidence.forEach((item: any) => {
          formData.append('deletedEvidence', JSON.stringify(item));
        })

        formData.append('createdEvidenceLength', listCreatedEvidence.length);
        formData.append('deletedEvidenceLength', listDeletedEvidence.length);

        const role = isPostToGL ? ajRoles.AJ_PostToGl : ajRoles.AJ_Save;

        const permission = this.props.resAuth.roles.find((obj: any) => obj.role === role);
        const headers_ = {
          ...headers,
          role,
          permission: permission.permissions[0],
        }

        HttpService.put(`automatic-journal/${this.state.headerId}`, formData, headers_)
          .then((res: any) => {
            // console.log('res: ', res);
            const message = res.status === 413 ? 'File too large. Total maximum size is 10 MB' : res.data.message;

            const param = {
              type: 'success',
              title: 'Data Updated!',
              confirmBtnBsStyle: 'success',
              confirmBtnText: 'Ok',
              message,
              showCancel: false,
              focusConfirmBtn: false,
            };

            let onConfirm = () => { this.props.history.push("/automatic-journal") };
            let onCancel = () => { this.props.history.push("/automatic-journal") };

            if (res.status !== 200) {
              param.type = 'danger';
              param.title = 'Attention!';
              param.confirmBtnBsStyle = 'primary';

              onConfirm = () => { this.hideSweetAlert(); };
              onCancel = () => { this.hideSweetAlert(); };
            }

            this.setState({
              sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
            });
          })
          .catch((err: any) => {
            console.log('err: ', err);
          });
      }
    } catch (e) {
      console.log('error at save data with error: ', e);
    }
  }

  handleCreateCorrection = () => {
    try {
      const {
        selectedTransCategory, selectedSubTransCategory, dataLine,
        exchangedRate,
      } = this.state;
      this.getTransactionCode(selectedTransCategory, selectedSubTransCategory, true);

      let convertedExchangedRate = exchangedRate;
      if (typeof exchangedRate === 'string') convertedExchangedRate = Number(exchangedRate.replace(/,/g, ''));

      const copyDataLine = { ...dataLine };

      let actualEnteredAmount = 0;
      let actualAccountedAmount = 0;
      copyDataLine.actual.forEach((item: any) => {
        let convertedEnteredAmount = item.enteredAmount;
        if (typeof item.enteredAmount === 'string') convertedEnteredAmount = Number(item.enteredAmount.replace(/,/g, ''));
        item.enteredAmount = convertedEnteredAmount * -1;
        item.accountedAmount = (item.enteredAmount * convertedExchangedRate);
        actualEnteredAmount += item.enteredAmount;
        actualAccountedAmount += item.accountedAmount;
      });

      copyDataLine.budget.forEach((item: any) => {
        let convertedEnteredAmount = item.enteredAmount;
        if (typeof item.enteredAmount === 'string') convertedEnteredAmount = Number(item.enteredAmount.replace(/,/g, ''));
        item.enteredAmount = convertedEnteredAmount * -1;
        item.accountedAmount = (item.enteredAmount * convertedExchangedRate);
      });

      this.setState({
        isCorrection: true,
        postingState: 'UP',
        flagChange: true,
        dataLine: copyDataLine,
        actualEnteredAmount,
        actualAccountedAmount,
      });
      this.hideSweetAlert();
    } catch (e) {
      console.log('error at handleCreateCorrection with error: ', e);
    }
  }

  confirmCreateCorrection = () => {
    const message = 'Are you sure you want to create correction for this transaction?';

    const param = {
      type: 'warning',
      title: 'Attention!',
      confirmBtnBsStyle: 'default',
      cancelBtnBsStyle: 'danger',
      message,
      showCancel: true,
      focusConfirmBtn: false,
    };

    const onConfirm = () => { this.handleCreateCorrection(); };
    const onCancel = () => { this.hideSweetAlert(); };

    this.setState({
      sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
    });
  }

  confirmPostToGl = () => {
    const message = 'Are you sure you want to post this to GL?';

    const param = {
      type: 'warning',
      title: 'Attention!',
      confirmBtnBsStyle: 'default',
      cancelBtnBsStyle: 'danger',
      message,
      showCancel: true,
      focusConfirmBtn: false,
    };

    const onConfirm = () => { this.handleSaveTransaction(true); this.hideSweetAlert(); };
    const onCancel = () => { this.hideSweetAlert(); };

    this.setState({
      sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
    });
  }

  render() {
    const {
      headerId,
      isViewTransDetailMode,
      listCategory,
      listSubCategory,
      selectedTransCategory,
      selectedSubTransCategory,
      isSubTransCategoryDisabled,
      isCategoryHasSubCategory,
      postingState,
      selectedCurrency,
      attributeField,
      actualEnteredAmount,
      budgetEnteredAmount,
      actualAccountedAmount,
      budgetAccountedAmount,
      listTransTypeActual,
      dataLine,
      lastModifiedBy,
      lastModifiedDate,
      isTransCategoryDisabled,
      isCorrection,
      isTransactionCorrected,
      isMinimumOneAttrOnHeader,
    } = this.state;

    return (
      <div className="animated fadeIn">
        {/* Choose Transaction Category and Sub Category */}
        <Alert color="danger" isOpen={this.state.isAlert} toggle={this.toogleAlert} >
          {this.state.alertMessage}
        </Alert>
        <Container className="cat-subcat-container">
          <Container className="width-50-percent float-left">
            <Row className="cat-subcat-row">
              <Col md="2" lg="2" className="align-self-flex-end">
                <Label className="font-size-13">Transaction</Label>
              </Col>
              <Col md="5" lg="5">
                <span
                  data-for="selectedTransCategory"
                  data-tip={listCategory.find((obj: any) => obj.id === selectedTransCategory) ? listCategory.find((obj: any) => obj.id === selectedTransCategory).description : null}
                >
                  <Input
                    type="select"
                    name="selectSm"
                    className="form-tight-space"
                    value={selectedTransCategory}
                    onChange={e => this.handleChangeTransCategory(e.target.value)}
                    disabled={isTransCategoryDisabled}
                  >
                    {
                      listCategory.map((item: any, index: number) => {
                        const { name, id } = item;

                        return (
                          <option value={id} key={index}>{name}</option>
                        );
                      })
                    }
                  </Input>
                  {
                    !isTransCategoryDisabled && listCategory.find((obj: any) => obj.id === selectedTransCategory) && (
                      <ToolTipWrapper id="selectedTransCategory" />
                    )
                  }
                </span>
              </Col>

              <Col md="5" lg="5">
                <span
                  data-for="selectedSubTransCategory"
                  data-tip={listSubCategory.find((obj: any) => obj.id === selectedSubTransCategory) ? listSubCategory.find((obj: any) => obj.id === selectedSubTransCategory).description : null}
                >
                  <Input
                    type="select"
                    name="selectSm"
                    id="SelectLm"
                    className="form-tight-space"
                    onChange={e => this.handleChangeSubTransCategory(e.target.value)}
                    value={selectedSubTransCategory}
                    disabled={isSubTransCategoryDisabled}
                  >
                    {
                      listSubCategory.map((item: any, index: number) => {
                        const { name, id } = item;

                        return (
                          <option value={id} key={index}>{name}</option>
                        );
                      })
                    }
                  </Input>
                  {
                    (!isSubTransCategoryDisabled && listCategory.find((obj: any) => obj.id === selectedTransCategory)) && (
                      <ToolTipWrapper id="selectedSubTransCategory" />
                    )
                  }
                </span>
              </Col>
            </Row>
          </Container>

          {
            headerId && lastModifiedBy && (
              <Container className="width-50-percent float-right">
                <Row className="cat-subcat-row">
                  <Col md="12" lg="12" className="align-self-flex-end">
                    <Label className="last-update-label">
                      Last Updated: {lastModifiedBy}, {lastModifiedDate}
                    </Label>
                  </Col>
                </Row>
              </Container>
            )
          }
        </Container>

        {this.state.sweetAlert}
        {/* Transaction Header Form */}
        {
          (
            (isViewTransDetailMode) ||
            (selectedTransCategory !== '' && !isCategoryHasSubCategory) ||
            (selectedTransCategory !== '' && isCategoryHasSubCategory && selectedSubTransCategory !== '')
          ) && (
            <Fragment>
              <TransactionHeaderForm
                state={this.state}
                handleChangeInputField={(e: any) => this.handleChangeInputField(e)}
                handleChangeEvidence={(e: any, action: string) => this.handleChangeEvidence(e, action)}
              />

              {/* Dynamic Field */}
              {
                (attributeField && isMinimumOneAttrOnHeader) && (
                  <Container className="attribute-container" id="attr">
                    <Card className="attribute-card">
                      <CardBody className="pad-6">
                        <Row className="align-content-center">
                          {
                            attributeField.map((item: any, index: number) => {
                              const {
                                name, title, length,
                                isMandatory, type, isHeader,
                                description,
                              } = item;
                              if (!isHeader) {
                                return null;
                              }
                              return (
                                <Col md="2" lg="2" className="align-self-center" key={index}>
                                  <Label
                                    htmlFor="text-input"
                                    className="attribute-label"
                                    data-for={`attributeField${index}`}
                                    data-tip={description}
                                  >
                                    {title}
                                    {isMandatory && (<RequiredMark />)}
                                  </Label>
                                  <Input
                                    type={type || 'text'}
                                    name={name || 'name'}
                                    maxLength={length || undefined}
                                    placeholder={title || 'title'}
                                    className={`height-30 ${type === 'date' ? "remove-date-arrow" : ''}`}
                                    value={this.state[name] || ''}
                                    onChange={e => this.handleChangeInputField(e)}
                                    disabled={isViewTransDetailMode}
                                  />
                                  {
                                    !isViewTransDetailMode && (
                                      <ToolTipWrapper id={`attributeField${index}`} />
                                    )
                                  }
                                </Col>
                              );
                            })
                          }
                        </Row>
                      </CardBody>
                    </Card>
                  </Container>
                )
              }

              {/* Control Balance */}
              <Container className="pad-3-13">
                <Row>
                  <Col xs="12">
                    <Table hover bordered responsive className="control-balance-table">
                      <thead className="bgc-light-gray">
                        <tr>
                          <th className="control-balance-thead">Actual Amount</th>
                          <th className="control-balance-thead">Actual Accounted Amount</th>
                          <th className="control-balance-thead">Budget Amount</th>
                          <th className="control-balance-thead">Budget Accounted Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="control-balance-td">
                            {selectedCurrency} {this.thousandSeparator(actualEnteredAmount)}
                          </td>
                          <td className="control-balance-td">
                            IDR {this.thousandSeparator(actualAccountedAmount)}
                          </td>
                          <td className="control-balance-td">
                            {selectedCurrency} {this.thousandSeparator(budgetEnteredAmount)}
                          </td>
                          <td className="control-balance-td">
                            IDR {this.thousandSeparator(budgetAccountedAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Container>

              {/* Tab */}
              <Container className="pad-0">
                <Row className="pad-3-13">
                  <Col xs="12" md="12">
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '1'}
                          onClick={() => { this.toggleTab(0, '1'); }}
                        >
                          Actual
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '2'}
                          onClick={() => { this.toggleTab(0, '2'); }}
                        >
                          Budget
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab[0]}>
                      <TabPane tabId="1">
                        {
                          this.state.activeTab[0] === "1" && (
                            <DataLineTab
                              dataLine={dataLine}
                              onAddDataLine={(e: boolean) => this.handleAddDataLine(e)}
                              onDeleteDataLine={(e: boolean, index: number) => this.handleDeleteDataLine(e, index)}
                              tabType="actual"
                              listTransType={listTransTypeActual}
                              handleChangeDataLine={(e: any, index: number, tabType: string, field: string) => this.handleChangeDataLine(e, index, tabType, field)}
                              isViewTransDetailMode={isViewTransDetailMode}
                              isCorrection={isCorrection}
                              attributeField={attributeField}
                            />
                          )
                        }
                      </TabPane>
                      <TabPane tabId="2">
                        {
                          this.state.activeTab[0] === "2" && (
                            <DataLineTab
                              dataLine={dataLine}
                              onAddDataLine={(e: boolean) => this.handleAddDataLine(e)}
                              onDeleteDataLine={(e: boolean, index: number) => this.handleDeleteDataLine(e, index)}
                              tabType="budget"
                              listTransType={listTransTypeActual}
                              handleChangeDataLine={(e: any, index: number, tabType: string, field: string) => this.handleChangeDataLine(e, index, tabType, field)}
                              isViewTransDetailMode={isViewTransDetailMode}
                              isCorrection={isCorrection}
                              attributeField={attributeField}
                            />
                          )
                        }
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              </Container>

              {/* Form Action */}
              <Container className="form-action-container">
                <Container className="form-action-left">
                  <Row className="pad-3-13">
                    {
                      (
                        (this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_PostToGl)) &&
                        ((isCorrection && postingState === 'UP') ||
                          (!isViewTransDetailMode && postingState === 'UP')))
                      && (
                        <Col md="3" lg="3">
                          <Button
                            type="button"
                            color="success"
                            className="form-action-button"
                            onClick={this.confirmPostToGl}
                          >
                            <FontAwesomeIcon icon={faShare} /> &nbsp;
                            Post to GL
                          </Button>
                        </Col>
                      )
                    }

                    {
                      (this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_CreateCorrection)) &&
                      isViewTransDetailMode &&
                      postingState === 'PS' &&
                      !isTransactionCorrected &&
                      !isCorrection && (
                        <Col md="4" lg="4">
                          <Button
                            type="button"
                            color="primary"
                            className="form-action-button"
                            onClick={this.confirmCreateCorrection}
                          >
                            <i className="icon-pencil" /> &nbsp;
                            Create Correction
                          </Button>
                        </Col>
                      )
                    }

                    {
                      (this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_Remove)) &&
                      !isViewTransDetailMode &&
                      postingState === 'UP' &&
                      this.state.headerId && (
                        <Col md="3" lg="3">
                          <Button
                            type="button"
                            color="danger"
                            className="form-action-button"
                            onClick={this.confirmRemoveTransaction}
                          >
                            <i className="icon-trash" />&nbsp;
                            Remove
                          </Button>
                        </Col>
                      )
                    }
                  </Row>
                </Container>

                <Container className="form-action-right">
                  <Row className="pad-3-13">
                    <Col md="6" lg="6">
                      {
                        (this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_Save)) &&
                        !isViewTransDetailMode &&
                        postingState === 'UP' && (
                          <Button
                            type="button"
                            color="primary"
                            className="form-action-button"
                            onClick={() => this.handleSaveTransaction(false)}
                          >
                            <FontAwesomeIcon icon={faSave} /> &nbsp;
                            Save
                          </Button>
                        )
                      }
                    </Col>

                    <Col md="6" lg="6">
                      <Button
                        type="button"
                        color="danger"
                        className="form-action-button"
                        onClick={this.handleCloseButton}
                      >
                        <i className="icon-close" /> &nbsp;
                        Close
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Container>
            </Fragment>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

export default connect(mapStateToProps, null)(CreateTransaction);