import React, {Component} from 'react';
import {Input, message, Select, Spin} from "antd";
import {fetchDatas,
    getSecurityTemSelectOptions,
    patchDatas,
    postDatas
} from "../../../common/apiManager";
import {checkEmptyInput, createOptions} from "../../../common/common";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            templates: [],
            comment: "",
            templateLists: [],
            pageloading: true,
        }
    }

    componentWillMount() {
        this.getSelectOptions();
        if (this.props.edit) {
            this.setDefaultVaules();
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }

    /**获取默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/applications/v1/securitygroups/${record.id}/`, result => {
            let Templates = [];
            for (let i = 0; i < result.templates.length; i++) {
                Templates.push(result.templates[i].toString())
            }
            this.setState({
                name: record["name"],
                templates: Templates,
                comment: record["comment"],
            });
        });
    };
    /**下拉列表选项**/
    getSelectOptions = () => {
        getSecurityTemSelectOptions(templateLists =>
            this.setState({
                templateLists,
            }),
        );
    };
    /**监控复选框事件**/
    handleSelectChange = (value, role) => {
        this.setState({
            [role]: value
        });
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name, templates, comment} = this.state;
        let requiredObject = {name, templates, comment};
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                patchDatas(`/applications/v1/securitygroups/${record.id}/`, this.state).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/applications/v1/securitygroups/?is_template=false/", this.state).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
    };

    render() {
        let {name, templates, comment, templateLists} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>Basic </h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input value={name} name="name" onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">安全组模板：</span>
                            <Select mode="tags"
                                    size="default"
                                    value={templates}
                                    onChange={(value) => this.handleSelectChange(value, "templates")}>
                                {createOptions(templateLists)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">备注</span>
                            <textarea value={comment} name="comment" onChange={this.onInputChange}/>
                        </div>
                    </div>
                    <div className="form-btns displayflexend">
                        <button onClick={this.props.onCancel}>取消</button>
                        <button onClick={(e) => this.submitForm(e)}>提交</button>
                    </div>
                </div>
            </Spin>
        );
    }
}