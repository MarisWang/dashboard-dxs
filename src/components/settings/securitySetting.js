import React, {Component} from 'react';
import {Checkbox, Input, message} from 'antd';
import {fetchDatas, postDatas} from "../../common/apiManager";
import {checkEmptyInput} from "../../common/common";

class SecuritySetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_class: "SecuritySettingForm",
            SECURITY_MFA_AUTH: false,
            SECURITY_LOGIN_LIMIT_COUNT: 0,
            SECURITY_LOGIN_LIMIT_TIME: 0,
            SECURITY_MAX_IDLE_TIME: 0,
            SECURITY_PASSWORD_EXPIRATION_TIME: 0, //密码过期时间
            SECURITY_MONITOR_COMMANDS: "", //受监控的命令
            SECURITY_PASSWORD_MIN_LENGTH: 0, //密码最小长度
            SECURITY_PASSWORD_UPPER_CASE: false,
            SECURITY_PASSWORD_LOWER_CASE: false,
            SECURITY_PASSWORD_NUMBER: false,
            SECURITY_PASSWORD_SPECIAL_CHAR: false,
            BULKTASK_BAN_COMMANDS: "", //批量任务禁用命令
            SECURITY_COMMAND_EXECUTION: false, //批量命令
            SECURITY_SERVICE_ACCOUNT_REGISTRATION: false, //终端注册
        }
    }

    componentWillMount() {
        this.setDefault();
    }

    setDefault = () => {
        fetchDatas(`/settings/v1/settings/`, result => {
            let objectList = {};
            result.map((item) => {
                objectList[item.name] = item.value;
            });
            this.setState({
                SECURITY_MFA_AUTH: objectList.SECURITY_MFA_AUTH === "True",// MFA 二次认证
                SECURITY_COMMAND_EXECUTION: objectList.SECURITY_COMMAND_EXECUTION === "True", //批量命令
                SECURITY_SERVICE_ACCOUNT_REGISTRATION: objectList.SECURITY_SERVICE_ACCOUNT_REGISTRATION === "True", //终端注册
                SECURITY_LOGIN_LIMIT_COUNT: objectList.SECURITY_LOGIN_LIMIT_COUNT, //限制登录失败次数
                SECURITY_LOGIN_LIMIT_TIME: objectList.SECURITY_LOGIN_LIMIT_TIME,//禁止登录时间间隔
                SECURITY_MAX_IDLE_TIME: objectList.SECURITY_MAX_IDLE_TIME,// SSH最大空闲时间
                SECURITY_MONITOR_COMMANDS: objectList.SECURITY_MONITOR_COMMANDS,// 受监控的命令
                BULKTASK_BAN_COMMANDS: objectList.BULKTASK_BAN_COMMANDS,//批量任务禁用命令
                SECURITY_PASSWORD_EXPIRATION_TIME: objectList.SECURITY_PASSWORD_EXPIRATION_TIME,// 密码过期时间
                SECURITY_PASSWORD_MIN_LENGTH: objectList.SECURITY_PASSWORD_MIN_LENGTH,//密码最小长度
                SECURITY_PASSWORD_UPPER_CASE: objectList.SECURITY_PASSWORD_UPPER_CASE === "True",//必须包含大写字母
                SECURITY_PASSWORD_LOWER_CASE: objectList.SECURITY_PASSWORD_LOWER_CASE === "True",//必须包含小写字母
                SECURITY_PASSWORD_NUMBER: objectList.SECURITY_PASSWORD_NUMBER === "True",//必须包含数字字符
                SECURITY_PASSWORD_SPECIAL_CHAR: objectList.SECURITY_PASSWORD_SPECIAL_CHAR === "True",//必须包含特殊字符
            });
        });
    };

    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {
            SECURITY_LOGIN_LIMIT_COUNT,
            SECURITY_LOGIN_LIMIT_TIME,
            SECURITY_PASSWORD_EXPIRATION_TIME,
        } = this.state;
        let requiredObject = {
            SECURITY_LOGIN_LIMIT_COUNT,
            SECURITY_LOGIN_LIMIT_TIME,
            SECURITY_PASSWORD_EXPIRATION_TIME
        };
        if (checkEmptyInput(requiredObject)) {
            postDatas("/settings/v1/settings/", this.state).then((result => {
                if (result) {
                    this.setDefault();
                    message.success("修改成功!");
                }
            }))
        }
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**监控复选框事件**/
    onCheckBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.checked
        });
    };
    reset = () => {
        this.setState({
            form_class: "SecuritySettingForm",
            SECURITY_MFA_AUTH: false,
            SECURITY_LOGIN_LIMIT_COUNT: 0,
            SECURITY_LOGIN_LIMIT_TIME: 0,
            SECURITY_MAX_IDLE_TIME: 0,
            SECURITY_PASSWORD_EXPIRATION_TIME: 0, //密码过期时间
            SECURITY_MONITOR_COMMANDS: "", //受监控的命令
            SECURITY_PASSWORD_MIN_LENGTH: 0, //密码最小长度
            SECURITY_PASSWORD_UPPER_CASE: false,
            SECURITY_PASSWORD_LOWER_CASE: false,
            SECURITY_PASSWORD_NUMBER: false,
            SECURITY_PASSWORD_SPECIAL_CHAR: false,
            BULKTASK_BAN_COMMANDS: "", //批量任务禁用命令
            SECURITY_COMMAND_EXECUTION: false, //批量命令
            SECURITY_SERVICE_ACCOUNT_REGISTRATION: false, //终端注册
        })
    };

    render() {
        let {
            SECURITY_MFA_AUTH,
            SECURITY_LOGIN_LIMIT_COUNT,
            SECURITY_LOGIN_LIMIT_TIME,
            SECURITY_MAX_IDLE_TIME,
            SECURITY_PASSWORD_EXPIRATION_TIME,
            SECURITY_PASSWORD_MIN_LENGTH,
            SECURITY_PASSWORD_LOWER_CASE,
            SECURITY_PASSWORD_NUMBER,
            SECURITY_PASSWORD_SPECIAL_CHAR,
            SECURITY_PASSWORD_UPPER_CASE,
            SECURITY_MONITOR_COMMANDS,
            BULKTASK_BAN_COMMANDS,
            SECURITY_COMMAND_EXECUTION,
            SECURITY_SERVICE_ACCOUNT_REGISTRATION
        } = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>安全设置</h4>
                    <div className="displayflexstart">
                        <span className="form_text"> MFA 二次认证&nbsp;&nbsp;&nbsp;</span>
                        <Checkbox onChange={this.onCheckBoxChange}
                                  name="SECURITY_MFA_AUTH"
                                  checked={SECURITY_MFA_AUTH}>
                            <span style={{width: "60px"}}/>
                            开启后，用户登录必须使用MFA二次认证（对所有用户有效，包括管理员）
                        </Checkbox>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text"> 批量命令&nbsp;&nbsp;&nbsp;</span>
                        <Checkbox onChange={this.onCheckBoxChange}
                                  name="SECURITY_COMMAND_EXECUTION"
                                  checked={SECURITY_COMMAND_EXECUTION}>
                            <span style={{width: "60px"}}/>
                            允许用户批量执行命令
                        </Checkbox>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text"> 终端注册&nbsp;&nbsp;&nbsp;</span>
                        <Checkbox onChange={this.onCheckBoxChange}
                                  name="SECURITY_SERVICE_ACCOUNT_REGISTRATION"
                                  checked={SECURITY_SERVICE_ACCOUNT_REGISTRATION}>
                            <span style={{width: "60px"}}/>
                            允许使用bootstrap token注册终端, 当终端注册成功后可以禁止
                        </Checkbox>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text required"> 限制登录失败次数</span>
                        <Input name="SECURITY_LOGIN_LIMIT_COUNT"
                               type="number"
                               onChange={this.onInputChange}
                               value={SECURITY_LOGIN_LIMIT_COUNT}/>
                    </div>

                    <div className="displayflexstart">
                        <span className="form_text required">禁止登录时间间隔</span>
                        <Input name="SECURITY_LOGIN_LIMIT_TIME"
                               type="number"
                               onChange={this.onInputChange}
                               value={SECURITY_LOGIN_LIMIT_TIME}/>
                    </div>
                    <p>提示：（单位：分）当用户登录失败次数达到限制后，那么在此时间间隔内禁止登录</p>
                    <div className="displayflexstart">
                        <span className="form_text">SSH最大空闲时间</span>
                        <Input name="SECURITY_MAX_IDLE_TIME"
                               type="number"
                               onChange={this.onInputChange}
                               value={SECURITY_MAX_IDLE_TIME}/>
                    </div>
                    <p>提示：（单位：分）如果超过该配置没有操作，连接会被断开（仅ssh）</p>
                </div>
                <div className="from_container">
                    <h4>命令规则</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">受监控的命令</span>
                        <textarea name="SECURITY_MONITOR_COMMANDS"
                                  onChange={this.onInputChange}
                                  value={SECURITY_MONITOR_COMMANDS}/>
                    </div>
                    <p>用逗号隔开，支持正则表达式</p>
                    <div className="displayflexstart">
                        <span className="form_text required">批量任务禁用命令</span>
                        <textarea name="BULKTASK_BAN_COMMANDS"
                                  onChange={this.onInputChange}
                                  value={BULKTASK_BAN_COMMANDS}/>
                    </div>
                    <p>用逗号或者换行隔开, 支持正则表达式</p>
                </div>
                <div className="from_container">
                    <h4>密码校验规则</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">密码过期时间</span>
                        <Input name="SECURITY_PASSWORD_EXPIRATION_TIME"
                               type="number"
                               onChange={this.onInputChange}
                               value={SECURITY_PASSWORD_EXPIRATION_TIME}/>
                    </div>
                    <p>提示：（单位：天）如果用户在此期间没有更新密码，用户密码将过期失效； 密码过期提醒邮件将在密码过期前5天内由系统（每天）自动发送给用户</p>
                    <div className="displayflexstart">
                        <span className="form_text"> 密码最小长度</span>
                        <Input name="SECURITY_PASSWORD_MIN_LENGTH"
                               type="number"
                               minLength={1} maxLength={30}
                               onChange={this.onInputChange}
                               value={SECURITY_PASSWORD_MIN_LENGTH}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text"> 必须包含大写字母</span>
                        <Checkbox onChange={this.onCheckBoxChange}
                                  name="SECURITY_PASSWORD_UPPER_CASE"
                                  checked={SECURITY_PASSWORD_UPPER_CASE}>
                            <span style={{width: "60px"}}/>
                            开启后，用户密码修改、重置必须包含大写字母
                        </Checkbox>
                    </div>

                    <div className="displayflexstart">
                        <span className="form_text"> 必须包含小写字母</span>
                        <Checkbox onChange={this.onCheckBoxChange}
                                  name="SECURITY_PASSWORD_LOWER_CASE"
                                  checked={SECURITY_PASSWORD_LOWER_CASE}>
                            <span style={{width: "60px"}}/>
                            开启后，用户密码修改、重置必须包含小写字母
                        </Checkbox>
                    </div>

                    <div className="displayflexstart">
                        <span className="form_text"> 必须包含数字字符</span>
                        <Checkbox onChange={this.onCheckBoxChange}
                                  name="SECURITY_PASSWORD_NUMBER"
                                  checked={SECURITY_PASSWORD_NUMBER}>
                            <span style={{width: "60px"}}/>
                            开启后，用户密码修改、重置必须包含数字字符
                        </Checkbox>
                    </div>

                    <div className="displayflexstart">
                        <span className="form_text"> 必须包含特殊字符</span>
                        <Checkbox onChange={this.onCheckBoxChange}
                                  name="SECURITY_PASSWORD_SPECIAL_CHAR"
                                  checked={SECURITY_PASSWORD_SPECIAL_CHAR}>
                            <span style={{width: "60px"}}/>
                            开启后，用户密码修改、重置必须包含特殊字符
                        </Checkbox>
                    </div>
                </div>

                <div className="form-btns displayflexend">
                    <button onClick={this.reset}>重置</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}

export default SecuritySetting;
