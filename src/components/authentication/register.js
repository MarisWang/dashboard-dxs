import React, {Component} from 'react';
import history from '../../js/history';
import {postDatas} from '../../common/apiManager';
import {message} from "antd";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertShow: false,
            alertMessage: ''
        }
    }

    signupOnChange = async e => {
        await this.setState({
            [e.target.name]: e.target.value,
            alertMessage: "",
        });
    };

    handleLoginSubmit = (e) => {
        e.preventDefault();
        let {email, password, username} = this.state;
        if (!email || !username || !password) {
            this.setState({
                alertMessage: 'Invalid credentials!',
            });
        } else {
            this.submitSignup();
        }
    };

    submitSignup = () => {
        let data = {
            'email': this.state.email,
            'username': this.state.email,
            'password': this.state.password
        };
        postDatas("/api/users/v1/auth/", data).then((result => {
            if (result) {
                message.success("Logined");
                setTimeout(() => {
                    history.push("menuManagement");
                    window.location.reload();
                }, 1000);
            }
        }));
    };

    render() {
        let {alertMessage} = this.state;
        return (
            <div className="loginForm">
                {/*<h4>注册</h4>*/}
                <form>
                    <input type="email"
                           name="email"
                           placeholder="邮箱"
                           autoFocus={true}
                           onChange={this.signupOnChange}/>
                    <input type="text"
                           name="username"
                           placeholder="用户名"
                           onChange={this.signupOnChange}/>
                    <input type="password"
                           name="password"
                           autoComplete="new-password"
                           placeholder="密码"
                           onChange={this.signupOnChange}/>
                    <input type="password"
                           name="password"
                           autoComplete="new-password"
                           placeholder="确认密码"
                           onChange={this.signupOnChange}/>
                    {
                        alertMessage===""?null:<span className="formAlert">{alertMessage}</span>
                    }
                    <button onClick={(e) => this.handleLoginSubmit(e)}>注册</button>
                </form>
                <hr/>
                <span className="bottom">已经有账号？点击<h6
                    onClick={() => this.props.autoChange("login")}> 这里 </h6> 来登录.</span>
            </div>
        );
    }
}

export default Register;
