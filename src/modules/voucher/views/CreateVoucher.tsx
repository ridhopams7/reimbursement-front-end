import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Label,
  Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { voucherRoles } from '../../../config';
import { SweetAlert } from '../../../components';
import { HttpService, handleRedirectUser } from '../../../utilities';
import {
  getEvidence,
  getLoadAttributeReferenceField,
  getattributeReferenceValueIsChange,
  // getPostingCode,
  getTransactionCode,
  validateSave,
  setAccountingPeriod,
  messageAction,
} from '../action/Lib';
import { DataLineTab, HeaderForm, ControlBalance, ActionForm, } from '../components';
import {
  saveFormat,
  ActionAlert,
  DataLineFormat,
  DataLineSaveFormat,
  journalEntryTypeList,
} from '../config/Constants';
import {
  Organizations,
  productsByOrganization,
  projectsByOrganization,
  costCentersByOrganization,
  customersByOrganization,
  accountingPeriodsByStateActive,
} from '../action/Master';

class CreateVoucher extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headerId: "",
      title: "",
      activeTab: new Array(1).fill('1'),
      dataLine: {
        actual: [{ ...DataLineFormat }],
      },
      postingState: "UP",
      transactionCode: '',
      postingCode: '',
      selectedOrganization: '',
      selectedProduct: '',
      selectedProject: '',
      selectedCostCenter: '',
      selectedCustomer: '',
      selectedCurrency: 'IDR',
      selectedAccountingPeriod: '',
      selectedJournalCategory: '',
      accountingDate: '',
      description: '',
      exchangedRate: '1',
      listProduct: [],
      listProject: [],
      listCostCenter: [],
      listCustomer: [],
      listTransTypeActual: [],
      listAccountingPeriod: [],
      listAccount: [],
      listEvidence: [],
      listCurrency: [],
      accountingPeriod: { startDate: '', endDate: '' },
      isTransCategoryDisabled: false,
      isSubTransCategoryDisabled: true,
      isCategoryHasSubCategory: true,
      isViewTransDetailMode: false,
      isWarning: false,
      attributeField: null,
      referenceField: null,
      evidence: [],
      ischangeAttribute: false,
      ischangeReference: false,
      actualDebit: 0,
      budgetDebit: 0,
      actualCredit: 0,
      budgetCredit: 0,
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
      isDuplicate: false,
      correctionAjCode: '',
      isTransactionCorrected: null,
      headers: { Authorization: `Bearer ${props.resAuth ? props.resAuth.token : ''}` },
    };
  }

  componentDidMount = async () => {
    try {

      const headerId = this.props.match.params ? this.props.match.params.headerId : null;
      const { headers } = this.state;
      let role = headerId ? voucherRoles.V_View : voucherRoles.V_Entry;
      let permission = null;
      permission = this.props.resAuth.roles.find((obj: any) => obj.role === role);

      if (!permission) {
        const message = "Unauthorized";
        this.handleKickPermission(message);
        return;
      }
      const headers_ = {
        ...headers,
        role: role,
        permission: permission.permissions[0],
      }

      this.setState({ headers: headers_, headerId }, () => {
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

  setSweetAlert = (param: any, action: string) => {
    let onConfirm = null;
    if (action === ActionAlert.Close) {
      onConfirm = () => {
        this.props.history.push("/voucher");
      };
    }
    else if (action === ActionAlert.Remove) {
      onConfirm = () => { this.handleRemoveTransaction() };
    }
    else if (action === ActionAlert.Duplicate) {
      onConfirm = () => { this.handleDuplicate() };
    }
    else if (action === ActionAlert.PostGL) {
      onConfirm = () => { this.handleSaveTransaction(true); this.hideSweetAlert(); };
    }
    const onCancel = () => { this.hideSweetAlert() };

    this.setState({
      sweetAlert: <SweetAlert param={param} onConfirm={onConfirm} onCancel={onCancel} />,
    });
  }

  handleKickPermission = (message: string) => {
    const { resAuth } = this.props;
    const data = handleRedirectUser(resAuth);
    const { param, url } = data;
    const copyParam = { ...param };
    copyParam.message = message;
    if (this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_View)) {
      const onConfirm = () => { this.props.history.push("/voucher"); };
      const onCancel = () => { this.props.history.push("/voucher"); };
      this.setState({
        sweetAlert: <SweetAlert param={copyParam} onConfirm={onConfirm} onCancel={onCancel} />,
      });
    }
    else {
      const onConfirm = () => { this.props.history.push(url); };
      const onCancel = () => { this.props.history.push(url); };
      this.setState({
        sweetAlert: <SweetAlert param={copyParam} onConfirm={onConfirm} onCancel={onCancel} />,
      });
    }
  }

  handleDuplicate = async () => {
    try {
      const {
        dataLine,
        headers,
        selectedOrganization,
      } = this.state;
      const copyData = { ...dataLine };
      let permission = null;
      permission = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Duplicate);
      const headers_ = {
        Authorization: headers.Authorization,
        role: voucherRoles.V_Duplicate,
        permission: permission.permissions[0],
      }
      const copyOrganization: any = await Organizations(headers_);
      const transactionCode = await getTransactionCode(true, headers_);
      if (copyOrganization[0].code !== selectedOrganization.code) {
        const copySelectedOrganization: any = { ...copyOrganization[0] };
        const copyListProduct: any = await productsByOrganization(copySelectedOrganization.id, headers);
        const copyListProject: any = await projectsByOrganization(copySelectedOrganization.id, headers);
        const copyListCostCenter: any = await costCentersByOrganization(copySelectedOrganization.id, headers);
        const copyListCustomer: any = await customersByOrganization(copySelectedOrganization.id, headers);
        const selectedProduct = copyListProduct[0].id;
        const selectedProject = copyListProject[0].id;
        const selectedCostCenter = copyListCostCenter[0].id;
        const selectedCustomer = copyListCustomer[0].id;

        const copyDataLine = [...copyData.actual];
        copyDataLine.forEach((item: any) => {
          item.evidence = [];
          item.costCenter = copyListCostCenter[0];
          item.customer = copyListCustomer[0];
          item.product = copyListProduct[0];
          item.project = copyListProject[0];
        });
        copyData.actual = [...copyDataLine];
        this.setState({
          transactionCode,
          selectedOrganization: copySelectedOrganization,
          selectedProduct,
          selectedProject,
          selectedCostCenter,
          selectedCustomer,
          title: "Duplicate Voucher",
          isViewTransDetailMode: false,
          isDuplicate: true,
          postingState: 'UP',
          flagChange: true,
          listEvidence: [],
          dataLine: copyData,
          listCustomer: copyListCustomer,
          listCostCenter: copyListCostCenter,
          listProject: copyListProject,
          listProduct: copyListProduct,
          listDeletedEvidence: [],
          listExistEvidence: []
        });
      } else {
        this.setState({
          transactionCode,
          title: "Duplicate Voucher",
          isViewTransDetailMode: false,
          isDuplicate: true,
          postingState: 'UP',
          flagChange: true,
          listEvidence: [],
          dataLine: copyData,
          listDeletedEvidence: [],
          listExistEvidence: []
        });
      }
      this.hideSweetAlert();
    } catch (e) {
      console.log('error at handleDuplicate with error: ', e);
    }
  }

  toogleAlert = () => {
    this.setState({
      isAlert: !this.state.isAlert,
    });
  }

  initialLoadCreateTransaction = async () => {
    try {
      const { headers } = this.state;
      const copydataLine = { ...DataLineFormat };
      const copyOrganization: any = await Organizations(headers);
      const selectedOrganization = copyOrganization[0];
      const copyListProduct: any = await productsByOrganization(selectedOrganization.id, headers);
      const copyListProject: any = await projectsByOrganization(selectedOrganization.id, headers);
      const copyListCostCenter: any = await costCentersByOrganization(selectedOrganization.id, headers);
      const copyListCustomer: any = await customersByOrganization(selectedOrganization.id, headers);
      const copyAccountingPeriods: any = await accountingPeriodsByStateActive(headers);
      const copyCurrency = this.props.currency;
      const copyListAccount = [{ id: "", code: "Account", codeName: "Account" }, ...this.props.account];
      const copyListAccountingPeriod = [{ id: "", code: "", name: "Select Accounting Period" }, ...copyAccountingPeriods];
      const selectedProduct = copyListProduct[0].id;
      const selectedProject = copyListProject[0].id;
      const selectedCostCenter = copyListCostCenter[0].id;
      const selectedCustomer = copyListCustomer[0].id;
      copydataLine.costCenter = copyListCostCenter[0];
      copydataLine.customer = copyListCustomer[0];
      copydataLine.account = copyListAccount[0];
      copydataLine.product = copyListProduct[0];
      copydataLine.project = copyListProject[0];
      const dataLine: any = {
        actual: [{ ...copydataLine }, { ...copydataLine }],
      };

      const transactionCode = await getTransactionCode(false, headers)
      this.setState({
        transactionCode,
        selectedOrganization,
        selectedProduct,
        selectedProject,
        selectedCostCenter,
        selectedCustomer,
        title: "Create New Voucher",
        dataLine,
        listCustomer: copyListCustomer,
        listCostCenter: copyListCostCenter,
        listProject: copyListProject,
        listProduct: copyListProduct,
        listAccount: copyListAccount,
        listCurrency: copyCurrency,
        listAccountingPeriod: copyListAccountingPeriod,
      });

    } catch (e) {
      console.log('error at initialLoadCreateTrans with error: ', e);
    }
  }

  initialLoadViewTransDetail = async () => {
    try {
      const { headers, headerId } = this.state;
      let dataLine: any = {
        actual: [],
      };
      const copydataLine = { ...DataLineFormat };
      const CopyheaderId = headerId;
      const resHeader = await HttpService.get(`je-headers/${CopyheaderId}`, null, headers);
      const resLines = await HttpService.get(`je-lines/${CopyheaderId}`, null, headers);

      if (resHeader.status !== 200 || resLines.status !== 200) {
        const message = resHeader.status !== 200 ? resHeader.data.message : resLines.data.message;
        this.handleKickPermission(message);
        return;
      }

      if (!resHeader.data.header || (resHeader.data.header && resHeader.data.header.length === 0)) {
        const message = `Data with id ${headerId} is not exist. Please contact your admin`;
        this.handleKickPermission(message);
        return;
      }


      const headerData = resHeader.data.header[0];
      const linesData = resLines.data.lines;

      const postingState = headerData.postingState;
      const selectedOrganization = {
        id: headerData.organizationId,
        code: headerData.organizationCode,
        name: headerData.organizationName,
      };

      let copyCurrency = this.props.currency;
      let copyListAccount = [{ id: "", code: "Account", codeName: "Account" }, ...this.props.account];
      let copyListAccountingPeriod: any = [];
      const initialAccountingperiod = [{ id: "", code: "", name: "Select Accounting Period" }];
      const copyListProduct: any = await productsByOrganization(selectedOrganization.id, headers);
      const copyListProject: any = await projectsByOrganization(selectedOrganization.id, headers);
      const copyListCostCenter: any = await costCentersByOrganization(selectedOrganization.id, headers);
      const copyListCustomer: any = await customersByOrganization(selectedOrganization.id, headers);
      const copyAccountingPeriods: any = await accountingPeriodsByStateActive(headers);
      if (postingState === "PS") {
        copyListAccountingPeriod = [...initialAccountingperiod, ...this.props.accPeriodAll];
      } else {
        copyListAccountingPeriod = [...initialAccountingperiod, ...copyAccountingPeriods];
      }


      const copyListEvidence = await getEvidence(headerId, headers);
      const transactionCode = headerData.headerCode;
      const postingCode = headerData.postingCode;
      const accountingDate = moment(headerData.accountingDate).format('YYYY-MM-DD');
      const description = headerData.description;
      const exchangedRate = parseFloat(headerData.exchangeRate);
      const selectedJournalCategory = headerData.journalCategory;
      const selectedCurrency = headerData.currencyCode;
      const selectedAccountingPeriod = headerData.accountingPeriodId;
      const selectedProduct = headerData.productId;
      const selectedProject = headerData.projectId;
      const selectedCostCenter = headerData.costCenterId;
      const selectedCustomer = headerData.customerId;
      const actualDebit = parseFloat(headerData.actualAccountedDr);
      const budgetDebit = parseFloat(headerData.budgetAccountedDr);
      const actualCredit = parseFloat(headerData.actualAccountedCr);
      const budgetCredit = parseFloat(headerData.budgetAccountedCr);
      let isViewTransDetailMode = false;
      let templateLine: any = { ...DataLineFormat };

      for (const item of linesData) {
        const {
          description, enteredDr, enteredCr, accountedDr, accountedCr, journalEntryType,
          accountId, productId, projectId, costCenterId, customerId, currencyCode, exchangeRate,
          attribute1, attribute2, attribute3, attribute4, attribute5, attribute6, attribute7, attribute8, attribute9, attribute10,
          reference1, reference2, reference3, reference4, reference5, reference6, reference7, reference8, reference9, reference10
        } = item;
        templateLine.description = description;
        templateLine.journalEntryType = journalEntryTypeList.find((obj: any) => obj.id === journalEntryType);
        templateLine.enteredDebit = parseFloat(enteredDr);
        templateLine.enteredCredit = parseFloat(enteredCr);
        templateLine.accountedDebit = parseFloat(accountedDr);
        templateLine.accountedCredit = parseFloat(accountedCr);
        templateLine.exchangeRate = parseFloat(exchangeRate);
        templateLine.currency = copyCurrency.find((obj: any) => obj.code === currencyCode);
        templateLine.isIDR = currencyCode === "IDR" ? true : false;
        templateLine.account = copyListAccount.find((obj: any) => obj.id === accountId);
        templateLine.product = copyListProduct.find((obj: any) => obj.id === productId);
        templateLine.project = copyListProject.find((obj: any) => obj.id === projectId);
        templateLine.costCenter = copyListCostCenter.find((obj: any) => obj.id === costCenterId);
        templateLine.customer = copyListCustomer.find((obj: any) => obj.id === customerId);
        templateLine.attribute1 = attribute1;
        templateLine.attribute2 = attribute2;
        templateLine.attribute3 = attribute3;
        templateLine.attribute4 = attribute4;
        templateLine.attribute5 = attribute5;
        templateLine.attribute6 = attribute6;
        templateLine.attribute7 = attribute7;
        templateLine.attribute8 = attribute8;
        templateLine.attribute9 = attribute9;
        templateLine.attribute10 = attribute10;
        templateLine.reference1 = reference1;
        templateLine.reference2 = reference2;
        templateLine.reference3 = reference3;
        templateLine.reference4 = reference4;
        templateLine.reference5 = reference5;
        templateLine.reference6 = reference6;
        templateLine.reference7 = reference7;
        templateLine.reference8 = reference8;
        templateLine.reference9 = reference9;
        templateLine.reference10 = reference10;
        templateLine.attributeField = getLoadAttributeReferenceField(accountId, "Attribute", copyListAccount);
        templateLine.referenceField = getLoadAttributeReferenceField(accountId, "Reference", copyListAccount);
        templateLine.ischangeAttribute = getattributeReferenceValueIsChange("Attribute", item);
        templateLine.ischangeReference = getattributeReferenceValueIsChange("Reference", item);
        dataLine.actual.push(templateLine);
        templateLine = { ...copydataLine };
      }

      if (linesData.length === 0) {
        copydataLine.costCenter = copyListCostCenter.find((obj: any) => obj.id === headerData.costCenterId);
        copydataLine.customer = copyListCustomer.find((obj: any) => obj.id === headerData.customerId);
        copydataLine.account = copyListAccount[0];
        copydataLine.product = copyListProduct.find((obj: any) => obj.id === headerData.productId);
        copydataLine.project = copyListProject.find((obj: any) => obj.id === headerData.projectId);
        dataLine.actual = [{ ...copydataLine }, { ...copydataLine }];
      }
      const permission = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Entry);
      const headers_ = {
        Authorization: headers.Authorization,
        role: voucherRoles.V_Entry,
        permission: permission.permissions[0],
      }
      const copyOrganization: any = await Organizations(headers_);

      if (postingState === "PS" ||
        copyOrganization[0].id !== headerData.organizationId ||
        !this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_View)) {
        isViewTransDetailMode = true;
      }

      this.setState({
        title: "View Voucher",
        listEvidence: copyListEvidence,
        listProduct: copyListProduct,
        listProject: copyListProject,
        listCostCenter: copyListCostCenter,
        listCustomer: copyListCustomer,
        listAccountingPeriod: copyListAccountingPeriod,
        listAccount: copyListAccount,
        listCurrency: copyCurrency,
        dataLine,
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
        isCategoryHasSubCategory: false,
        isViewTransDetailMode,
        isWarning: false,
        actualDebit,
        budgetDebit,
        actualCredit,
        budgetCredit,
        flagChange: false,
      })
    } catch (e) {
      console.log('error at initialLoadViewTransDetail with error: ', e);
    }
  }

  handleSubmitModal = (dataLinefroModal: any) => {
    try {
      const { dataLine } = this.state;
      const copyData = [...dataLinefroModal];
      copyData.forEach((item: any) => {
        item.ischangeAttribute = getattributeReferenceValueIsChange("Attribute", item);
        item.ischangeReference = getattributeReferenceValueIsChange("Reference", item);
      });

      const dataCopy = { ...dataLine };
      dataCopy.actual = copyData;
      this.setState({ dataLine: dataCopy });
    } catch (e) {
      console.log('error at handleSubmitAttribute with error: ', e);
    }
  }
  handleAddDataLine = (isActual: boolean) => {
    const {
      dataLine,
      listProduct,
      listProject,
      listAccount,
      listCostCenter,
      listCustomer,
      listCurrency,
      selectedProduct,
      selectedProject,
      selectedCostCenter,
      selectedCustomer,
      selectedCurrency,
      exchangedRate,
    } = this.state;
    const templateData = { ...DataLineFormat };
    templateData.product = listProduct.find((obj: any) => obj.id === selectedProduct);
    templateData.project = listProject.find((obj: any) => obj.id === selectedProject);
    templateData.costCenter = listCostCenter.find((obj: any) => obj.id === selectedCostCenter);
    templateData.customer = listCustomer.find((obj: any) => obj.id === selectedCustomer);
    templateData.currency = listCurrency.find((obj: any) => obj.code === selectedCurrency);
    templateData.isIDR = selectedCurrency === "IDR" ? true : false;
    templateData.exchangeRate = exchangedRate;
    templateData.account = listAccount[0];
    const copyDataLine = { ...dataLine };
    copyDataLine.actual.push(templateData);
    this.handleSumControlBalance(copyDataLine);

    this.setState({ dataLine: copyDataLine, flagChange: true });
  }

  handleDeleteDataLine = (isActual: boolean, index: number) => {
    const {
      dataLine,
    } = this.state;
    const copyDataLine = { ...dataLine };
    if (copyDataLine.actual.length > 1) {
      copyDataLine.actual.splice(index, 1);
      this.handleSumControlBalance(copyDataLine);
    }
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
      listEvidence,
      listDeletedEvidence,
      listCreatedEvidence,
      headerId,
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
      console.log(listCreatedEvidence[index].name, "test");
      console.log(listEvidence[index].name, "test");
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
      switch (e.target.name) {
        case "selectedCurrency":
          if (e.target.value === 'IDR') {
            this.setState({
              [e.target.name]: e.target.value,
              exchangedRate: '1'
            }, () => {
              this.handleChangeDataLineFromDefaultValue("selectedCurrency");
            });
          }
          this.setState({
            [e.target.name]: e.target.value,
          }, () => {
            this.handleChangeDataLineFromDefaultValue("selectedCurrency");
          });
          break;
        case "exchangedRate":
          this.setState({
            [e.target.name]: e.target.value,
          }, () => {
            this.handleChangeDataLineFromDefaultValue("exchangedRate");
          });
          break;
        case "selectedProject":
          this.setState({
            [e.target.name]: e.target.value,
          }, () => {
            this.handleChangeDataLineFromDefaultValue("selectedProject");
          });
          break;
        case "selectedProduct":
          this.setState({
            [e.target.name]: e.target.value,
          }, () => {
            this.handleChangeDataLineFromDefaultValue("selectedProduct");
          });
          break;
        case "selectedCostCenter":
          this.setState({
            [e.target.name]: e.target.value,
          }, () => {
            this.handleChangeDataLineFromDefaultValue("selectedCostCenter");
          });
          break;
        case "selectedCustomer":
          this.setState({
            [e.target.name]: e.target.value,
          }, () => {
            this.handleChangeDataLineFromDefaultValue("selectedCustomer");
          });
          break;
        case "selectedAccountingPeriod":
          const { listAccountingPeriod, accountingDate, selectedAccountingPeriod } = this.state;
          const copyaccountingPeriod = listAccountingPeriod.find((obj: any) => obj.id === e.target.value);
          const accountingPeriod = setAccountingPeriod(copyaccountingPeriod);
          let copyAccountingDate = "";
          if (selectedAccountingPeriod === e.target.value) {
            copyAccountingDate = accountingDate;
          }
          this.setState({
            [e.target.name]: e.target.value,
            accountingPeriod: accountingPeriod,
            accountingDate: copyAccountingDate,
          });
          break;
        default:
          this.setState({ [e.target.name]: e.target.value });
      }
    } catch (e) {
      console.log(`error at handleChangeInputField for ${e.target.name} with error: `, e);
    }
  }

  handleChangeDataLineFromDefaultValue = (field: string) => {
    try {
      const { dataLine, exchangedRate, selectedCurrency,
        selectedProduct,
        selectedProject,
        selectedCostCenter,
        selectedCustomer,
        listProduct,
        listProject,
        listCostCenter,
        listCustomer,
      } = this.state;
      const copyDataLine = { ...dataLine };
      if (copyDataLine.actual.length <= 2 && copyDataLine.actual.length > 0) {
        switch (field) {
          case "exchangedRate":
            let convertedExchangedRate = exchangedRate;
            if (typeof exchangedRate === 'string') convertedExchangedRate = Number(exchangedRate.replace(/,/g, ''));
            copyDataLine.actual.forEach((item: any) => {
              item.exchangeRate = convertedExchangedRate;
              item.accountedDebit = (item.enteredDebit * convertedExchangedRate).toString();
              item.accountedCredit = (item.enteredCredit * convertedExchangedRate).toString();
            });
            this.handleSumControlBalance(copyDataLine);
            break;
          case "selectedCurrency":
            copyDataLine.actual.forEach((item: any) => {
              item.currency.code = selectedCurrency;
              item.exchangeRate = exchangedRate;
              item.isIDR = selectedCurrency === "IDR" ? true : false;
            });
            break;
          case "selectedProduct":
            copyDataLine.actual.forEach((item: any) => {
              item.product = listProduct.find((obj: any) => obj.id === selectedProduct);
            });
            break;
          case "selectedProject":
            copyDataLine.actual.forEach((item: any) => {
              item.project = listProject.find((obj: any) => obj.id === selectedProject);
            });
            break;
          case "selectedCostCenter":
            copyDataLine.actual.forEach((item: any) => {
              item.costCenter = listCostCenter.find((obj: any) => obj.id === selectedCostCenter);
            });
            break;
          case "selectedCustomer":
            copyDataLine.actual.forEach((item: any) => {
              item.customer = listCustomer.find((obj: any) => obj.id === selectedCustomer);
            });
            break;
        }
        this.setState({ dataLine: copyDataLine });
      }

    } catch (e) {
      console.log('error at handleChangeDataLineFromDefaultValue with error: ', e);
    }
  }

  handleChangeDataLine = (e: any, index_: number, field: string) => {
    try {
      const {
        dataLine,
        listCurrency,
        listProduct,
        listProject,
        listCostCenter,
        listCustomer,
        listAccount,
      } = this.state;
      const copyDataLine = { ...dataLine };

      const data = copyDataLine.actual;

      data.forEach((item: any, index: number) => {
        if (index === index_) {
          let convertedExchangedRate = item.exchangeRate;
          if (typeof convertedExchangedRate === 'string') convertedExchangedRate = Number(convertedExchangedRate.replace(/,/g, ''));
          if (field === 'currency') {
            if (e.target.value === '') return;
            item[field] = listCurrency.find((obj: any) => obj.code === e.target.value);
            item.isIDR = e.target.value !== "IDR" ? false : true;

            if (e.target.value === "IDR") {
              item.exchangeRate = 1;
              const enteredDebitInteger = item.enteredDebit ? Number(item.enteredDebit.toString().replace(/,/g, '')) : 0;
              const enteredCreditInteger = item.enteredCredit ? Number(item.enteredCredit.toString().replace(/,/g, '')) : 0;
              item.exchangeRate = 1;
              item.accountedDebit = (enteredDebitInteger * 1).toString();
              item.accountedCredit = (enteredCreditInteger * 1).toString();
            }
          } else if (field === 'exchangeRate') {
            const exchangeRateInteger = Number(e.target.value.replace(/,/g, ''));
            const enteredDebitInteger = item.enteredDebit ? Number(item.enteredDebit.toString().replace(/,/g, '')) : 0;
            const enteredCreditInteger = item.enteredCredit ? Number(item.enteredCredit.toString().replace(/,/g, '')) : 0;
            item[field] = exchangeRateInteger.toString();
            item.accountedDebit = (enteredDebitInteger * exchangeRateInteger).toString();
            item.accountedCredit = (enteredCreditInteger * exchangeRateInteger).toString();
          } else if (field === 'enteredDebit') {
            const enteredDebitInteger = Number(e.target.value.replace(/,/g, ''));
            item[field] = enteredDebitInteger.toString();
            item.accountedDebit = (enteredDebitInteger * convertedExchangedRate).toString();
          } else if (field === 'enteredCredit') {
            const enteredCreditInteger = Number(e.target.value.replace(/,/g, ''));
            item[field] = enteredCreditInteger.toString();
            item.accountedCredit = (enteredCreditInteger * convertedExchangedRate).toString();
          } else if (field === 'accountid') {
            if (e.value === "") {
              item.accountedDebit = "";
              item.accountedCredit = "";
              item.enteredDebit = "";
              item.enteredCredit = "";
              item.exchangeRate = "1";
              item.description = "";
              item.isIDR = true;
              item.currency = "IDR";
              item.attributeField = null;
              item.referenceField = null;
              item.evidence = [];
            }
            else if (item.account.id !== e.value) {
              item.ischangeAttribute = false;
              item.ischangeReference = false;
              item.attribute1 = "";
              item.attribute2 = "";
              item.attribute3 = "";
              item.attribute4 = "";
              item.attribute5 = "";
              item.attribute6 = "";
              item.attribute7 = "";
              item.attribute8 = "";
              item.attribute9 = "";
              item.attribute10 = "";
              item.reference1 = "";
              item.reference2 = "";
              item.reference3 = "";
              item.reference4 = "";
              item.reference5 = "";
              item.reference6 = "";
              item.reference7 = "";
              item.reference8 = "";
              item.reference9 = "";
              item.reference10 = "";
            }
            item.account = e === null ? "" : listAccount.find((obj: any) => obj.id === e.value);
            item.attributeField = getLoadAttributeReferenceField(e.value, "Attribute", listAccount);
            item.referenceField = getLoadAttributeReferenceField(e.value, "Reference", listAccount);
          } else if (field === 'productId') {
            item.product = e === null ? "" : listProduct.find((obj: any) => obj.id === e.value);
          } else if (field === 'projectId') {
            item.project = e === null ? "" : listProject.find((obj: any) => obj.id === e.value);
          } else if (field === 'costCenterId') {
            item.costCenter = e === null ? "" : listCostCenter.find((obj: any) => obj.id === e.value);
          } else if (field === 'customerId') {
            item.customer = e === null ? "" : listCustomer.find((obj: any) => obj.id === e.value);
          } else if (field === 'journalEntryType') {
            item.journalEntryType = e === null ? "" : journalEntryTypeList.find((obj: any) => obj.id === e.target.value);
          }
          else {
            item[field] = e.target.value;
          }
        }
      })

      this.handleSumControlBalance(copyDataLine);
    } catch (e) {
      console.log('error at handleChangeDataLine with error: ', e);
    }
  }

  handleSumControlBalance = (dataLine: any) => {
    try {
      let actualDebit = 0;
      let actualCredit = 0;
      let budgetDebit = 0;
      let budgetCredit = 0;

      dataLine.actual.forEach((item: any, index: number) => {
        const accountedDebit = item.accountedDebit.toString();
        const accountedCredit = item.accountedCredit.toString();
        if (item.journalEntryType.id === "A") {
          actualDebit += Number(accountedDebit.replace(/,/g, ''));
          actualCredit += Number(accountedCredit.replace(/,/g, ''));
        }
        else {
          budgetDebit += Number(accountedDebit.replace(/,/g, ''));
          budgetCredit += Number(accountedCredit.replace(/,/g, ''));
        }
      })
      this.setState({ dataLine, actualDebit, budgetDebit, actualCredit, budgetCredit, flagChange: true });
    } catch (e) {
      console.log('error at handleSumControlBalance with error: ', e);
    }
  }

  handleRemoveTransaction = async () => {
    try {
      const { headers } = this.state;
      const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Remove);
      const token: any = { ...headers };
      const copyheaders = {
        Authorization: token.Authorization,
        role: voucherRoles.V_Remove,
        permission: userRoles.permissions[0],
      }
      await HttpService.delete(`je/${this.state.headerId}`, null, copyheaders)
        .then((res: any) => {
          const params = messageAction(res, "Deleted");
          let onConfirm = () => {
            this.props.history.push("/voucher");
          };
          let onCancel = () => {
            this.props.history.push("/voucher");
          };
          if (!params.isSucces) {
            onConfirm = () => { this.hideSweetAlert(); };
            onCancel = () => { this.hideSweetAlert(); };
          }
          this.setState({
            sweetAlert: <SweetAlert param={params.param} onConfirm={onConfirm} onCancel={onCancel} />,
            isAlert: false,
          });
        })
        .catch((err: any) => {
          console.log('err: ', err);
        });

    } catch (e) {
      console.log('error at remove transaction with error: ', e);
    }
  }


  handleSaveTransaction = async (isPostToGL: boolean) => {
    try {
      const {
        transactionCode,
        selectedJournalCategory,
        selectedOrganization,
        selectedProduct,
        selectedProject,
        selectedCostCenter,
        selectedCustomer,
        selectedCurrency,
        selectedAccountingPeriod,
        accountingDate,
        description,
        exchangedRate,
        listEvidence,
        listDeletedEvidence,
        listCreatedEvidence,
        listProduct,
        listProject,
        listCustomer,
        listCostCenter,
        listAccountingPeriod,
        listAccount,
        actualDebit,
        budgetDebit,
        actualCredit,
        budgetCredit,
        dataLine,
        listCurrency,
        isDuplicate,
        headers,
        headerId
      } = this.state;
      const {
        resAuth,
      } = this.props;

      if (headerId) {
        saveFormat.headerId = headerId;
      }
      const message = validateSave(this.state);
      if (message) {
        this.setState({ alertMessage: `Required but not filled yet: ${message}` }, () => {
          if (this.state.isAlert) {
            document.documentElement.scrollTop = 0;
            return;
          }

          document.documentElement.scrollTop = 0;
          this.toogleAlert();
        })
        return;
      }
      const createdBy = resAuth.userName;
      saveFormat.postingState = isPostToGL ? 'PS' : 'UP';
      saveFormat.journalCategory = selectedJournalCategory;
      saveFormat.headerCode = transactionCode;
      saveFormat.organization = selectedOrganization;
      saveFormat.accountingPeriod = listAccountingPeriod.find((obj: any) => obj.id === selectedAccountingPeriod);
      saveFormat.product = listProduct.find((obj: any) => obj.id === selectedProduct);
      saveFormat.project = listProject.find((obj: any) => obj.id === selectedProject);
      saveFormat.costCenter = listCostCenter.find((obj: any) => obj.id === selectedCostCenter);
      saveFormat.customer = listCustomer.find((obj: any) => obj.id === selectedCustomer);
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
      saveFormat.actualAccountedDebitAmount = actualDebit.toString();
      saveFormat.budgetAccountedDebitAmount = budgetDebit.toString();
      saveFormat.actualAccountedCreditAmount = actualCredit.toString();
      saveFormat.budgetAccountedCreditAmount = budgetCredit.toString();

      let lineFormat: any = { ...DataLineSaveFormat };

      saveFormat.lines = [];
      const lines: Array<object> = [];
      dataLine.actual.forEach((item: any, index: number) => {
        const {
          account,
          product,
          project,
          costCenter,
          customer,
          currency,
          journalEntryType,
          description,
          enteredDebit,
          accountedDebit,
          enteredCredit,
          accountedCredit,
          exchangeRate,
          attribute1,
          attribute2,
          attribute3,
          attribute4,
          attribute5,
          attribute6,
          attribute7,
          attribute8,
          attribute9,
          attribute10,
          reference1,
          reference2,
          reference3,
          reference4,
          reference5,
          reference6,
          reference7,
          reference8,
          reference9,
          reference10,
        } = item;
        lineFormat.lineNumber = index + 1;
        lineFormat.description = description;
        lineFormat.enteredDebit = enteredDebit;
        lineFormat.accountedDebit = accountedDebit;
        lineFormat.enteredCredit = enteredCredit;
        lineFormat.accountedCredit = accountedCredit;
        lineFormat.currencyCode = currency.code;
        lineFormat.account = {};
        lineFormat.account = { ...listAccount.find((obj: any) => obj.id === account.id) };
        lineFormat.product = {};
        lineFormat.product = { ...listProduct.find((obj: any) => obj.id === product.id) };
        lineFormat.project = {};
        lineFormat.project = { ...listProject.find((obj: any) => obj.id === project.id) };
        lineFormat.costCenter = {};
        lineFormat.costCenter = { ...listCostCenter.find((obj: any) => obj.id === costCenter.id) };
        lineFormat.customer = {};
        lineFormat.customer = { ...listCustomer.find((obj: any) => obj.id === customer.id) };
        lineFormat.journalEntryType = journalEntryType.id;
        lineFormat.exchangeRate = exchangeRate;
        lineFormat.attribute1 = attribute1;
        lineFormat.attribute2 = attribute2;
        lineFormat.attribute3 = attribute3;
        lineFormat.attribute4 = attribute4;
        lineFormat.attribute5 = attribute5;
        lineFormat.attribute6 = attribute6;
        lineFormat.attribute7 = attribute7;
        lineFormat.attribute8 = attribute8;
        lineFormat.attribute9 = attribute9;
        lineFormat.attribute10 = attribute10;
        lineFormat.reference1 = reference1;
        lineFormat.reference2 = reference2;
        lineFormat.reference3 = reference3;
        lineFormat.reference4 = reference4;
        lineFormat.reference5 = reference5;
        lineFormat.reference6 = reference6;
        lineFormat.reference7 = reference7;
        lineFormat.reference8 = reference8;
        lineFormat.reference9 = reference9;
        lineFormat.reference10 = reference10;

        lines.push(lineFormat);
        lineFormat = {};
      });


      saveFormat.lines = [...lines];
      saveFormat.totalEvidence = listEvidence === null ? 0 : listEvidence.length;
      saveFormat.createdBy = createdBy;
      saveFormat.lastUpdatedBy = createdBy;
      let role = voucherRoles.V_Save;
      const token: any = { ...headers };
      if (isPostToGL) {
        role = voucherRoles.V_PostToGl;
        const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === role);
        const headersPostingCode = {
          Authorization: token.Authorization,
          role: role,
          permission: userRoles.permissions[0],
        }
        saveFormat.postingCode = await this.getPostingCode(saveFormat.accountingPeriod.code, headersPostingCode);
        saveFormat.postingDate = new Date();

      }
      const data = JSON.stringify(saveFormat);
      const formData = new FormData();
      formData.append('data', data);
      const userRoles = this.props.resAuth.roles.find((obj: any) => obj.role === role);
      const headersmultipart: object = {
        Authorization: token.Authorization,
        role: role,
        permission: userRoles.permissions[0],
        'Content-Type': 'multipart/form-data',
      };
      console.log(listEvidence);
      if (!this.state.headerId || isDuplicate) {
        listEvidence.forEach((item: any) => {
          formData.append('evidence', item);
        });

        HttpService.post('je', formData, headersmultipart)
          .then((res: any) => {
            const params = messageAction(res, "Saved");
            let onConfirm = () => {
              this.props.history.push("/voucher");
            };
            let onCancel = () => {
              this.props.history.push("/voucher");
            };
            if (!params.isSucces) {
              onConfirm = () => { this.hideSweetAlert(); };
              onCancel = () => { this.hideSweetAlert(); };
            }
            this.setState({
              sweetAlert: <SweetAlert param={params.param} onConfirm={onConfirm} onCancel={onCancel} />,
              isAlert: false,
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

        HttpService.put(`je/${this.state.headerId}`, formData, headersmultipart)
          .then((res: any) => {
            const params = messageAction(res, "Updated");
            let onConfirm = () => {
              this.props.history.push("/voucher");
            };
            let onCancel = () => {
              this.props.history.push("/voucher");
            };
            if (!params.isSucces) {
              onConfirm = () => { this.hideSweetAlert(); };
              onCancel = () => { this.hideSweetAlert(); };
            }
            this.setState({
              sweetAlert: <SweetAlert param={params.param} onConfirm={onConfirm} onCancel={onCancel} />,
              isAlert: false,
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

  getPostingCode = (accountingPeriodCode: String, headers: any) => new Promise(async (resolve, reject) => {
    try {

      const param: any = {
        accountingPeriodCode,
      };
      const res = await HttpService.get('je-posting-code', { param }, headers);

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

      const postingCode = res.data.message.code;

      resolve(postingCode);
    } catch (e) {
      console.log('error at getTransactionCode with error: ', e);
      reject(e);
    }
  })
  render() {
    const {
      isViewTransDetailMode,
      postingState,
      postingCode,
      transactionCode,
      selectedOrganization,
      selectedProduct,
      selectedProject,
      selectedCostCenter,
      selectedCustomer,
      selectedCurrency,
      selectedAccountingPeriod,
      accountingDate,
      description,
      exchangedRate,
      listProduct,
      listProject,
      listCostCenter,
      listCustomer,
      listEvidence,
      listAccount,
      listAccountingPeriod,
      accountingPeriod,
      actualDebit,
      budgetDebit,
      actualCredit,
      budgetCredit,
      listTransTypeActual,
      dataLine,
      selectedJournalCategory,
      listCurrency,
      flagChange,
      isDuplicate,
      headerId,
    } = this.state;

    return (
      <div className="animated fadeIn">

        <Alert color="danger" isOpen={this.state.isAlert} toggle={this.toogleAlert} >
          {this.state.alertMessage}
        </Alert>
        <Row style={{ marginBottom: 10 }}>
          <Col>
            <Label style={{ fontSize: 17, color: 'grey' }}><b> {this.state.title}</b></Label>
          </Col>
        </Row>

        {this.state.sweetAlert}
        {/* Header Form */}
        {
          <Fragment>
            <HeaderForm
              isViewTransDetailMode={isViewTransDetailMode}
              postingState={postingState}
              postingCode={postingCode}
              transactionCode={transactionCode}
              selectedOrganization={selectedOrganization}
              selectedProduct={selectedProduct}
              selectedProject={selectedProject}
              selectedCostCenter={selectedCostCenter}
              selectedCustomer={selectedCustomer}
              selectedCurrency={selectedCurrency}
              selectedAccountingPeriod={selectedAccountingPeriod}
              selectedJournalCategory={selectedJournalCategory}
              accountingDate={accountingDate}
              description={description}
              exchangedRate={exchangedRate}
              listProduct={listProduct}
              listProject={listProject}
              listCostCenter={listCostCenter}
              listCustomer={listCustomer}
              listEvidence={listEvidence}
              listCurrency={listCurrency}
              listAccountingPeriod={listAccountingPeriod}
              accountingPeriod={accountingPeriod}
              handleChangeInputField={(e: any) => this.handleChangeInputField(e)}
              handleChangeEvidence={(e: any, action: string) => this.handleChangeEvidence(e, action)}

            />
            {/* Control Balance */}
            <ControlBalance
              actualCredit={actualCredit}
              actualDebit={actualDebit}
              budgetDebit={budgetDebit}
              budgetCredit={budgetCredit}>
            </ControlBalance>

            {/* Tab */}
            <DataLineTab
              dataLine={dataLine}
              onAddDataLine={(e: boolean) => this.handleAddDataLine(e)}
              onSubmitModal={(e: any) => this.handleSubmitModal(e)}
              onDeleteDataLine={(e: boolean, index: number) => this.handleDeleteDataLine(e, index)}
              type="actual"
              selectedOrganization={selectedOrganization}
              selectedProduct={selectedProduct}
              selectedProject={selectedProject}
              selectedCostCenter={selectedCostCenter}
              selectedCustomer={selectedCustomer}
              selectedCurrency={selectedCurrency}
              listProduct={listProduct}
              listProject={listProject}
              listCostCenter={listCostCenter}
              listCustomer={listCustomer}
              listEvidence={listEvidence}
              listCurrency={listCurrency}
              listAccount={listAccount}
              listTransType={listTransTypeActual}
              handleChangeDataLine={(e: any, index: number, field: string) => this.handleChangeDataLine(e, index, field)}
              isViewTransDetailMode={isViewTransDetailMode}
              isDuplicate={isDuplicate}
            />


            {/* Form Action */}
            <ActionForm
              headerId={headerId}
              flagChange={flagChange}
              isDuplicate={isDuplicate}
              isViewTransDetailMode={isViewTransDetailMode}
              postingState={postingState}
              handleSaveTransaction={(isPostGL: boolean) => this.handleSaveTransaction(isPostGL)}
              setSweetAlert={(param: any, action: string) => this.setSweetAlert(param, action)}
              history={this.props.history}
            />

          </Fragment>
        }
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
  account: state.account.res,
  accPeriodAll: state.accPeriodAll.res,
  currency: state.currency.res,
});
export default connect(mapStateToProps, null)(CreateVoucher);
