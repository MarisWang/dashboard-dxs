import React, {Component} from 'react';
import {Input, Checkbox, Select, DatePicker, message, Spin} from "antd";
import moment from 'moment';
import {fetchDatas, patchDatas, postDatas,} from "../../../common/apiManager";
import {checkEmptyInput, createOptions, getTimeForNow} from "../../../common/common";

const actionList = [
    {id: "all", name: "全部"},
    {id: "connect", name: "连接"},
    {id: "upload_file", name: "上传文件"},
    {id: "download_file", name: "下载文件"},
    {id: "updownload", name: "上传下载"},
];

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            users: [],
            user_groups: [],
            assets: [],
            nodes: [],
            system_users: [],
            actions: [],
            is_active: true,
            date_start: getTimeForNow(),
            date_expired: "2100-01-01 08:00:00 +0800",
            comment: "",
            endOpen: false,

            userList: [],
            userGroupList: [],
            assetList: [],
            nodeLists: [],
            systemUserList: [],
            actionList: [],
            pageloading: true,
        }
    }

    componentWillMount() {
        if (this.props.edit) {
            this.setDefaultVaules();
        }
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
        let role = JSON.parse(localStorage.getItem("Auth")).user.role;
        let Url = role === 2 ? `/perms/v1/asset-permissions/${record.id}/?created_by=group_admin` : `/perms/v1/asset-permissions/${record.id}/`;
        fetchDatas(Url, result => {
            this.setState({
                name: result["name"],
                users: result["users"],
                user_groups: result["user_groups"],
                assets: result["assets"],
                nodes: result["nodes"],
                system_users: result["system_users"],
                actions: result["actions"],
                is_active: result["is_active"],
                date_start: result["date_start"],
                date_expired: result["date_expired"],
                comment: result["comment"],
                endOpen: result["endOpen"],
            });
        });
    };
    /**下拉列表选项**/
    getSelectOptions = () => {
        let userId = JSON.parse(localStorage.getItem("Auth")).user.userid;
        fetchDatas(`/perms/v1/user-permissions/detail/${userId}/`, result => {
            result["perm_assets"].map((item) => {
                item.name = item.ip;
            });
            this.setState({
                userList: result["perm_managed_users"],
                userGroupList: result["perm_groups"],
                assetList: result["perm_assets"],
                nodeLists: result["perm_nodes"],
                systemUserList: result["perm_system_users"],
            });
        })
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**监控select**/
    handleSelectChange = (value, name) => {
        this.setState({
            [name]: value
        });
    };
    /**激活中**/
    onCheckChange = (e) => {
        this.setState({
            is_active: e.target.checked
        });
    };
    /**提交表单**/
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {
            name, users, user_groups, assets, nodes, system_users, actions, is_active, date_start,
            date_expired, comment, endOpen
        } = this.state;
        let requiredObject = {name, system_users};
        if (checkEmptyInput(requiredObject)) {
            let data = {
                name, users, user_groups, assets, nodes, system_users, actions, is_active, date_start,
                date_expired, comment, endOpen
            };
            if (edit) {
                patchDatas(`/perms/v1/asset-permissions/${record.id}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("修改成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/perms/v1/asset-permissions/", data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
    };
    /**不可选开始日期**/
    disabledStartDate = date_start => {
        const date_expired = this.state.date_expired;
        if (!date_start || !date_expired) {
            return false;
        }
        return date_start.valueOf() > date_expired.valueOf();
    };
    /**不可选开始日期**/
    disabledEndDate = date_expired => {
        const date_start = this.state.date_start;
        if (!date_expired || !date_start) {
            return false;
        }
        return date_expired.valueOf() <= date_start.valueOf();
    };
    /**开始时间**/
    onStartChange = (value, dataString) => {
        this.setState({
            date_start: `${dataString} +0800`
        })
    };
    /**结束时间**/
    onEndChange = (value, dataString) => {
        this.setState({
            date_expired: `${dataString} +0800`
        })
    };
    handleStartOpenChange = open => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };
    handleEndOpenChange = open => {
        this.setState({endOpen: open});
    };

    render() {
        let {
            name, users, user_groups, assets, actions, comment, nodes, system_users, date_start,
            is_active, date_expired, endOpen, userList, userGroupList, assetList, nodeLists,
            systemUserList
        } = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>基本 </h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name" value={name} onChange={this.onInputChange} minLength={1} maxLength={20}/>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>用户 </h4>
                        <div className="displayflexstart">
                            <span className="form_text">用户</span>
                            <Select mode="tags"
                                    size="default"
                                    value={users}
                                    onChange={(value) => this.handleSelectChange(value, "users")}>
                                {createOptions(userList)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">用户组</span>
                            <Select mode="tags"
                                    size="default"
                                    value={user_groups}
                                    onChange={(value) => this.handleSelectChange(value, "user_groups")}>
                                {createOptions(userGroupList)}
                            </Select>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>资产 </h4>
                        <div className="displayflexstart">
                            <span className="form_text">资产</span>
                            <Select mode="tags"
                                    size="default"
                                    value={assets}
                                    onChange={(value) => this.handleSelectChange(value, "assets")}>
                                {createOptions(assetList)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">节点</span>
                            <Select mode="tags"
                                    size="default"
                                    value={nodes}
                                    onChange={(value) => this.handleSelectChange(value, "nodes")}>
                                {createOptions(nodeLists)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">系统用户</span>
                            <Select mode="tags"
                                    size="default"
                                    value={system_users}
                                    onChange={(value) => this.handleSelectChange(value, "system_users")}>
                                {createOptions(systemUserList)}
                            </Select>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>动作 </h4>
                        <div className="displayflexstart">
                            <span className="form_text">动作</span>
                            <Select
                                mode="tags"
                                size="default"
                                value={actions}
                                onChange={(value) => this.handleSelectChange(value, "actions")}>
                                {createOptions(actionList)}
                            </Select>
                        </div>
                        <p>提示：RDP 协议不支持单独控制上传或下载文件</p>
                    </div>
                    <div className="from_container">
                        <h4>其它</h4>
                        <div className="displayflexstart">
                            <span className="form_text">激活中</span>
                            <Checkbox onChange={this.onCheckChange} checked={is_active}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">有效期</span>
                            <div className="displayflexstart" style={{flexFlow: "nowrap", margin: 0}}>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={moment(date_start, 'YYYY-MM-DD HH:mm:ss')}
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                &nbsp; &nbsp; &nbsp;
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={moment(date_expired, 'YYYY-MM-DD HH:mm:ss')}
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">备注</span>
                            <textarea name="comment" value={comment} onChange={this.onInputChange} minLength={1}
                                      maxLength={20}/>
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