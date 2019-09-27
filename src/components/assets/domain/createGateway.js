import React, {Component} from 'react';
import {Input, Checkbox, Select, message, Spin, Button, Icon, Upload,} from "antd";
import {createOptions, checkEmptyInput, readFile, deleteNullObject,} from "../../../common/common";
import {
    fetchDatas,
    postDatas,
    patchDatas,
    getDomainSelectOptions,
} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            ip: "",
            protocol: "ssh",
            port: 22,
            username: "",
            password: "",
            domain: "",
            comment: "",
            is_active: true,
            domainList: [],
            protocolList: [],
            private_key: [],
            ssh_key: [],
            pageloading: true
        };
        this.protocolList = [
            {name: "SSH", id: "ssh"},
            {name: "RDP", id: "rdp"},
            // {name: "TELNET", id: "telnet"},
            // {name: "VNC", id: "vnc"},
        ];
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
        fetchDatas(`/assets/v1/gateway/${record}/`, result => {
            this.setState(result);
        });
    };

    /**获取下拉选项的值**/
    getSelectOptions = () => {
        /**网域**/
        getDomainSelectOptions(domainList =>
            this.setState({domainList})
        );
    };

    /**监控下拉选项事件**/
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

    /**监控复选框事件**/
    onCheckBoxChange = (e) => {
        this.setState({
            is_active: e.target.checked
        });
    };

    /**提交表单**/
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name, ip, protocol, port, username, password, domain, comment, ssh_key,is_active} = this.state;
        let private_key = ssh_key[0];
        let requiredObject = {name, ip, protocol, port, domain};
        let data = deleteNullObject({name, ip, protocol, port, username, password, domain, comment, private_key,is_active});
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                patchDatas(`/assets/v1/gateway/${record}/`, data).then((result => {
                    if (result && result instanceof Object) {
                        this.props.reloadData();
                        message.success("修改成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas(`/assets/v1/gateway/`, data).then((result => {
                    if (result && result instanceof Object) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
    };
    render() {
        let {name, ip, protocol, port, domain, username, password, comment, is_active, domainList, ssh_key} = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.ssh_key.indexOf(file);
                    const newFileList = state.ssh_key.slice();
                    newFileList.splice(index, 1);
                    return {
                        ssh_key: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                readFile(file, ssh_key =>{
                        this.setState({
                            ssh_key:[ssh_key],
                        });
                    }
                );
                return false;
            },
        };
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <form action="" onSubmit={(e) => this.submitForm(e)} name="fileinfo">
                        <div className="from_container">
                            <h4>基本 </h4>
                            <div className="displayflexstart">
                                <span className="form_text required">名称</span>
                                <Input name="name" value={name} onChange={this.onInputChange}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">IP</span>
                                <Input name="ip" value={ip} onChange={this.onInputChange}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">端口</span>
                                <Input name="port" value={port} onChange={this.onInputChange}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">协议</span>
                                <Select size="default"
                                        value={protocol}
                                        onChange={(value) => this.handleSelectChange(value, "protocol")}>
                                    {createOptions(this.protocolList)}
                                </Select>
                            </div>
                            <p>SSH网关，支持代理SSH,RDP和VNC</p>
                            <div className="displayflexstart">
                                <span className="form_text required">网域</span>
                                <Select size="default"
                                        value={domain}
                                        onChange={(value) => this.handleSelectChange(value, "domain")}>
                                    {createOptions(domainList)}
                                </Select>
                            </div>
                        </div>
                        <div className="from_container">
                            <h4>密码 </h4>
                            <div className="displayflexstart">
                                <span className="form_text">用户名</span>
                                <Input name="username" value={username} onChange={this.onInputChange}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">密码</span>
                                <Input name="password" value={password} type="password" autoComplete="new-password" onChange={this.onInputChange}/>
                            </div>
                            <p>不能包含特殊字符</p>
                            {
                                protocol === "ssh" ?
                                    <div className="displayflexstart">
                                        <span className="form_text">ssh私钥 </span> &nbsp;&nbsp;
                                        <Upload {...props}>
                                            {ssh_key.length > 0 ? ssh_key.name : <Button><Icon type="upload"/> 选择文件</Button>}
                                        </Upload>
                                    </div>
                                    : null
                            }
                        </div>
                        <div className="from_container">
                            <h4>其他 </h4>
                            <div className="displayflexstart">
                                <span className="form_text"> </span>
                                <Checkbox onChange={this.onCheckBoxChange} checked={is_active}>Is active</Checkbox>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">备注</span>
                                <textarea name="comment" value={comment} onChange={this.onInputChange}/>
                            </div>
                        </div>
                    </form>
                    <div className="form-btns displayflexend">
                        <button onClick={this.props.onCancel}>取消</button>
                        <button onClick={(e) => this.submitForm(e)}>提交</button>
                    </div>
                </div>
            </Spin>
        );
    }
}