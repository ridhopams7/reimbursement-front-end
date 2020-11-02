import { HttpService } from "./HttpService";

export const masterTypesAll = (headers: any) => new Promise(async (resolve, reject) => {
    try {
        let listMenus: object[] = [];

        const res = await HttpService.get(`master-types-all`, null, headers);
        const result: object[] = [];
        // console.log(res);

        if (res.status === 200 && res.data) {
            res.data.message.masterTypes.forEach((item: any) => {
                let data = {
                    ...item,
                    codeName: `${item.code} - ${item.name}`
                }

                result.push(data);
                data = {};
            });
            listMenus = [{ id: "", code: "", codeName: "Select" }, ...result];
        }

        resolve(listMenus);
    } catch (e) {
        console.log('error at get request projectsByOrganization with error: ', e);
        reject(e);
    }
});

export const menusAll = (headers: any) => new Promise(async (resolve, reject) => {
    try {
        let listMasterTypes: object[] = [];

        const res = await HttpService.get(`menus-all`, null, headers);
        const result: object[] = [];
        // console.log(res);

        if (res.status === 200 && res.data) {
            res.data.message.menus.forEach((item: any) => {
                let data = {
                    ...item,
                    codeName: `${item.code} - ${item.name}`
                }

                result.push(data);
                data = {};
            });
            listMasterTypes = [...result];
        }

        resolve(listMasterTypes);
    } catch (e) {
        console.log('error at get request projectsByOrganization with error: ', e);
        reject(e);
    }
});

export const menusPaging = (filterData: any, orderBy: string, direction: string, page: number, pageSize: number, headers: any) => new Promise(async (resolve, reject) => {
    try {
        const data = {
            ...filterData,
            orderBy,
            direction,
            page,
            pageSize,
        };
        const res = await HttpService.post(`menus-paging`, data, headers);
        let result: object[] = [];
        // console.log(res);

        if (res.status === 200 && res.data) {
            result = res.data.message;
        }

        resolve(result);
    } catch (e) {
        console.log('error at get request projectsByOrganization with error: ', e);
        reject(e);
    }
});

export const userAll = (headers: any) => new Promise(async (resolve, reject) => {
    try {
        let listUsers: object[] = [];

        const res = await HttpService.get(`user-all`, null, headers);
        const result: object[] = [];
        // console.log(res);

        if (res.status === 200 && res.data) {
            res.data.message.users.forEach((item: any) => {
                let data = {
                    ...item,
                    codeName: `${item.code} - ${item.name}`
                }

                result.push(data);
                data = {};
            });
            listUsers = [...result];
        }

        resolve(listUsers);
    } catch (e) {
        console.log('error at get request projectsByOrganization with error: ', e);
        reject(e);
    }
});
export const getCode = (data: any, headers: any) => new Promise(async (resolve, reject) => {
    try {
        let reimbursementCode = "";

        const res = await HttpService.post(`reimbursement-code`, data, headers);
        if (res.status === 200 && res.data) {
            reimbursementCode = res.data.message.reimbursementCode;
        }
        console.log(reimbursementCode);
        resolve(reimbursementCode);
    } catch (e) {
        console.log('error at get request projectsByOrganization with error: ', e);
        reject(e);
    }
})
export const masterDetailByParent = (data: any, headers: any) => new Promise(async (resolve, reject) => {
    try {
        let listMasterDetails: object[] = [];

        const res = await HttpService.post(`master-datas/parent`, data, headers);
        const result: object[] = [];

        if (res.status === 200 && res.data) {
            res.data.message.masterDetails.forEach((item: any) => {
                let data = {
                    ...item,
                    codeName: `${item.code} - ${item.value}`
                }

                result.push(data);
                data = {};
            });
            listMasterDetails = [{ id: "", code: "", codeName: "Select" }, ...result];
        }

        resolve(listMasterDetails);
    } catch (e) {
        console.log('error at get request projectsByOrganization with error: ', e);
        reject(e);
    }
})

export const masterDetailByType = (data: any, headers: any) => new Promise(async (resolve, reject) => {
    try {
        let listMasterDetails: object[] = [];

        const res = await HttpService.post(`master-datas/type`, data, headers);
        const result: object[] = [];
        console.log(res);
        if (res.status === 200 && res.data) {
            res.data.message.masterDetails.forEach((item: any) => {
                let data = {
                    ...item,
                    codeName: `${item.code} - ${item.value}`
                }

                result.push(data);
                data = {};
            });
            listMasterDetails = [{ id: "", code: "", codeName: "Select" }, ...result];
        }

        resolve(listMasterDetails);
    } catch (e) {
        console.log('error at get request projectsByOrganization with error: ', e);
        reject(e);
    }
})
export const masterUserbyRole = (data: any, headers: any) => new Promise(async (resolve, reject) => {
    try {
        let listUsers: object[] = []; 
        const res = await HttpService.get(`user/roleId/${data.roleId}`, data, headers);
        const result: object[] = [];
        console.log(res);
        if (res.status === 200 && res.data) {
            console.log(res.data.message);
            res.data.message.forEach((item: any) => {
                let data = {
                    ...item,
                    // codeName: `${item.code} - ${item.value}`
                }

                result.push(data);
                data = {};
            });
            listUsers = [{ id: "", fullName: "select"}, ...result];
        }

        resolve(listUsers);
    } catch (e) {
        console.log('error at get request masterUserbyRole with error: ', e);
        reject(e);
    }
})

export const accountingPeriods = (headers: any) => new Promise(async (resolve, reject) => {
    try {
        const res = await HttpService.post(`accounting-periods/all`, null, headers);
        const listAccountingPeriod = [{ id: "", code: "Select", name: "Select" }, ...res.data.message.accountingPeriods];
        resolve(listAccountingPeriod);
    } catch (e) {
        console.log('error at get request accountingPeriods with error: ', e);
        reject(e);
    }
}) 