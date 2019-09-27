import React from 'react';
import {Radio} from 'antd';
import { fetchDatas, patchDatas} from "../../common/apiManager";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otp_level: 0,
        };
    }

    componentWillMount() {
        this.getTableDatas();
    }

    getTableDatas = () => {
        fetchDatas(`/users/v1/profile/`, result => {
            this.setState({
                otp_level: result["otp_level"],
            });
        });
    };
    onChange = e => {
        this.setState({
            otp_level: e.target.value,
        });
    };
    submitForm = (e) => {
        e.preventDefault();
        let {otp_level} = this.state;
        let data = {otp_level};
        patchDatas(`/users/v1/profile/`, data).then((result => {
            if (result) {
                this.props.next();
            }
        }))
    };

    render() {
        let {otp_level} = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>MFA设置</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">MFA</span>
                        <Radio.Group onChange={this.onChange} value={otp_level}>
                            <Radio value={0}>禁用</Radio>
                            <Radio value={1}>启用</Radio>
                        </Radio.Group>
                    </div>
                    <p>启用MFA身份验证以使帐户更安全。</p>
                    <p>提示：启用后，您将在下次登录时输入绑定的MFA进行验证。您也可以直接绑定或者解绑MFA通过：
                        “用户中心 - > 快速修改 - >MFA设置”！</p>
                    <br/>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.props.prev}>上一步</button>
                    <button onClick={(e) => this.submitForm(e)}>下一步</button>
                </div>
            </div>
        )
    }
}
