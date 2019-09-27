import React, {Component} from 'react';
import {Input, message} from "antd";
import {fetchDatas, patchDatas, postDatas} from "../../../common/apiManager";
import {checkEmptyInput} from "../../../common/common";


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            comment: "",
            is_template: true
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
        fetchDatas(`/applications/v1/securitygroups/${record.id}`, result => {
            result.managers = result.managers_display === "" ? [] : [result.managers_display];
            this.setState({
                name: result.name,
                comment: result.name,
            });
        });
    };


    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name, comment, is_template} = this.state;
        let requiredObject = {name};
        let data = {name, comment, is_template};
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                patchDatas(`/applications/v1/securitygroups/${record.id}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas(`/applications/v1/securitygroups/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        let {name} = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>Basic </h4>
                    <div className="displayflexstart">
                        <span className="form_text required">名称</span>
                        <Input name="name" value={name} onChange={this.onInputChange} minLength={1} maxLength={20}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">备注</span>
                        <textarea name="comment" onChange={this.onInputChange} minLength={1} maxLength={20}/>
                    </div>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.props.onCancel}>取消</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}
