import React, {Component} from 'react';
import {Input, message} from "antd";
import {patchDatas,getUserInformation} from "../../common/apiManager";

export default class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            name: "",
            email: "",
            phone: "",
            wechat: ""
        }
    }

    componentWillMount() {
        getUserInformation(result=>{
            this.setState({
                username:result.username,
                name:result.name,
                email:result.email,
                phone:result.phone,
                wechat:result.wechat
            });
        });
    }

    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let data = this.state;
        patchDatas(`/users/v1/profile/`, data).then((result => {
            if (result) {
                this.getTableDatas();
                message.success("修改成功!");
                this.props.onCancel();
            }
        }))
    };

    render() {
        let {username, name, email, phone, wechat} = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>账户</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">用户名：</span>
                        <Input name="username" onChange={this.onInputChange} value={username} disabled={true}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text required">名称：</span>
                        <Input name="name" onChange={this.onInputChange} value={name} disabled={true}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text required">邮箱：</span>
                        <Input name="email" onChange={this.onInputChange} value={email} disabled={true}/>
                    </div>
                </div>
                <div className="from_container">
                    <h4>个人信息</h4>
                    <div className="displayflexstart">
                        <span className="form_text">手机：</span>
                        <Input name="phone" onChange={this.onInputChange} value={phone}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">微信：</span>
                        <Input name="wechat" onChange={this.onInputChange} value={wechat}/>
                    </div>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.getTableDatas}>重置</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}

