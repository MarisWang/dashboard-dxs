import React, {Component} from 'react';
import history from '../../js/history';
import axios from "axios";
import {postApi} from "../../common/apiManager";
import {message} from "antd";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMessage: '',
        }
    }

    loginFormOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            alertMessage: "",
        });
    };

    handleLoginSubmit = (e) => {
        e.preventDefault();
        let {email, password} = this.state;
        if (!email || !password) {
            this.setState({
                alertMessage: 'Invalid credentials!',
            });
        } else {
            this.submitLogin();
        }
    };

    submitLogin = () => {
        let {email, password} = this.state;
        axios({
            url: postApi("/authentication/v1/auth/"),
            method: "POST",
            headers: {'Content-Type': 'application/json',},
            data: {'username': email, 'password': password}
        }).then((res) => {
            let result = res.data;
            if (result) {
                localStorage.setItem('Auth', JSON.stringify({
                    token: result.token,
                    user: {
                        userid: result.user["id"],
                        role: result.user["role"],
                        roles_display: result.user["roles_display"],
                        avatar: result.user["avatar"],
                        username: result.user.username,
                        expired_at: new Date().getTime() + 24 * 60 * 60 * 1000 //24小时后
                    }
                }));
                localStorage.setItem('fromLogin', "true");
                message.success("登陆成功！");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                this.setState({
                    alertMessage: 'Username or password is incorrect!',
                    password: ''
                });
            }
        }).catch(error => {
            if (error.response) {
                let Error = error.response.data;
                this.setState({
                    alertMessage: Error["msg"],
                    password: ''
                });
            } else {
                message.error("请求时发生错误，请稍后再试！")
            }
        });
    };

    render() {
        let {alertMessage} = this.state;
        return (
            <div className="loginForm">
                {/*<h4>登录</h4>*/}
                <form>
                    <input type="email"
                           name="email"
                           ref="emailRef"
                           placeholder="账号"
                           onChange={this.loginFormOnChange}/>
                    <input type="password"
                           name="password"
                           ref="passwordRef"
                           placeholder="密码"
                           onChange={this.loginFormOnChange}/>
                    {
                        alertMessage === "" ? null : <span className="formAlert">{alertMessage}</span>
                    }
                    <button onClick={(e) => this.handleLoginSubmit(e)}>登录</button>
                </form>
                <br/>
                <h6>忘记密码？</h6>
                <hr/>
                <span className="bottom">还没有账号？点击
                    <h6 onClick={() => this.props.autoChange("register")}> 这里 </h6> 来注册.
                </span>
                <span className="bottom">
                    <h6 onClick={() => this.props.autoChange("mfaAuth")}> MFA验证 </h6> (For display only.)
                </span>
            </div>
        );
    }
}

export default Login;
