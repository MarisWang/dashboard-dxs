import React, {Component} from 'react';
import {Select, message, DatePicker, Spin} from "antd";
import {createOptions, checkEmptyInput, deleteNullObject, getTimeForNow,} from "../../common/common";
import {
    postDatas, patchDatas, getApplyPermsAssetsSelectOptions, getApplyPermsSystemUsersSelectOptions,
    getApplyPermsApproverSelectOptions, getApplyPermsNodesSelectOptions, fetchDatas
} from "../../common/apiManager";
import moment from "moment";

const {Option} = Select;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            assets: [],
            nodes: [],
            system_users: [],
            date_start: getTimeForNow(),
            endOpen: false,
            end: "2100-01-01 08:00:00 +0800",
            approver: "",
            assetsList: [],
            nodesList: [],
            systemUsetList: [],
            approverLists: []
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
        fetchDatas(`/apply-perms/v1/apply-permissions/${record.id}/`, result => {
            this.setState({
                name: result.name,
                approver: result.approver,
                assets: [result.assets],
                nodes: result.nodes,
                system_users: result.system_users,
                date_start: result.start,
                end: result.end,
            });
        });
    };
    /**获取下拉列表选项**/
    getSelectOptions = () => {
        /**资产下拉列表**/
        getApplyPermsAssetsSelectOptions(assetsList =>
            this.setState({
                assetsList,
            }),
        );
        /**系统用户下拉列表**/
        getApplyPermsSystemUsersSelectOptions(systemUsetList =>
            this.setState({
                systemUsetList,
            }),
        );
        /**审批人下拉列表**/
        getApplyPermsApproverSelectOptions(approverLists =>
            this.setState({
                approverLists,
            }),
        );
        /**节点下拉列表**/
        getApplyPermsNodesSelectOptions(nodesList =>
            this.setState({
                nodesList,
            }),
        );
    };
    /**监控下拉列表事件**/
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
        let {edit, record} = this.props;
        let {name, assets, nodes, system_users, date_start, end, endOpen, approver, comment} = this.state;
        let requiredObject = {name, system_users, approver, comment};
        if (checkEmptyInput(requiredObject)) {
            // assets = "[" + assets + "]";
            // nodes = "[" + nodes + "]";
            // system_users = "[" + system_users + "]";
            let data = {
                name,
                assets,
                nodes,
                system_users,
                date_start,
                end,
                endOpen,
                approver,
                comment
            };
            if (edit) {
                patchDatas(`/apply-perms/v1/apply-permissions/${record.id}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("修改成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/apply-perms/v1/apply-permissions/", data).then((result => {
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
        const end = this.state.end;
        if (!date_start || !end) {
            return false;
        }
        return date_start.valueOf() > end.valueOf();
    };
    /**不可选开始日期**/
    disabledEndDate = end => {
        const date_start = this.state.date_start;
        if (!end || !date_start) {
            return false;
        }
        return end.valueOf() <= date_start.valueOf();
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
            end: `${dataString} +0800`
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
            name, assets, nodes, system_users, date_start, end, endOpen, approver, comment,
            assetsList, nodesList, systemUsetList, approverLists
        } = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>基本</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <input name="name" value={name} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">选择资产</span>
                            <Select mode="tags"
                                    size="default"
                                    value={assets}
                                    onChange={(value) => this.handleSelectChange(value, "assets")}>
                                {
                                    assetsList.map((x, index) =>
                                        <Option key={index} title={x.name} value={x.id}>{x.name}</Option>)
                                }
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">选择节点</span>
                            <Select mode="tags"
                                    size="default"
                                    value={nodes}
                                    onChange={(value) => this.handleSelectChange(value, "nodes")}>
                                {
                                    nodesList.map((x, index) =>
                                        <Option key={index} title={x.name} value={x.id}>{x.name}</Option>)
                                }
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">选择系统用户</span>
                            <Select mode="tags"
                                    size="default"
                                    value={system_users}
                                    onChange={(value) => this.handleSelectChange(value, "system_users")}>
                                {
                                    systemUsetList.map((x, index) =>
                                        <Option key={index} title={x.name} value={x.id}>{x.name}</Option>)
                                }
                            </Select>
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
                                    value={moment(end, 'YYYY-MM-DD HH:mm:ss')}
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">选择审批人</span>
                            <Select size="default"
                                    value={approver}
                                    onChange={(value) => this.handleSelectChange(value, "approver")}>
                                {createOptions(approverLists)}
                            </Select>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>其它 </h4>
                        <div className="displayflexstart">
                            <span className="form_text required">申请理由</span>
                            <textarea name="comment" value={comment} onChange={this.onInputChange}/>
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