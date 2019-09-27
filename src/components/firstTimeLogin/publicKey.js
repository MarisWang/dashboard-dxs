import React from 'react';
import {message} from "antd";
import axios from "axios";
import {postApi, header} from "../../common/apiManager";
import {downloadSSHKey} from "../../common/common";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _public_key: ""
        };
    }

    submitForm = (e) => {
        e.preventDefault();
        let data = {_public_key: this.state._public_key};
        let id = JSON.parse(localStorage.getItem("Auth")).user.userid;
        let that = this;
        axios({
            method: 'PATCH',
            url: postApi(`/users/v1/users/${id}/pubkey/update/`),
            headers: header(),
            data: data,
        }).then(function (response) {
            if (response.data && response.data instanceof Object) {
                that.props.next();
            }
        }).catch(function (error) {
            message.error("不是有效的SSH公钥。")
        })
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        return (
            <div className="create_form">
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
                    <button onClick={this.props.prev}>上一步</button>
                    <button onClick={(e) => this.submitForm(e)}>下一步</button>
                </div>
            </div>
        )
    }
}
