import React, {Component} from 'react';
import {Input, message} from "antd";
import {patchDatas} from "../../common/apiManager";
import {deleteNullObject} from "../../common/common";
import history from "../../js/history";

export default class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: "",
            new_password: "",
            confirm_password: "",
        }
    }

    resetValue = () => {
        this.setState({
            old_password: "",
            new_password: "",
            confirm_password: "",
        })
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
        let {new_password, confirm_password} = this.state;
        if (new_password === confirm_password) {
            let data = deleteNullObject(this.state);
            let id = JSON.parse(localStorage.getItem("Auth")).user.userid;
            patchDatas(`/users/v1/users/${id}/password/`, data).then((result => {
                if (result.success) {
                    this.resetValue();
                    message.success("修改成功,请重新登陆！");
                    this.props.onCancel();
                    localStorage.clear();
                    console.clear();
                    history.push('/login');
                } else {
                    message.error(JSON.stringify(result["message"]));
                }
            }))
        } else {
            this.resetValue();
            message.error("确认密码与新密码不一致！")
        }
    };

    render() {
        let {old_password, new_password, confirm_password} = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>修改密码</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">原来密码：</span>
                        <Input name="old_password" type="password" autoComplete="new-password" value={old_password} onChange={this.onInputChange}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text required">新密码：</span>
                        <Input name="new_password" autoComplete="new-password" type="password" value={new_password} onChange={this.onInputChange}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text required">确认密码：</span>
                        <Input name="confirm_password" type="password" autoComplete="new-password" value={confirm_password}
                               onChange={this.onInputChange}/>
                    </div>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.resetValue}>重置</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}

