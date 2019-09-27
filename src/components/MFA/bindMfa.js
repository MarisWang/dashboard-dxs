import React, {Component} from 'react';
import {Input,} from 'antd';
import history from "../../js/history";

class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: JSON.parse(localStorage.getItem("Auth")).user.username,
            code: ""
        }
    }
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        let {username} = this.state;
        return (
            <div className="wrapper">
                <div className="create_form">
                    <h4 style={{border:"none"}}>安全令牌验证 账户 {username} 请按照以下步骤完成绑定操作</h4>
                    <br/>

                    <div className="from_container">
                        <h4>安装应用</h4>
                        <p>使用手机 Google Authenticator 应用扫描以下二维码，获取6位验证码</p>
                        <div className="displayflexstart">
                            <span className="form_text"/>
                            <div className="qrcodeContent">
                                <img src={require("../../images/authenticator_android.png")} alt="Android手机下载"/>
                                <h6>Secret: 2ZY6YPDFWFYWETOX</h6>
                            </div>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">验证码</span>
                            <Input name="code"
                                   placeholder="6位数字"
                                   onChange={this.onInputChange}/>
                        </div>
                        <br/>
                    </div>

                    <div className="form-btns displayflexend">
                        <button onClick={()=>history.push("/setmfas")}>上一步</button>
                        <button onClick={this.setDefault}>下一步</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountDetails;
