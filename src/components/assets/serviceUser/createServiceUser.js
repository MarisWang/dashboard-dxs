import React, {Component} from 'react';
import {Input, Select, message, Spin} from "antd";
import {createOptions, checkEmptyInput, checkWordsNumber} from "../../../common/common";
import {
    getCmdFilterSelectOptions,
    fetchDatas,
    patchDatas,
    postDatas
} from "../../../common/apiManager";


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            cmd_filters: [],
            sudo: "/bin/whoami",
            shell: "/bin/bash",
            comment: "",
            purpose: "service",
            commandFilterList: [],
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
        fetchDatas(`/assets/v1/service-user/${record}`, result => {
            this.setState({
                name: result["name"],
                username: result["username"],
                cmd_filters: result["cmd_filters"],
                sudo: result["sudo"],
                shell: result["shell"],
                comment: result["comment"],
            });
        });
    };
    /**获取下拉选项的值**/
    getSelectOptions = () => {
        getCmdFilterSelectOptions(commandFilterList =>
            this.setState({
                commandFilterList,
            }),
        );
    };
    handleSelectChange = (value) => {
        this.setState({
            cmd_filters: value
        });
    };

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name, username, cmd_filters, sudo, shell, comment, purpose, commandFilterList} = this.state;
        let requiredObject = {name, sudo, shell};
        let data = {name, username, cmd_filters, sudo, shell, comment, purpose, commandFilterList};
        if (checkEmptyInput(requiredObject)) {
            checkWordsNumber("User name", this.state.username);
            if (edit) {
                patchDatas(`/assets/v1/service-user/${record}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/assets/v1/service-user/", data).then((result => {
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
        let {name, username, cmd_filters, sudo, shell, comment, commandFilterList} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>基本 </h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input type="text" name="name" value={name} onChange={this.onInputChange} minLength={1}
                                   maxLength={128}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">用户名</span>
                            <Input name="username" value={username} type="text" onChange={this.onInputChange}
                                   maxLength={32}/>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>命令过滤 </h4>
                        <div className="displayflexstart">
                            <span className="form_text">命令过滤器</span>
                            <Select mode="tags"
                                    size="default"
                                    value={cmd_filters}
                                    onChange={this.handleSelectChange}>
                                {createOptions(commandFilterList)}
                            </Select>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>其他 </h4>
                        <div className="displayflexstart">
                            <span className="form_text required">Sudo</span>
                            <textarea value={sudo} name="sudo" onChange={this.onInputChange} minLength={1}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">Shell </span>
                            <Input value={shell} name="shell" onChange={this.onInputChange} minLength={1}
                                   maxLength={64}/>
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