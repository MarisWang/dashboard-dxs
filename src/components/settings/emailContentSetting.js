import React, {Component} from 'react';
import {fetchDatas, postDatas} from "../../common/apiManager";
import {Input, message} from "antd";

class EmailSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_class: "EmailContentSettingForm",
            EMAIL_CUSTOM_USER_CREATED_SUBJECT: "",
            EMAIL_CUSTOM_USER_CREATED_HONORIFIC: "",
            EMAIL_CUSTOM_USER_CREATED_BODY: "",
            EMAIL_CUSTOM_USER_CREATED_SIGNATURE: "",
        }
    }

    componentWillMount() {
        this.setDefault();
    }

    setDefault = () => {
        // ?form_class=EmailContentSettingForm
        fetchDatas(`/settings/v1/settings/`, result => {
            let objectList = {};
            result.map(item => {
                objectList[item.name] = item.value;
            });
            this.setState({
                EMAIL_CUSTOM_USER_CREATED_SUBJECT: objectList.EMAIL_CUSTOM_USER_CREATED_SUBJECT,
                EMAIL_CUSTOM_USER_CREATED_HONORIFIC: objectList.EMAIL_CUSTOM_USER_CREATED_HONORIFIC,
                EMAIL_CUSTOM_USER_CREATED_BODY: objectList.EMAIL_CUSTOM_USER_CREATED_BODY,
                EMAIL_CUSTOM_USER_CREATED_SIGNATURE: objectList.EMAIL_CUSTOM_USER_CREATED_SIGNATURE,
            });
        });
    };

    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {
            form_class,
            EMAIL_CUSTOM_USER_CREATED_SUBJECT,
            EMAIL_CUSTOM_USER_CREATED_HONORIFIC,
            EMAIL_CUSTOM_USER_CREATED_BODY,
            EMAIL_CUSTOM_USER_CREATED_SIGNATURE
        } = this.state;
        let data = {
            form_class,
            EMAIL_CUSTOM_USER_CREATED_SUBJECT,
            EMAIL_CUSTOM_USER_CREATED_HONORIFIC,
            EMAIL_CUSTOM_USER_CREATED_BODY,
            EMAIL_CUSTOM_USER_CREATED_SIGNATURE
        };
        postDatas("/settings/v1/settings/", data).then((result => {
            if (result) {
                this.setState(result);
                message.success("修改成功!");
            }
        }))
    };
    reset = () => {
        this.setState({
            form_class: "EmailContentSettingForm",
            EMAIL_CUSTOM_USER_CREATED_SUBJECT: "",
            EMAIL_CUSTOM_USER_CREATED_HONORIFIC: "",
            EMAIL_CUSTOM_USER_CREATED_BODY: "",
            EMAIL_CUSTOM_USER_CREATED_SIGNATURE: "",
        })
    };

    render() {
        let {
            EMAIL_CUSTOM_USER_CREATED_SUBJECT,
            EMAIL_CUSTOM_USER_CREATED_HONORIFIC,
            EMAIL_CUSTOM_USER_CREATED_BODY,
            EMAIL_CUSTOM_USER_CREATED_SIGNATURE
        } = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>邮件内容设置</h4>
                    <div className="displayflexstart">
                        <span className="form_text">创建用户邮件的主题</span>
                        <Input name="EMAIL_CUSTOM_USER_CREATED_SUBJECT"
                               value={EMAIL_CUSTOM_USER_CREATED_SUBJECT}
                               onChange={this.onInputChange}/>
                    </div>
                    <p>提示: 创建用户时，发送设置密码邮件的主题 (例如: 创建用户成功)</p>
                    <div className="displayflexstart">
                        <span className="form_text">创建用户邮件的敬语</span>
                        <Input name="EMAIL_CUSTOM_USER_CREATED_HONORIFIC"
                               value={EMAIL_CUSTOM_USER_CREATED_HONORIFIC}
                               onChange={this.onInputChange}/>
                    </div>
                    <p>提示: 创建用户时，发送设置密码邮件的敬语 (例如: 您好)</p>
                    <div className="displayflexstart">
                        <span className="form_text">创建用户邮件的内容</span>
                        <textarea name="EMAIL_CUSTOM_USER_CREATED_BODY"
                                  value={EMAIL_CUSTOM_USER_CREATED_BODY}
                                  onChange={this.onInputChange}/>
                    </div>
                    <p>提示: 创建用户时，发送设置密码邮件的内容</p>
                    <div className="displayflexstart">
                        <span className="form_text">署名</span>
                        <Input name="EMAIL_CUSTOM_USER_CREATED_SIGNATURE"
                               value={EMAIL_CUSTOM_USER_CREATED_SIGNATURE}
                               onChange={this.onInputChange}/>
                    </div>
                    <p>提示: 邮件的署名 (例如: jumpserver)</p>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.reset}>重置</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}

export default EmailSetting;
