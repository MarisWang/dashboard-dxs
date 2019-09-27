import React from "react";
import {message, Select, Tag} from "antd";
import moment from "moment";
import {fetchDatas} from "./apiManager";

const {Option} = Select;

/**验证是否为空**/
export const checkEmptyInput = (obj) => {
    for (let item in obj) {
        if (obj[item] !== null && obj[item] !== undefined) {
            if (obj[item] === '' || obj[item].length === 0 || obj[item] === {}) {
                message.error(`${item} is required!`);
                return false
            }
        } else {
            message.error(`${item} is required!`);
            return false
        }
    }
    return true
};

/**创建options**/
export const createOptions = (options) => {
    if (options && options instanceof Array) {
        return options.map((x, index) =>
            <Option key={index} title={x.name} value={x.id}>{x.name}</Option>);
    }
};
const deleteTag = (e) => {

};
/**创建tags**/
export const createTags = (options) => {
    return options.map((x) => <Tag closable key={x.id} onClose={deleteTag()} color="#108ee9">{x.name}</Tag>);
};

/**port 只能是正整数**/
export const checkInteger = (name, str) => {
    let pattern = new RegExp('^[1-9]\\d*$');
    if (!pattern.test(str)) {
        message.error(`${name} 只能是正整数!`);
        return
    }
};
/**验证只能是数字字母和个别特殊字符**/
export const checkWordsNumber = (name, str) => {
    let pattern = new RegExp('^[0-9a-zA-Z_@\\-\\.]*$');
    if (!pattern.test(str)) {
        message.error(`${name} 只能包含字母、数字特殊符号，例如!@#%*等`);
        return
    }
};

/**验证IP地址**/
export const checkValidIP = (name, ip) => {
    let pattern = new RegExp('^(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))\\.(\\d|[1-9]\\d|1\\d\\d|2([0-4]\\d|5[0-5]))$');//正则表达式
    if (!pattern.test(ip)) {
        message.error(`${name} 不是有效的IP地址!`);
        return
    }
};
/**验证邮箱地址**/
export const checkValidEmail = (email) => {
    let pattern = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$');//正则表达式
    if (!pattern.test(email)) {
        message.error(`不是有效的邮箱地址！`);
        return
    }
};

/**获得当前时间，格式为 2100-01-01 08:00:00 +0800**/
export const getTimeForNow = () => {
    moment.locale('en');
    let TIME = `${moment().format('YYYY-MM-DD HH:mm:ss')} +0800`;
    return TIME
};

export const getTimeForFiveDaysBefore=()=>{
    moment.locale('en');
    let TIME = `${moment().subtract('days', 6).format('YYYY-MM-DD HH:mm:ss')} +0800`;
    return TIME
};

/**重置并下载SSH密钥**/
export const downloadSSHKey = (e) => {
    e.preventDefault();
    let id = JSON.parse(localStorage.getItem("Auth")).user.userid;
    let username = JSON.parse(localStorage.getItem("Auth")).user.username;


    fetchDatas(`/users/v1/users/${id}/pubkey/reset/`,result => {
        if (result) {
            let data = new Blob([result], {type: "text/plain;charset=UTF-8"});
            let downloadUrl = window.URL.createObjectURL(data);
            let anchor = document.createElement("a");
            anchor.href = downloadUrl;
            anchor.download = `${username}-jumpserver.pem`;
            anchor.click();
            window.URL.revokeObjectURL(data);
        }
    })
};

/**MFA认证**/
export const mafFun = (text) => {
    switch (text) {
        case 0:
            return "禁止";
            break;
        case 1:
            return "启用";
            break;
        case 2:
            return "强制启用";
            break;
        default:
        // code block
    }
};

/**删除参数里的空对象**/
export const deleteNullObject = (obj) => {
    for (let key in obj) {
        //检验null和undefined
        if (obj[key] !== null && obj[key] !== undefined) {
            if (obj[key] === '' || obj[key].length === 0 || obj[key] === {}) {
                delete obj[key]
            }
        }
    }
    return obj;
};

export const readFile = (file, callback) => {
    let reader = new FileReader();//新建一个FileReader
    reader.readAsText(file, "UTF-8");//读取文件
    reader.addEventListener('load', () => callback(reader.result));
};

/**重组返回的数据**/
export const toTreeData = (data) => {
    let resData = data;
    let tree = [];
    for (let i = 0; i < resData.length; i++) {
        if (!resData[i].parent_id) {
            let obj = {
                id: resData[i].id,
                key: resData[i].key,
                value: resData[i].value,
                defaultValue: resData[i].value,
                parentKey: resData[i]["parent_key"],
                parent_id: resData[i].parent_id,
                isEditable: false,
                children: []
            };
            tree.push(obj);
            resData.splice(i, 1);
            i--;
        }
    }
    run(tree);

    function run(chiArr) {
        if (resData.length !== 0) {
            for (let i = 0; i < chiArr.length; i++) {
                for (let j = 0; j < resData.length; j++) {
                    if (chiArr[i].key === resData[j]["parent_key"]) {
                        let obj = {
                            id: resData[j].id,
                            key: resData[j].key,
                            value: resData[j].value,
                            defaultValue: resData[j].value,
                            parentKey: resData[j]["parent_key"],
                            parent_id: resData[j].parent_id,
                            isEditable: false,
                            children: []

                        };
                        chiArr[i].children.push(obj);
                        resData.splice(j, 1);
                        j--;
                    }
                }
                run(chiArr[i].children);
            }
        }
    }

    return tree;
};