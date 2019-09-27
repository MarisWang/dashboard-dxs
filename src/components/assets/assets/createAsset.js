import React, {Component} from 'react';
import {Checkbox, Select, message, Spin, Icon, Button} from "antd";
import {createOptions, checkEmptyInput,} from "../../../common/common";
import {
    fetchDatas, postDatas, patchDatas, getDomainSelectOptions, getAdminUserSelectOptions,
    getSecurityGroupsNodesSelectOptions, getNodesSelectOptions, getLabelsSelectOptions
} from "../../../common/apiManager";

const optionsList = {
    protocol: [
        {name: "SSH", id: "ssh"},
        {name: "RDP", id: "rdp"},
        {name: "TELNET", id: "telnet"},
        {name: "VNC", id: "vnc"},
    ],
    platform: [
        {name: "Linux", id: "Linux"},
        {name: "Unix", id: "Unix"},
        {name: "MacOS", id: "MacOS"},
        {name: "BSD", id: "BSD"},
        {name: "Windows", id: "Windows"},
        {name: "Windows(2016)", id: "Windows2016"},
        {name: "HuaweiCE", id: "HuaweiCE"},
        {name: "CiscoIOS", id: "CiscoIOS"},
        {name: "Other", id: "Other"},
    ],
};

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hostname: "",
            ip: "",
            protocols: [],
            // port: "",
            platform: "",
            public_ip: "",
            domain: "",
            admin_user: "",
            securitygroup_display: [],
            nodes_display: [],
            labels: [],
            comment: "",
            is_active: true,
            domainLists: [],//网域
            adminUserLists: [],//管理用户
            securityGroupsLists: [],//安全组
            nodeLists: [],//节点
            labelLists: [],//标签
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
        fetchDatas(`/assets/v1/assets/${record.id}/`, result => {
            result.managers_display = result.managers_display === "" ? [] : [result.managers_display];
            let Protocol = [];
            for (let item in result.protocols) {
                let Arr = result.protocols[item].split("/");
                Protocol.push({
                    id: item + 1,
                    protocols: Arr[0],
                    port: Arr[1],
                });
            }
            result.protocols = Protocol;
            this.setState({
                hostname: result["hostname"],
                ip: result["ip"],
                protocols: result["protocols"],
                // port: result["ssh_port"],
                platform: result["platform"],
                public_ip: result["public_ip"] ? result["public_ip"] : "",
                domain: result["domain"],
                admin_user: result["admin_user"],
                securitygroup_display: [result["securitygroup_display"]],
                nodes: result["nodes"],
                labels: result["labels"],
                comment: result["comment"],
                is_active: result["is_active"],
            });
        });
    };
    /**获取下拉列表选项**/
    getSelectOptions = () => {
        /**网域**/
        getDomainSelectOptions(domainLists =>
            this.setState({
                domainLists,
            }),
        );
        /**管理用户**/
        getAdminUserSelectOptions(adminUserLists =>
            this.setState({
                adminUserLists,
            }),
        );
        /**安全组**/
        getSecurityGroupsNodesSelectOptions(securityGroupsLists =>
            this.setState({
                securityGroupsLists,
            }),
        );
        /**节点**/
        getNodesSelectOptions(nodeLists =>
            this.setState({
                nodeLists,
            }),
        );
        /**标签**/
        getLabelsSelectOptions(labelLists =>
            this.setState({
                labelLists,
            }),
        );
    };
    /**监控复选框事件**/
    handleSelectChange = (value, role) => {
        value = value ? value :"";
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
        let {hostname, ip, protocols, port, platform, public_ip, domain, admin_user, securitygroup_display, nodes, labels, comment, is_active} = this.state;
        let requiredObject = {hostname, ip, protocols, platform, nodes, public_ip};
        if (checkEmptyInput(requiredObject)) {
            let protocol = [];
            protocols.map((item) => {
                protocol.push(`${item.protocols}/${item.port}`);
            });
            protocols = protocol;
            let data = {
                hostname, ip, protocols,platform, public_ip, domain, admin_user,
                securitygroup_display, nodes, labels, comment, is_active
            };
            if (edit) {
                patchDatas(`/assets/v1/assets/${record.id}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("修改成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/assets/v1/assets/", data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
    };
    /**删除协议组**/
    remove = id => {
        const {protocols} = this.state;
        if (protocols.length === 1) {
            return;
        }
        this.setState({
            protocols: protocols.filter(x => x.id !== id),
        });
    };
    /**添加协议组**/
    add = () => {
        let {protocols} = this.state;
        protocols.push({
            id: protocols.length + 1,
            protocols: "ssh",
            port: 22,
        });
        this.setState({
            protocols
        });
    };
    /**协议改变**/
    handlePortChange = (value, id) => {
        let {protocols} = this.state;
        protocols.map((item) => {
            if (item.id === id) {
                item["protocols"] = value
            }
        });
        this.setState({
            protocols
        })
    };
    /**端口改变**/
    onPortInputChange = (e, id) => {
        let {protocols} = this.state;
        protocols.map((item) => {
            if (item.id === id) {
                item["port"] = e.target.value
            }
        });
        this.setState({
            protocols
        })
    };

    render() {
        let {hostname, ip, protocols, platform, public_ip, domain, admin_user, securitygroup_display, nodes, labels, comment, is_active, domainLists, adminUserLists, securityGroupsLists, nodeLists, labelLists} = this.state;
        const formItems = protocols.map((item, index) => {
            return (
                <div className="displayflexstart" key={index}>
                    <span className="form_text">协议与端口 {index + 1}</span>
                    <Select size="default"
                            style={{width: "200px"}}
                            value={item.protocols}
                            onChange={(value) => this.handlePortChange(value, item.id)}>
                        {createOptions(optionsList.protocol)}
                    </Select>
                    &nbsp;&nbsp;&nbsp;
                    <input name="port" style={{width: "200px"}} value={item.port}
                           onChange={(e) => this.onPortInputChange(e, item.id)}/>
                    &nbsp;&nbsp;&nbsp;
                    {protocols.length === 1 ? null : <Icon type="minus" onClick={() => this.remove(item.id)}/>}
                </div>
            )
        });
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>基本</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">主机名</span>
                            <input name="hostname" value={hostname} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">IP1（默认填内网IP）</span>
                            <input name="ip" value={ip} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">系统平台</span>
                            <Select size="default"
                                    value={platform}
                                    onChange={(value) => this.handleSelectChange(value, "platform")}>
                                {createOptions(optionsList.platform)}
                            </Select>
                        </div>
                        <p>Windows 2016的RDP协议与之前不同，如果是请设置</p>
                        <div className="displayflexstart">
                            <span className="form_text required">IP2（默认填公网IP）</span>
                            <input name="public_ip" value={public_ip} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">网域</span>
                            <Select size="default"
                                    value={domain}
                                    allowClear={true}
                                    onChange={(value) => this.handleSelectChange(value, "domain")}>
                                {createOptions(domainLists)}
                            </Select>
                        </div>
                        <p>如果有多个的互相隔离的网络，设置资产属于的网域，使用网域网关跳转登录</p>
                    </div>
                    <div className="from_container" id="portProtocol">
                        <h4>协议组</h4>
                        <div className="displayflexbetween">
                            <div>
                                {formItems}
                            </div>
                            <Button type="primary" onClick={this.add}>
                                <Icon type="plus"/> 添加协议组
                            </Button>
                        </div>
                        <br/>
                    </div>
                    <div className="from_container">
                        <h4>认证</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">管理用户</span>
                            <Select size="default"
                                    value={admin_user}
                                    onChange={(value) => this.handleSelectChange(value, "admin_user")}>
                                {createOptions(adminUserLists)}
                            </Select>
                        </div>
                        <p>root或其他拥有NOPASSWD: ALL权限的用户, 如果是windows或其它硬件可以随意设置一个, 更多信息查看左侧 `管理用户` 菜单</p>
                    </div>
                    <div className="from_container">
                        <h4>防火墙管理</h4>
                        <div className="displayflexstart">
                            <span className="form_text">安全组</span>
                            <Select size="default"
                                    value={securitygroup_display}
                                    onChange={(value) => this.handleSelectChange(value, "securitygroup_display")}>
                                {createOptions(securityGroupsLists)}
                            </Select>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>节点 </h4>
                        <div className="displayflexstart">
                            <span className="form_text required">节点</span>
                            <Select mode="tags"
                                    size="default"
                                    value={nodes}
                                    onChange={(value) => this.handleSelectChange(value, "nodes")}>
                                {createOptions(nodeLists)}
                            </Select>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>标签管理 </h4>
                        <div className="displayflexstart">
                            <span className="form_text">标签</span>
                            <Select mode="tags"
                                    size="default"
                                    value={labels}
                                    onChange={(value) => this.handleSelectChange(value, "labels")}>
                                {createOptions(labelLists)}
                            </Select>
                        </div>
                    </div>
                    {/*<div className="from_container">*/}
                    {/*    <h4>配置 </h4>*/}
                    {/*    <div className="displayflexstart">*/}
                    {/*        <span className="form_text">资产编号</span>*/}
                    {/*        <input name="comment" value={comment} onChange={this.onInputChange}/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="from_container">
                        <h4>其它 </h4>
                        <div className="displayflexstart">
                            <span className="form_text">备注</span>
                            <textarea name="comment" value={comment} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text"> </span>
                            <Checkbox onChange={this.onCheckBoxChange} checked={is_active}>激活</Checkbox>
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