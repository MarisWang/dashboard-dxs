import React, {Component} from 'react';
import {Checkbox, Input, message} from 'antd';
import {checkEmptyInput} from "../../common/common";
import {fetchDatas, postDatas} from "../../common/apiManager";

class EmailSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_class: "EmailSettingForm",
            EMAIL_HOST: "",
            EMAIL_PORT: "",
            EMAIL_HOST_USER: "",
            EMAIL_HOST_PASSWORD: "",
            EMAIL_USE_SSL: false,
            EMAIL_USE_TLS: false,
            EMAIL_FROM: "",
        }
    }

    componentWillMount() {
        this.setDefault();
    }

    setDefault = () => {
        //?form_class=EmailSettingForm
        fetchDatas(`/settings/v1/settings/`, result => {
            let objectList = {};
            result.map((item) => {
                objectList[item.name] = item.value;
            });
            this.setState({
                EMAIL_HOST: objectList.EMAIL_HOST,
                EMAIL_PORT: objectList.EMAIL_PORT,
                EMAIL_HOST_USER: objectList.EMAIL_HOST_USER,
                EMAIL_HOST_PASSWORD: "",
                EMAIL_USE_SSL: objectList.EMAIL_USE_SSL === "True",
                EMAIL_USE_TLS: objectList.EMAIL_USE_TLS === "True",
                EMAIL_FROM: objectList.EMAIL_FROM,
            });
        });
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
    submitForm = (e) => {
        e.preventDefault();
        let {
            form_class,
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_HOST_USER,
            EMAIL_HOST_PASSWORD,
            EMAIL_USE_SSL,
            EMAIL_USE_TLS,
            EMAIL_FROM
        } = this.state;
        let requiredObject = {
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_HOST_USER
        };
        let data = {
            form_class,
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_HOST_USER,
            EMAIL_HOST_PASSWORD,
            EMAIL_USE_SSL,
            EMAIL_USE_TLS,
            EMAIL_FROM
        };
        if (checkEmptyInput(requiredObject)) {
            postDatas("/settings/v1/settings/", data).then((result => {
                if (result) {
                    this.reset();
                    this.setDefault();
                    message.success("修改成功!");
                }
            }))
        }
    };
    reset = () => {
        this.setState({
            EMAIL_HOST: "",
            EMAIL_PORT: "",
            EMAIL_HOST_USER: "",
            EMAIL_HOST_PASSWORD: "",
            EMAIL_USE_SSL: false,
            EMAIL_USE_TLS: false,
            EMAIL_FROM: ""
        });
    };

    render() {
        let {
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_HOST_USER,
            EMAIL_HOST_PASSWORD,
            EMAIL_USE_SSL,
            EMAIL_USE_TLS,
            EMAIL_FROM
        } = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>邮件设置</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">SMTP主机</span>
                        <Input name="EMAIL_HOST" onChange={this.onInputChange} value={EMAIL_HOST}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text required">SMTP端口</span>
                        <Input name="EMAIL_PORT" onChange={this.onInputChange} value={EMAIL_PORT}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text required">SMTP账号</span>
                        <Input name="EMAIL_HOST_USER" onChange={this.onInputChange} value={EMAIL_HOST_USER}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">SMTP密码</span>
                        <Input name="EMAIL_HOST_PASSWORD" onChange={this.onInputChange} value={EMAIL_HOST_PASSWORD}/>
                    </div>
                    <p>一些邮件提供商需要输入的是Token</p>
                    <div className="displayflexstart">
                        <span className="form_text">发送账号</span>
                        <Input name="EMAIL_FROM" onChange={this.onInputChange} value={EMAIL_FROM}/>
                    </div>
                    <p>提示：发送邮件账号，默认使用SMTP账号作为发送账号</p>
                </div>

                <div className="from_container">
                    <h4>其他</h4>
                    <div className="displayflexstart">
                        <span className="form_text"> 使用SSL</span>&nbsp;&nbsp;&nbsp;
                        <Checkbox onChange={this.onCheckBoxChange} name="EMAIL_USE_SSL" checked={EMAIL_USE_SSL}>
                            <span style={{width: "60px"}}/>如果SMTP端口是465，通常需要启用SSL
                        </Checkbox>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text"> 使用TLS</span>&nbsp;&nbsp;&nbsp;
                        <Checkbox onChange={this.onCheckBoxChange} name="EMAIL_USE_TLS" checked={EMAIL_USE_TLS}>
                            <span style={{width: "60px"}}/>如果SMTP端口是587，通常需要启用TLS
                        </Checkbox>
                    </div>
                </div>
                <div className="form-btns displayflexend">
                    <button>测试链接</button>
                    <button onClick={this.reset}>重置</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}

export default EmailSetting;
