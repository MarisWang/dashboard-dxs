import React from 'react';
import {Select, Spin} from 'antd';
import {
    postDatas,
    getIpsetsSelectOptions,
    getIptablesSelectOptions,
    getNodesSelectOptions,
    getAssetsSelectOptions,
    getSystemUsersSelectOptions,
    getServiceUsersSelectOptions, getLabelsSelectOptions, getUserSelectOptions
} from "../../../common/apiManager";
import {checkEmptyInput, createOptions, deleteNullObject} from "../../../common/common";
import Config from "../../../config/config";

const taksTypeOptions = [
    {id: "remove_ipset_item", name: "从IPset删除IP"},
    {id: "add_ipset_item", name: "添加IP到 IPset"},
    {id: "remove_iptables_item", name: "删除防火墙规则"},
    {id: "add_iptables_item", name: "添加防火墙规则"},
    {id: "ipsets", name: "推送IPset"},
    {id: "refresh_iptables", name: "刷新防火墙状态"},
    {id: "backup_iptables", name: "备份防火墙策略"},
];

export default class BulkTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task_type: "remove_ipset_item",
            assets: [],
            nodes: [],
            labels: [],
            users: [],
            comment: "",

            commands: "",
            ipsets: [],
            iptables: [],
            ipset: "",
            from_page: "ipset",

            system_users: [],
            assetLists: [],
            nodesLists: [],
            labelLists: [],
            userLists: [],
            systemUserLists: [],
            serviceUserLists: [],
            fileList: [],
            ipsetLists: [],
            iptableLists: [],
            pageloading: true,
        }
    }

    componentWillMount() {
        this.getSelectOptions();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }

    /**获取下拉列表选项**/
    getSelectOptions = () => {
        /**资产*/
        getAssetsSelectOptions(assetLists =>
            this.setState({
                assetLists,
            }),
        );
        /**节点**/
        getNodesSelectOptions(nodesLists =>
            this.setState({
                nodesLists,
            }),
        );
        /**系统用户**/
        getSystemUsersSelectOptions(systemUserLists =>
            this.setState({
                systemUserLists,
            }),
        );
        /**服务用户**/
        getServiceUsersSelectOptions(serviceUserLists =>
            this.setState({
                serviceUserLists,
            }),
        );
        /**标签**/
        getLabelsSelectOptions(labelLists =>
            this.setState({
                labelLists,
            }),
        );
        /**用户**/
        getUserSelectOptions(userLists =>
            this.setState({
                userLists,
            }),
        );

        /**ipsets**/
        getIpsetsSelectOptions(ipsetLists =>
            this.setState({
                ipsetLists,
            }),
        );
        /**iptables 防火墙规则**/
        getIptablesSelectOptions(iptableLists =>
            this.setState({
                iptableLists,
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
    /**提交表单**/
    submitForm = (e) => {
        e.preventDefault();
        let {
            task_type, assets, nodes, labels, users, commands, comment,ipsets, ipset,iptables,
            system_users, from_page
        } = this.state;
        let requiredObject = {};
        if (task_type === "remove_ipset_item" || task_type === "add_ipset_item") {
            requiredObject = {task_type, assets, comment, ipset};
        } else if (task_type === "remove_iptables_item" || task_type === "add_iptables_item") {
            requiredObject = {task_type, assets, comment, iptables};
        } else {
            requiredObject = {task_type, assets, comment};
        }
        let data = deleteNullObject({
            task_type, assets, nodes, labels, users, commands, comment, ipsets,iptables,
            system_users, from_page, ipset
        });
        if (checkEmptyInput(requiredObject)) {
            postDatas(`/assets/v1/bulktask/?from_page=ipset/`, data).then((result => {
                if (result) {
                    this.setDefault();
                    window.open(`${Config.api}/ops/celery/task/${result["task_id"]}/log/`, '测试可链接性', 'height=500, width=800');
                }
            }))
        }
    };

    /**设置默认值**/
    setDefault = () => {
        this.setState({
            task_type: "remove_ipset_item",
            assets: [],
            nodes: [],
            labels: [],
            users: [],
            commands: "",
            comment: "",
            iptables: [],
            ipsets: [],
            ipset: ""
        })
    };

    render() {
        let {
            task_type, assets, ipsets, ipset, labels, users, nodes, comment, ipsetLists, iptableLists, assetLists, nodesLists, labelLists, userLists,iptables,
        } = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="wrapper">
                    <div className="create_form">
                        <div className="from_container">
                            <h4>目标主机</h4>
                            <div className="displayflexstart">
                                <span className="form_text required">Task type</span>
                                <Select size="default"
                                        value={task_type}
                                        onChange={(value) => this.handleSelectChange(value, "task_type")}>
                                    {createOptions(taksTypeOptions)}
                                </Select>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">资产</span>
                                <Select mode="tags"
                                        size="default"
                                        value={assets}
                                        onChange={(value) => this.handleSelectChange(value, "assets")}>
                                    {createOptions(assetLists)}
                                </Select>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">节点</span>
                                <Select mode="tags"
                                        size="default"
                                        value={nodes}
                                        onChange={(value) => this.handleSelectChange(value, "nodes")}>
                                    {createOptions(nodesLists)}
                                </Select>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">标签</span>
                                <Select mode="tags"
                                        size="default"
                                        value={labels}
                                        onChange={(value) => this.handleSelectChange(value, "labels")}>
                                    {createOptions(labelLists)}
                                </Select>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">用户</span>
                                <Select mode="tags"
                                        size="default"
                                        value={users}
                                        onChange={(value) => this.handleSelectChange(value, "users")}>
                                    {createOptions(userLists)}
                                </Select>
                            </div>
                        </div>

                        <div className="from_container">
                            <h4>其他</h4>
                            {/*从IPset删除IP   添加IP到IPset*/}
                            {
                                task_type === "remove_ipset_item" || task_type === "add_ipset_item" ?
                                    <div>
                                        <div className="displayflexstart">
                                            <span className="form_text required">Ipset</span>
                                            <Select mode="tags"
                                                    size="default"
                                                    value={ipsets}
                                                    onChange={(value) => this.handleSelectChange(value, "ipsets")}>
                                                {createOptions(ipsetLists)}
                                            </Select>
                                        </div>
                                        <div className="displayflexstart">
                                            <span className="form_text required">IP</span>
                                            <textarea name="ipset" value={ipset} onChange={this.onInputChange}/>
                                        </div>
                                        <p>若是多个IP, 请用逗号、空格或换行符隔开</p>
                                    </div>
                                    : null
                            }
                            {/*推送IPset*/}
                            {
                                task_type === "ipsets" ?
                                    <div className="displayflexstart">
                                        <span className="form_text required">Ipset</span>
                                        <Select mode="tags"
                                                size="default"
                                                value={ipsets}
                                                onChange={(value) => this.handleSelectChange(value, "ipsets")}>
                                            {createOptions(ipsetLists)}
                                        </Select>
                                    </div>
                                    : null
                            }
                            {/*删除防火墙规则 添加防火墙规则*/}
                            {
                                task_type === "remove_iptables_item" || task_type === "add_iptables_item" ?
                                    <div className="displayflexstart">
                                        <span className="form_text required">防火墙规则 </span>
                                        <Select mode="tags"
                                                size="default"
                                                value={iptables}
                                                onChange={(value) => this.handleSelectChange(value, "iptables")}>
                                            {createOptions(iptableLists)}
                                        </Select>
                                    </div>
                                    : null
                            }
                            <div className="displayflexstart">
                                <span className="form_text required">备注</span>
                                <textarea name="comment"
                                          value={comment}
                                          onChange={this.onInputChange}/>
                            </div>
                        </div>
                        <div className="form-btns displayflexend">
                            <button onClick={this.setDefault}>重置</button>
                            <button onClick={this.submitForm}>提交</button>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}