import React, {Component} from 'react';
import {message} from "antd";
import {patchDatas} from "../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
        }
    }


    componentWillMount() {
        if (this.props.edit) {
            this.setDefaultVaules();
        }
    }

    /**获取默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        this.setState({
            comment: record["comment"],
        });
    };

    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**提交表单**/
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {comment,} = this.state;
        if (comment !== "") {
            let data = {comment};
            if (edit) {
                patchDatas(`/perms/v1/user/assets/${record}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("修改成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                message.error("备注是空的，没有可保存的内容！")
            }
        }
    };

    render() {
        let {comment} = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>其它 </h4>
                    <div className="displayflexstart">
                        <span className="form_text">备注</span>
                        <input name="comment" value={comment} onChange={this.onInputChange}/>
                    </div>
                    <br/>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.props.onCancel}>取消</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}