import React, {Component} from 'react';
import {Input, message} from "antd";
import {checkEmptyInput} from "../../common/common";
import {fetchDatas, postDatas} from "../../common/apiManager";

export default class BasicSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_class: "BasicSettingForm",
            SITE_URL: "",
            USER_GUIDE_URL: "",
            EMAIL_SUBJECT_PREFIX: "",
        }
    }

    componentWillMount() {
        this.setDefault();
    }

    setDefault = () => {
        //?form_class=BasicSettingForm
        fetchDatas(`/settings/v1/settings/`, result => {
            let objectList = {};
            result.map(item => {
                objectList[item.name] = item.value;
            });
            this.setState({
                SITE_URL: objectList.SITE_URL,
                USER_GUIDE_URL: objectList.USER_GUIDE_URL,
                EMAIL_SUBJECT_PREFIX: objectList.EMAIL_SUBJECT_PREFIX,
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
        let {SITE_URL} = this.state;
        let requiredObject = {SITE_URL};
        if (checkEmptyInput(requiredObject)) {
            postDatas("/settings/v1/settings/", this.state).then((result => {
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
            SITE_URL: "",
            USER_GUIDE_URL: "",
            EMAIL_SUBJECT_PREFIX: "",
        })
    };

    render() {
        let {
            SITE_URL,
            USER_GUIDE_URL,
            EMAIL_SUBJECT_PREFIX
        } = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>基本设置</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">当前站点URL</span>
                        <Input name="SITE_URL" value={SITE_URL} onChange={this.onInputChange}/>
                    </div>
                    <p>eg: http://jumpserver.abc.com:8080</p>
                    <div className="displayflexstart">
                        <span className="form_text">用户向导URL</span>
                        <Input name="USER_GUIDE_URL" value={USER_GUIDE_URL} onChange={this.onInputChange}/>
                    </div>
                    <p>用户第一次登录，修改profile后重定向到地址</p>
                    <div className="displayflexstart">
                        <span className="form_text">Email主题前缀</span>
                        <Input name="EMAIL_SUBJECT_PREFIX" value={EMAIL_SUBJECT_PREFIX} onChange={this.onInputChange}/>
                    </div>
                    <p>提示: 一些关键字可能会被邮件提供商拦截，如 跳板机、Jumpserver</p>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.reset}>重置</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
};
