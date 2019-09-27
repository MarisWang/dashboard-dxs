import axios from "axios";
import {message} from "antd";
import history from "../js/history";
import Config from "../config/config";

const URI = `${Config.api}:3001/api`;

export const postApi = (path) => {
    return `${URI}${path}`;
};

/**请求的头部**/
export const header = () => {
    if (localStorage.getItem("Auth")) {
        let token = JSON.parse(localStorage.getItem("Auth")).token;
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    } else {
        message.error("Token 无效，请重新登陆！");
        localStorage.clear();
        window.location.reload(true);
    }
};

/**
 * 添加数据 Post 请求
 **/
export const postDatas = (api, data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(api),
            method: "POST",
            headers: header(),
            data: data
        }).then((res) => {
            resolve(res.data)
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**
 * 数据 Delete 请求的请求
 **/
export const deleteDatas = (api) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(api),
            method: "DELETE",
            headers: header(),
        }).then((res) => {
            resolve(res)
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**
 * 修改数据 PATCH请求
 **/
export const patchDatas = async (api, data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(api),
            method: "PATCH",
            headers: header(),
            data: data
        }).then((res) => {
            resolve(res.data)
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**
 * 数据Get请求的请求
 **/
export const fetchDatas = (params, callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(params),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result instanceof Array || result instanceof Object || result === "Ok" || result) {
                callback(result);
            } else {
                fetchDatas(params, callback);
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                if (error.response.data.detail === "Invalid token or cache refreshed.") {
                    localStorage.clear();
                    console.clear();
                    history.push('/login');
                }
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**
 * 数据PUT请求的请求
 **/
export const putDatas = (api, data) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(api),
            method: "PUT",
            data: data,
            headers: header(),
        }).then((res) => {
            resolve(res.data);
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！");
            }
        });
    });
};

/**获得 资产 下拉选项列表**/
export const getAssetsSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/assets-simple/?select=1`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].ip}(${result[item].hostname})`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getAssetsSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 节点 下拉选项列表**/
export const getNodesSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/nodes/?select=1`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                callback(result);
            } else {
                getNodesSelectOptions(callback);
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 用户角色 下来选项列表**/
export const getRoleSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/users/v1/users/roles`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id.toString()
                    });
                }
                callback(Lists);
            } else {
                getRoleSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 用户组 下拉选项列表**/
export const getUserGroupSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/users/v1/groups/detail/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                for (let item in result) {
                    result[item].text = `${result[item].name}`
                }
                callback(result);
            } else {
                getUserGroupSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 标签 下拉选项列表**/
export const getLabelsSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/labels/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getLabelsSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 用户 下拉选项列表**/
export const getUserSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/users/v1/users/?select=1`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                callback(result);
            } else {
                getUserSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 网域 下拉选项列表**/
export const getDomainSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/domain/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getDomainSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 管理用户 下拉选项列表**/
export const getAdminUserSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/admin-user/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getAdminUserSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 组长 下拉选项列表**/
export const getGroupAdminSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/users/v1/users/?role__name=GroupAdmin&select=1`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                callback(result);
            } else {
                getGroupAdminSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 资产 下拉选项列表**/
export const getApplyPermsAssetsSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/apply-perms/v1/apply-permissions-info/?model=assets`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].ip}`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getApplyPermsAssetsSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 系统用户 下拉选项列表**/
export const getApplyPermsSystemUsersSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/apply-perms/v1/apply-permissions-info/?model=system_users`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getApplyPermsSystemUsersSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 审批人 下拉选项列表**/
export const getApplyPermsApproverSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/apply-perms/v1/apply-permissions-info/?model=approver`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id.toString()
                    });
                }
                callback(Lists);
            } else {
                getApplyPermsApproverSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 节点 拉选项列表**/
export const getApplyPermsNodesSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/apply-perms/v1/apply-permissions-info/?model=nodes`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].value}`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getApplyPermsNodesSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 安全组 下拉选项列表**/
export const getSecurityGroupsNodesSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/applications/v1/securitygroups/?is_template=false`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id.toString()
                    });
                }
                callback(Lists);
            } else {
                getSecurityGroupsNodesSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 命令过滤器 下拉选项列表**/
export const getCmdFilterSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/cmd-filter/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getCmdFilterSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 任务类型 下拉选项列表**/
export const getTaskTypeSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/assets/bulktask/task-types/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Object) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: result[item],
                        id: item
                    });
                }
                callback(Lists);
            } else {
                getTaskTypeSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 系统用户 下拉选项列表**/
export const getSystemUsersSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/system-user`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].username}(${result[item].name})`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getSystemUsersSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 服务用户 下拉选项列表**/
export const getServiceUsersSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/assets/v1/service-user/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].username}`,
                        id: result[item].id
                    });
                }
                callback(Lists);
            } else {
                getServiceUsersSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 ipsets 下拉选项列表**/
export const getIpsetsSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/applications/v1/ipsets/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}: ${result[item].expression}`,
                        id: result[item].id.toString()
                    });
                }
                callback(Lists);
            } else {
                getIpsetsSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 iptables 下拉选项列表**/
export const getIptablesSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/applications/v1/iptables/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].match_set}(${result[item].expression})`,
                        id: result[item].id.toString()
                    });
                }
                callback(Lists);
            } else {
                getIptablesSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 安全组模板 下拉选项列表**/
export const getSecurityTemSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/applications/v1/securitygroups/?is_template=true`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id.toString()
                    });
                }
                callback(Lists);
            } else {
                getSecurityTemSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 父导航 下拉选项列表**/
export const getNavSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/navbars/v1/navbars/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Array) {
                let Lists = [];
                for (let item in result) {
                    Lists.push({
                        name: `${result[item].name}`,
                        id: result[item].id.toString()
                    });
                }
                callback(Lists);
            } else {
                getNavSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 命令存储 下拉选项列表**/
export const getComdStoragesSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/settings/v1/terminal/command-storages`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Object) {
                let Lists = [];
                let i = 1;
                for (let item in result) {
                    let id = i++;
                    Lists.push({
                        id: id.toString(),
                        name: [item][0],
                        type: result[item]["TYPE"]
                    });
                }
                callback(Lists);
            } else {
                getComdStoragesSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 录像存储 下拉选项列表**/
export const getReplyStoragesSelectOptions = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/settings/v1/terminal/replay-storages`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Object) {
                let Lists = [];
                let i = 1;
                for (let item in result) {
                    let id = i++;
                    Lists.push({
                        id: id.toString(),
                        name: [item][0],
                        type: result[item]["TYPE"]
                    });
                }
                callback(Lists);
            } else {
                getReplyStoragesSelectOptions();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};

/**获得 用户信息 下拉选项列表**/
export const getUserInformation = (callback) => {
    return new Promise((resolve, reject) => {
        axios({
            url: postApi(`/users/v1/profile/`),
            method: "GET",
            headers: header(),
        }).then((res) => {
            let result = res.data;
            if (result && result instanceof Object) {
                callback(result);
            } else {
                getUserInformation();
            }
        }).catch(error => {
            reject(error);
            console.log('错误信息', error.response);
            if (error.response) {
                let Error = error.response.data;
                message.error(JSON.stringify(Error));
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    });
};



