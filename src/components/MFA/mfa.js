import React, {Component} from 'react';
import {Input,} from 'antd';
import history from "../../js/history";

class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: JSON.parse(localStorage.getItem("Auth")).user.username,
            password: ""
        }
    }

    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        let {username, password} = this.state;
        return (
            <div className="wrapper">
                <div className="create_form">
                    <h4 style={{border:"none"}}>安全令牌验证 账户 {username} 请按照以下步骤完成绑定操作</h4>
                    <br/>

                    <div className="from_container">
                        <h4>安装应用</h4>
                        <p>第一步：请在手机端下载并安装 Google Authenticator 应用</p>
                        <div className="displayflexstart">
                            <span className="form_text"/>
                            <div className="qrcodeContent">
                                <img src={require("../../images/authenticator_android.png")} alt="Android手机下载"/>
                                <h6>Android手机下载</h6>
                            </div>
                            <div className="qrcodeContent">
                                <img src={require("../../images/authenticator_iphone.png")} alt="iPhone手机下载"/>
                                <h6>iPhone手机下载</h6>
                            </div>
                        </div>
                        <p>安装完成后，进如下一步操作,验证身份</p>
                    </div>

                    <div className="from_container">
                        <h4>验证身份</h4>
                        <p>第二步：验证身份</p>
                        <div className="displayflexstart">
                            <span className="form_text required">用户名</span>
                            <Input name="username" value={username} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">密码</span>
                            <Input name="password" value={password} onChange={this.onInputChange}/>
                        </div>
                        <p>输入您的登陆密码，以验证身份</p>
                        <br/>
                    </div>

                    <div className="form-btns displayflexcenter">
                        <button onClick={()=>history.push("/bindmfa")}>下一步</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountDetails;
