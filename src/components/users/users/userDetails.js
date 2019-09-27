import React from 'react';
import {message, Tabs, Switch, Select, Tag, Popconfirm, Icon} from 'antd';
import {fetchDatas, patchDatas, getUserGroupSelectOptions} from "../../../common/apiManager";
import {mafFun, createOptions} from "../../../common/common";
import moment from "moment";

const TabPane = Tabs.TabPane;

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOptions: [],
            groups: [],
            otp_level: this.props.record["otp_level"],
        };
    }
    componentWillMount() {
        this.getSelectOptions();
        this.setState({
            groups: this.props.record.groups
        })
    }

    /**获得下拉选项和标签项**/
    getSelectOptions = () => {
        getUserGroupSelectOptions(selectOptions => {
            this.setState({
                selectOptions
            });
        });
    };
    /**监控复选框事件**/
    handleSelectChange = (value, role) => {
        this.setState({
            [role]: value
        });
    };
    /**添加选中项目**/
    addSeletedItem = () => {
        let {id} = this.props.record;
        let data = {groups: this.state.groups};
        patchDatas(`/users/v1/users/${id}/groups/`, data).then((result => {
            if (result && result instanceof Object) {
                this.props.reloadData();
                message.success("修改成功!");
            }
        }))
    };
    /**表格详情中，发送重置密钥邮件**/
    updateKeyByEmail = () => {
        let {id} = this.props.record;
        fetchDatas(`/users/v1/users/${id}/pubkey/reset/`, result => {
            message.success("发送成功！")
        });
    };
    /**表格详情中，禁用用户**/
    blockUser = (checked) => {
        fetchDatas(`/users/v1/users/${this.props.record.id}/unblock/`, result => {
            if (checked) {
                message.success("用户已禁用！")
            } else {
                message.success("用户已启用！")
            }
        })
    };
    /**表格详情中，激活中**/
    activeUser = (checked) => {
        let data = {'is_active': checked};
        patchDatas(`/users/v1/users/${this.props.record.id}/`, data).then((result => {
            if (checked) {
                message.success("激活成功！")
            } else {
                message.success("已取消激活！")
            }
        }))
    };
    /**表格详情中，强制开启MFA**/
    fouceOpenMfa = (checked) => {
        let data = checked ? {'otp_level': 2} : {'otp_level': 0, 'otp_secret_key': ''};
        patchDatas(`/users/v1/users/${this.props.record.id}/`, data).then((result => {
            if (checked) {
                this.setState({otp_level: 2});
                message.success("已强制开启MFA！")
            } else {
                this.setState({otp_level: 0});
                message.success("强制开启MFA已关闭！")
            }
        }))
    };
    /**表格详情中，重置MFA**/
    resetMfa = () => {
        fetchDatas(`/users/v1/users/${this.props.record.id}/otp/reset/`, result => {
            if (result) {
                message.success("更新成功！")
            }
        })
    };

    render() {
        let {record} = this.props;
        let {groups, otp_level, selectOptions} = this.state;
        let USER = JSON.parse(localStorage.getItem("Auth")).user.username;
        let groups_display = record["groups_display"] === "" ? [] : record["groups_display"].split(",");
        return (
            <Tabs defaultActiveKey={"1"} animated>
                <TabPane tab="详情" key="1">
                    <div className="displayflexbetween detailUlList">
                        <ul>
                            <li><span>邮箱地址：</span>{record.email}</li>
                            <li><span>MFA认证:</span>{mafFun(otp_level)}</li>
                            <li><span>创建者:</span>{record["created_by"]}</li>
                            <li><span>备注:</span>{record["comment"]}</li>
                        </ul>
                        <ul>
                            <li><span>最后登录:</span>{moment(record["last_login"]).format('LLL')}</li>
                            <li><span>失效日期:</span>{moment(record["date_expired"]).format('LLL')}</li>
                            <li><span>最后更新密码::</span>{moment(record["date_password_last_updated"]).format('LLL')}</li>
                            <li><span>创建日期:</span>{moment(record["date_joined"]).format('LLL')}</li>
                        </ul>
                        <ul>
                            <li style={{display: record.unblock ? "block" : "none"}}>
                                <span>禁用用户:</span>
                                <Switch checkedChildren="禁用"
                                        unCheckedChildren="启用"
                                        onChange={this.blockUser}
                                        checked={record["is_active"]}
                                        size={"small"}/>
                            </li>
                            <li style={{display: record.username === USER ? "none" : "block"}}>
                                <span>激活:</span>
                                <Switch checkedChildren="ON"
                                        unCheckedChildren="OFF"
                                        onChange={this.activeUser}
                                        checked={record["is_active"]}
                                        size={"small"}/>
                            </li>
                            <li style={{display: record.username === USER ? "none" : "block"}}>
                                <span>强制开启MFA:</span>
                                <Switch checkedChildren="ON"
                                        unCheckedChildren="OFF"
                                        onChange={this.fouceOpenMfa}
                                        checked={record["otp_level"] === 2}
                                        size={"small"}/>
                            </li>
                            <li style={{display: record.username === USER ? "none" : "block"}}>
                                <span>重置MFA:</span>
                                <button className="small-button" onClick={this.resetMfa}>重置</button>
                            </li>
                            <li>
                                <span>发送重置<em>密钥</em>邮件:</span>
                                <Popconfirm placement="topLeft"
                                            icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                                            title="用户当前密钥将失效，并发送重设密码邮件到用户邮箱,确定要这么做吗？"
                                            onConfirm={this.updateKeyByEmail}
                                            okText="确定"
                                            cancelText="取消">
                                    <button className="small-button">发送</button>
                                </Popconfirm>
                            </li>
                        </ul>
                    </div>
                    <div className="displayflexstart">
                        <h4>添加用户组 : &nbsp;&nbsp;&nbsp;</h4>
                        <Select mode="tags"
                                size="default"
                                className="multipleSelection"
                                value={groups}
                                onChange={(value) => this.handleSelectChange(value, "groups")}>
                            {createOptions(selectOptions)}
                        </Select>
                        <button className="small-button" onClick={this.addSeletedItem}>保存</button>
                    </div>
                    <br/>
                    <div className="displayflexstart">
                        {
                            groups_display.map((item, index) =>
                                <Tag key={index} color="#108ee9">{item}</Tag>
                            )
                        }
                    </div>
                    <br/>
                </TabPane>
            </Tabs>
        )
    }
}
