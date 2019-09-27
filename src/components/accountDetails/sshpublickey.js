import React, {Component} from 'react';
import {message,} from "antd";
import {getUserInformation, patchDatas} from "../../common/apiManager";
import {downloadSSHKey} from "../../common/common";

export default class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: {},
            _public_key: ""
        }
    }

    componentWillMount() {
        getUserInformation(result=>{
            this.setState({
                userProfile: result
            });
        });
    }

    submitForm = (e) => {
        e.preventDefault();
        let data = {_public_key: this.state._public_key};
        let id = JSON.parse(localStorage.getItem("Auth")).user.userid;
        patchDatas(`/users/v1/users/${id}/pubkey/update/`, data).then((result => {
            if (result && result instanceof Object) {
                this.getTableDatas();
                message.success("修改成功!");
                this.props.onCancel();
            }
        }));
    };
    /**download SSH key**/

    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        let {userProfile} = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>原来ssh密钥</h4>
                    <div className="displayflexstart">
                        <span className="form_text">名称：</span>
                        {userProfile["finger_name"]}
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">指纹：</span>
                        {userProfile["fingerprint"]}
                    </div>
                </div>
                <div className="from_container">
                    <h4>更新密钥</h4>
                    <div className="displayflexstart">
                        <span className="form_text">ssh公钥：</span>
                        <textarea name="name"
                                  onChange={this.onInputChange}
                                  placeholder="ssh-rsa AAAA ..."/>
                    </div>
                    <p>复制你的公钥到这里</p>
                    <p>或者重置并下载密钥 &nbsp;&nbsp;&nbsp;
                        <button onClick={(e) => downloadSSHKey(e)}>重置</button>
                    </p>
                </div>
                <div className="form-btns displayflexend">
                    {/*<button onClick={this.props.onCancel}>重置</button>*/}
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}

