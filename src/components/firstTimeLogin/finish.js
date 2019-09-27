import React from 'react';
import {Checkbox, message} from 'antd';
import axios from "axios";
import {postApi, header, fetchDatas} from "../../common/apiManager";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false
        };
    }

    checkBoxChange = (e) => {
        this.setState({
            isChecked: e.target.checked
        })
    };

    /**结束验证**/
    finishAuth = () => {
        if (this.state.isChecked) {
            fetchDatas(`/users/v1/users/first-login-finish/`, result => {
                if(result.success){
                    this.props.done();
                }
            });
        } else {
            message.error("您还未勾选我们的同意条款,勾选后,方可继续您的操作.")
        }
    };

    render() {
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>条例和条款</h4>
                    <p className="list">为了保护您和您的公司，请妥善保管您的帐户，密码和关键敏感信息。</p>
                    <p className="list">(例如：设置复杂密码，启用MFA身份验证。)</p>
                    <ol className="order_list">
                        <li>妥善保管自己的密码、密钥，不能泄露给他人，或给予他人使用</li>
                        <li>登陆方式使用密码 + 谷歌两步验证(MFA)方式，WEB和SSH登录使用同一密码</li>
                        <li>用户名均使用个人英文名字小写，不包含姓</li>
                        <li>第一次登录后需要更改初始密码，否则会被禁止登录</li>
                        <li>资产授权方式为，管理员给组长授权，组长给组员授权，授权的命名规则：用户名-系统用户名</li>
                        <li>资产申请方式为，组员能且只能申请组长拥有的资产，组长可向管理员申请所有资产.申清按权的命名规则：用户名-系统用户名</li>
                        <li>资产授权和资产申请都包含生效的起止时间，时间不在此区间的资产将无法登录</li>
                        <li>Windows资产请使用Web终端登录</li>
                        <li>所有用户登录机器所做的所有摄作都有日志，包括命令记录和彔像，请谨慎操作</li>
                    </ol>
                    <div className="displayflexstart">
                        &nbsp;&nbsp;&nbsp;<Checkbox onChange={this.checkBoxChange}>我同意条款和条件。</Checkbox>
                    </div>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.props.prev}>上一步</button>
                    <button onClick={this.finishAuth}>结束</button>
                </div>
            </div>
        )
    }
}
