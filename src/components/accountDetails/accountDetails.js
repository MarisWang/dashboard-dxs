import React, {Component} from 'react';
import {Row, Col} from 'antd';
import EditUserProfile from "./editUserProfile";
import {getUserInformation} from "../../common/apiManager";
import {downloadSSHKey,mafFun} from "../../common/common";
import moment from "moment";
import history from "../../js/history";

class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: {},
            visible: false,
            openTab:"1"
        }
    }

    componentWillMount() {
        getUserInformation(result=>{
            this.setState({
                userProfile: result
            });
        });
    }

    /**修改也页面显示**/
    showDrawer = (key) => {
        this.setState({
            visible: true,
            openTab:key
        });
    };
    /**修改也页面隐藏**/
    closeDrawer = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        let {userProfile, visible,openTab} = this.state;
        return (
            <div className="wrapper">
                <EditUserProfile userProfile={userProfile} visible={visible} openTab={openTab}
                                 showDrawer={this.showDrawer} closeDrawer={this.closeDrawer}/>
                <div className="infor_container">
                    <h4>个人信息</h4>
                    <Row>
                        <Col lg={10}>
                            <ul>
                                <li><span>用户名：</span>{userProfile["username"]}</li>
                                <li><span>角色：</span>{userProfile["role_display"]}</li>
                                <li><span>用户来源：</span>{userProfile["source"]}</li>
                                <li><span>用户组：</span>{userProfile["groups_display"]}</li>
                            </ul>
                        </Col>
                        <Col lg={10}>
                            <ul>
                                <li><span>名称：</span>{userProfile["name"]}</li>
                                <li><span>邮件：</span>{userProfile["email"]}</li>
                                <li><span>备注：</span>{userProfile["comment"]}</li>
                                <li><span>激活中：</span>{userProfile["is_active"] ? "是" : "否"}</li>
                            </ul>
                        </Col>
                    </Row>
                </div>
                <div className="infor_container">
                    <h4>时间</h4>
                    <Row>
                        <Col lg={10}>
                            <ul>
                                <li><span>创建日期：</span>{moment(userProfile["date_joined"]).format('LLL')}</li>
                                <li><span>最后登录：</span>{moment(userProfile["last_login"]).format('LLL')}</li>
                            </ul>
                        </Col>
                        <Col lg={10}>
                            <ul>
                                <li><span>最后更新密码：</span>{userProfile["date_password_last_updated"]}</li>
                                <li><span>失效日期：</span>{moment(userProfile["date_expired"]).format('LLL')}</li>
                            </ul>
                        </Col>
                    </Row>
                </div>
                <div className="infor_container">
                    <h4>公钥</h4>
                    <Row>
                        <Col lg={10}>
                            <ul>
                                <li><span>ssh公钥：</span>{userProfile["finger_name"]}</li>
                                <li><span/>{userProfile["fingerprint"]}</li>
                            </ul>
                        </Col>
                        <Col lg={10}>
                            <ul>
                                <li><span>MFA认证：</span>{mafFun(userProfile["otp_level"])}</li>
                            </ul>
                        </Col>
                    </Row>
                </div>
                <div className="infor_container">
                    <h4>快速修改</h4>
                    <Row>
                        <Col lg={10}>
                            <ul>
                                <li><span>设置MFA：</span><button onClick={()=>history.push(`/setmfas`)}>启用</button></li>
                                <li><span>更改密码：</span><button onClick={()=>this.showDrawer("2")}>更新</button></li>
                            </ul>
                        </Col>
                        <Col lg={10}>
                            <ul>
                                <li><span>更改SSH密钥：</span><button onClick={()=>this.showDrawer("3")}>更新</button></li>
                                <li><span>重置并下载SSH密钥：</span><button onClick={(e) => downloadSSHKey(e)}>重置</button></li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default AccountDetails;
