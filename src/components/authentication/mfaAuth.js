import React, {Component} from 'react';
import axios from "axios";
import {postApi} from "../../common/apiManager";
import history from "../../js/history";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMessage: '',
        }
    }
    submitLogin = (e) => {
        e.preventDefault();
        let {email, password} = this.state;
        if (!email || !password) {
            this.setState({
                alertMessage: 'Invalid credentials!',
            });
        } else {
            this.submitLogin();
        }
        // axios({
        //     url: postApi("/authentication/v1/auth/"),
        //     method: "POST",
        //     headers: {'Content-Type': 'application/json',},
        //     data: {'username': email, 'password': password}
        // }).then((res) => {
        //     let result = res.data;
        //     if (result) {
        //         this.setState({isLoading: false});
        //         localStorage.setItem('Auth', JSON.stringify({
        //             token: result.token,
        //             user: {
        //                 userid: result.user["id"],
        //                 avatar: result.user["avatar"],
        //                 username: result.user.username,
        //                 expired_at: new Date().getTime() + 24 * 60 * 60 * 1000 //24小时后
        //             }
        //         }));
        //         history.push('/index');
        //     } else {
        //         this.setState({
        //             alertMessage: 'Username or password is incorrect!',
        //             password: ''
        //         });
        //         this.refs.passwordRef.value = '';
        //     }
        // });
    };
    render() {
        let {alertMessage} = this.state;
        return (
            <div className="loginForm">
                {/*<h4>MFA认证</h4>*/}
                <h5>账号保护已开启，请根据提示完成以下操作</h5>
                <img src={require("../../images/textNoti-01.svg")} alt="手机Google Authenticator" width="120px"/>
                <h5>请打开手机Google Authenticator应用，输入6位动态码</h5>
                <form>
                    <input name="email"
                           placeholder="6位数字"
                           autoFocus={true}
                           onChange={this.loginFormOnChange}/>
                    {
                        alertMessage===""?null:<span className="formAlert">{alertMessage}</span>
                    }
                    <button onClick={(e) => this.submitLogin(e)}>MFA认证</button>
                </form>
                <hr/>
                <span className="bottom">如果不能提供MFA验证码，请联系管理员!</span>
                <span className="bottom">
                    <h6 onClick={()=>this.props.autoChange("login")}> 返回密码登录 </h6> (For display only.)
                </span>
            </div>
        );
    }
}

export default Login;
