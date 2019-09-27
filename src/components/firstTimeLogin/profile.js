import React from 'react';
import {Input} from "antd";
import {fetchDatas, patchDatas} from "../../common/apiManager";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            name: "",
            email: "",
            wechat: "",
            phone: "",
        };
    }

    componentWillMount() {
        this.getTableDatas();
    }

    getTableDatas = () => {
        fetchDatas(`/users/v1/profile/`, result => {
            this.setState({
                username: result.username,
                name: result.name,
                email:result.email,
                wechat:result.wechat,
                phone:result.phone,
            });
        });
    };

    submitForm = (e) => {
        e.preventDefault();
        let {wechat, phone} = this.state;
        let data = {wechat, phone};
        patchDatas(`/users/v1/profile/`, data).then((result => {
            if (result) {
                this.props.next();
            }
        }))
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        let {username, name, email, wechat, phone} = this.state;
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
                    <button onClick={(e) => this.submitForm(e)}>下一步</button>
                </div>
            </div>
        )
    }
}
