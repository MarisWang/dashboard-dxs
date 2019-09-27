import React, {Component} from 'react';
import {Input, Checkbox, Select, message, Spin, Button, Icon, Upload} from "antd";
import {checkEmptyInput, checkInteger, createOptions, deleteNullObject, readFile} from "../../../common/common";
import {fetchDatas, getCmdFilterSelectOptions, patchDatas} from "../../../common/apiManager";

const system = {
    loginMode: [
        {name: "自动登录", id: "auto"},
        {name: "手动登录", id: "manual"},
    ],
    protocol: [
        {name: "SSH", id: "ssh"},
        {name: "RDP", id: "rdp"},
        {name: "TELNET", id: "telnet"},
        {name: "VNC", id: "vnc"},
    ],
};

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            login_mode: "auto",
            username: "",
            priority: 20,
            protocol: "ssh",
            auto_push: true,
            cmd_filters: [],
            sudo: "/bin/whoami",
            shell: "/bin/whoami",
            comment: "",
            commandFiterList: [],
            ssh_key: [],
        }
    }

    componentWillMount() {
        this.setDefaultVaules();
    }

    componentDidMount() {
        this.getSelectOptions();
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }

    /**获取默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/assets/v1/system-user/${record}`, result => {
            this.setState({
                name: result["name"],
                login_mode: result["login_mode"],
                username: result["username"],
                priority: result["priority"],
                protocol: result["protocol"],
                auto_push: result["auto_push"],
                cmd_filters: result["cmd_filters"],
                sudo: result["sudo"],
                shell: result["shell"],
                comment: result["comment"],
            });
        });
    };
    /**获取下拉列表选项**/
    getSelectOptions = () => {
        /**命令过略选项**/
        getCmdFilterSelectOptions(commandFiterList =>
            this.setState({
                commandFiterList,
            }),
        );
    };
    /**监控select**/
    handleSelectChange = (value, name) => {
        this.setState({
            [name]: value
        });
    };
    /**checkbox**/
    onCheckboxChange = (e, name) => {
        this.setState({
            [name]: e.target.checked
        });
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    submitForm = (e) => {
        e.preventDefault();
        let {record} = this.props;
        let {name, login_mode, username, priority, protocol, auto_push, cmd_filters, sudo, shell, comment,ssh_key} = this.state;
        let private_key = ssh_key[0];
        let requiredObject = {name, login_mode, priority, protocol, sudo, shell};
        let data = deleteNullObject({name, login_mode, username, priority, protocol, auto_push, sudo, shell, comment,private_key});
        if (checkEmptyInput(requiredObject)) {
            checkInteger("Priority", priority);
            data.cmd_filters = cmd_filters;
            patchDatas(`/assets/v1/system-user/${record}/`, data).then((result => {
                if (result) {
                    this.props.reloadData();
                    message.success("编辑成功!");
                    this.props.onCancel();
                }
            }))
        }
    };

    render() {
        let {name, login_mode, commandFiterList, username, priority, protocol, password, auto_push, cmd_filters, sudo, shell, comment,ssh_key} = this.state;
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
                                <Input name="name" onChange={this.onInputChange} value={name} minLength={1}
                                       maxLength={128}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">登录模式</span>
                                <Select value={login_mode}
                                        onChange={(value) => this.handleSelectChange(value, "login_mode")}>
                                    {createOptions(system.loginMode)}
                                </Select>
                            </div>
                            <p>如果选择手动登录模式,用户名和密码可以不填写.</p>
                            <div className="displayflexstart">
                                <span className="form_text">用户名</span>
                                <Input name="username" value={username} onChange={this.onInputChange} minLength={1}
                                       maxLength={128}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">优先级</span>
                                <Input type="number" name="priority" value={priority}
                                       onChange={this.onInputChange} minLength={1} maxLength={128}/>
                            </div>
                            <p>1-100, 1最低优先级，100最高优先级。授权多个用户时，高优先级的系统用户将会作为默认登录用户</p>

                            <div className="displayflexstart">
                                <span className="form_text required">协议</span>
                                <Select value={protocol}
                                        onChange={(value) => this.handleSelectChange(value, "protocol")}>
                                    {createOptions(system.protocol)}
                                </Select>
                            </div>
                        </div>

                        {
                            login_mode === "auto" ?
                                <div className="from_container">
                                    <h4>认证 </h4>
                                    <div className="displayflexstart">
                                        <span className="form_text">密码</span>
                                        <Input name="password"
                                               autoComplete="new-password"
                                               type="password"
                                               value={password}
                                               onChange={this.onInputChange}/>
                                    </div>
                                    <p>密码或密钥密码</p>
                                    <div className="displayflexstart">
                                        <span className="form_text">ssh私钥 </span> &nbsp;&nbsp;
                                        <Upload {...props}>
                                            {ssh_key.length > 0 ? ssh_key.name : <Button><Icon type="upload"/> 选择文件</Button>}
                                        </Upload>
                                    </div>
                                    <div className="displayflexstart">
                                        <span className="form_text">自动推送&nbsp;&nbsp;</span>
                                        <Checkbox onChange={(e) => this.onCheckboxChange(e, "auto_push")}
                                                  checked={auto_push}/>
                                    </div>
                                </div> : null
                        }

                        <div className="from_container">
                            <h4>命令过滤器</h4>
                            <div className="displayflexstart">
                                <span className="form_text">命令过滤器</span>
                                <Select mode="tags"
                                        size="default"
                                        value={cmd_filters}
                                        onChange={(value) => this.handleSelectChange(value, "cmd_filters")}>
                                    {createOptions(commandFiterList)}
                                </Select>
                            </div>
                        </div>
                        <div className="from_container">
                            <h4>其它 </h4>
                            <div className="displayflexstart">
                                <span className="form_text required">Sudo</span>
                                <textarea value={sudo} name="sudo" onChange={this.onInputChange} minLength={1}
                                          maxLength={128}/>
                            </div>
                            <p>使用逗号分隔多个命令，如: /bin/whoami,/sbin/ifconfig</p>
                            <div className="displayflexstart">
                                <span className="form_text required">Shell </span>
                                <Input value={shell} name="shell" onChange={this.onInputChange} minLength={1}
                                       maxLength={128}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">备注</span>
                                <textarea value={comment} name="comment" onChange={this.onInputChange} minLength={1}
                                          maxLength={128}/>
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