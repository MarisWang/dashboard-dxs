import React, {Component} from 'react';
import {Checkbox, Icon, Input, message, Popconfirm, Select, Spin, Table,} from 'antd';
import {checkEmptyInput, createOptions} from "../../common/common";
import {
    postDatas,
    fetchDatas,
    getReplyStoragesSelectOptions,
    getComdStoragesSelectOptions,
} from "../../common/apiManager";
import {listSortBy, listPageSize} from "../../common/jsondata";
import CreateComponent from "../../common/creator";
import {tableConfig} from "../../common/tableHeader";

class TerminalSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_class: "TerminalSettingForm",
            TERMINAL_PASSWORD_AUTH: false,
            TERMINAL_PUBLIC_KEY_AUTH: false,
            TERMINAL_HEARTBEAT_INTERVAL: 0,
            TERMINAL_ASSET_LIST_SORT_BY: "",
            TERMINAL_ASSET_LIST_PAGE_SIZE: "",
            TERMINAL_SESSION_KEEP_DURATION: 0,
            TERMINAL_TELNET_REGEX: "",
            DEFAULT_TERMINAL_COMMAND_STORAGE: [],
            DEFAULT_TERMINAL_REPLAY_STORAGE: [],
            editing: false,
            pageloading: true,
        };
        this.columnsCommand = [
            {
                title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
                    return (index + 1)
                }
            },
            {title: '名称', dataIndex: 'name'},
            {title: '类型', dataIndex: 'type'},
            {
                title: '动作', width: "120px", dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <Popconfirm title="确定删除吗?"
                                    onConfirm={() => this.handleDelete(record, `/settings/v1/terminal/command-storage/delete/`)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                    );
                }
            }
        ];
        this.columnsReplay = [
            {
                title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
                    return (index + 1)
                }
            },
            {title: '名称', dataIndex: 'name'},
            {title: '类型', dataIndex: 'type'},
            {
                title: '动作', width: "120px", dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <Popconfirm title="确定删除吗?"
                                    onConfirm={() => this.handleDelete(record, `/settings/v1/terminal/replay-storage/delete/`)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                    );
                }
            }
        ];
    }

    componentWillMount() {
        this.getSelectOptions();
        this.getDefaultValue();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }

    /**获取下拉框选项**/
    getSelectOptions = () => {
        /**command-storages**/
        getComdStoragesSelectOptions(commandList =>
            this.setState({
                DEFAULT_TERMINAL_COMMAND_STORAGE: commandList
            })
        );
        /**replay-storage**/
        getReplyStoragesSelectOptions(commandList =>
            this.setState({
                DEFAULT_TERMINAL_REPLAY_STORAGE: commandList
            }),
        );
    };
    /**获得默认值**/
    getDefaultValue = () => {
        // ?form_class=TerminalSettingForm
        fetchDatas(`/settings/v1/settings/`, result => {
            let objectList = {};
            result.map((item) => {
                objectList[item.name] = item.value;
            });
            this.setState({
                TERMINAL_PASSWORD_AUTH: objectList.TERMINAL_PASSWORD_AUTH === "True",
                TERMINAL_PUBLIC_KEY_AUTH: objectList.TERMINAL_PUBLIC_KEY_AUTH === "True",
                TERMINAL_HEARTBEAT_INTERVAL: objectList.TERMINAL_HEARTBEAT_INTERVAL,
                TERMINAL_ASSET_LIST_SORT_BY: objectList.TERMINAL_ASSET_LIST_SORT_BY,
                TERMINAL_ASSET_LIST_PAGE_SIZE: objectList.TERMINAL_ASSET_LIST_PAGE_SIZE,
                TERMINAL_SESSION_KEEP_DURATION: objectList.TERMINAL_SESSION_KEEP_DURATION,
                TERMINAL_TELNET_REGEX: objectList.TERMINAL_TELNET_REGEX,
            });
        });
    };
    /**删除**/
    handleDelete = (record, api) => {
        let data = {name: record.name, type: record.type};
        postDatas(api, data).then((result => {
            if (result) {
                this.getDefaultValue();
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };
    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {
            form_class,
            TERMINAL_PASSWORD_AUTH,
            TERMINAL_PUBLIC_KEY_AUTH,
            TERMINAL_HEARTBEAT_INTERVAL,
            TERMINAL_ASSET_LIST_SORT_BY,
            TERMINAL_ASSET_LIST_PAGE_SIZE,
            TERMINAL_SESSION_KEEP_DURATION,
            TERMINAL_TELNET_REGEX
        } = this.state;
        let requiredObject = {
            TERMINAL_HEARTBEAT_INTERVAL,
            TERMINAL_ASSET_LIST_SORT_BY,
            TERMINAL_ASSET_LIST_PAGE_SIZE,
            TERMINAL_SESSION_KEEP_DURATION
        };
        let data = {
            form_class,
            TERMINAL_PASSWORD_AUTH,
            TERMINAL_PUBLIC_KEY_AUTH,
            TERMINAL_HEARTBEAT_INTERVAL,
            TERMINAL_ASSET_LIST_SORT_BY,
            TERMINAL_ASSET_LIST_PAGE_SIZE,
            TERMINAL_SESSION_KEEP_DURATION,
            TERMINAL_TELNET_REGEX
        };
        if (checkEmptyInput(requiredObject)) {
            postDatas("/settings/v1/settings/", data).then((result => {
                if (result) {
                    this.getDefaultValue();
                    message.success("修改成功!");
                }
            }))
        }
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
    /**监控复选框事件**/
    onCheckBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.checked
        });
    };
    reloadData = () => {
        this.getDefaultValue();
    };
    reset = () => {
        this.setState({
            form_class: "TerminalSettingForm",
            TERMINAL_PASSWORD_AUTH: false,
            TERMINAL_PUBLIC_KEY_AUTH: false,
            TERMINAL_HEARTBEAT_INTERVAL: 0,
            TERMINAL_ASSET_LIST_SORT_BY: "",
            TERMINAL_ASSET_LIST_PAGE_SIZE: "",
            TERMINAL_SESSION_KEEP_DURATION: 0,
            TERMINAL_TELNET_REGEX: "",
            DEFAULT_TERMINAL_COMMAND_STORAGE: [],
            DEFAULT_TERMINAL_REPLAY_STORAGE: [],
        })
    };

    render() {
        let {
            TERMINAL_PASSWORD_AUTH, TERMINAL_PUBLIC_KEY_AUTH, TERMINAL_HEARTBEAT_INTERVAL, TERMINAL_ASSET_LIST_SORT_BY,
            TERMINAL_ASSET_LIST_PAGE_SIZE, TERMINAL_SESSION_KEEP_DURATION, DEFAULT_TERMINAL_COMMAND_STORAGE,
            DEFAULT_TERMINAL_REPLAY_STORAGE, TERMINAL_TELNET_REGEX
        } = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>终端设置</h4>
                        <div className="displayflexstart">
                            <span className="form_text"> 密码认证</span>&nbsp;&nbsp;&nbsp;
                            <Checkbox onChange={this.onCheckBoxChange} name="TERMINAL_PASSWORD_AUTH"
                                      checked={TERMINAL_PASSWORD_AUTH}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text"> 密钥认证</span>&nbsp;&nbsp;&nbsp;
                            <Checkbox onChange={this.onCheckBoxChange} name="TERMINAL_PUBLIC_KEY_AUTH"
                                      checked={TERMINAL_PUBLIC_KEY_AUTH}/>
                        </div>

                        <div className="displayflexstart">
                            <span className="form_text required">心跳间隔</span>
                            <Input name="TERMINAL_HEARTBEAT_INTERVAL" type="number" onChange={this.onInputChange}
                                   value={TERMINAL_HEARTBEAT_INTERVAL}/>
                        </div>
                        <p>单位:秒</p>
                        <div className="displayflexstart">
                            <span className="form_text required">资产列表排序</span>
                            <Select size="default"
                                    value={TERMINAL_ASSET_LIST_SORT_BY}
                                    name="TERMINAL_ASSET_LIST_SORT_BY"
                                    onChange={(value) => this.handleSelectChange(value, "TERMINAL_ASSET_LIST_SORT_BY")}>
                                {createOptions(listSortBy)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">资产分页每页数量</span>
                            <Select size="default"
                                    value={TERMINAL_ASSET_LIST_PAGE_SIZE}
                                    name="TERMINAL_ASSET_LIST_PAGE_SIZE"
                                    onChange={(value) => this.handleSelectChange(value, "TERMINAL_ASSET_LIST_PAGE_SIZE")}>
                                {createOptions(listPageSize)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">会话保留时长</span>
                            <Input name="TERMINAL_SESSION_KEEP_DURATION" onChange={this.onInputChange} type="number"
                                   value={TERMINAL_SESSION_KEEP_DURATION}/>
                        </div>
                        <p>单位：天。 会话、录像、命令记录超过该时长将会被删除(仅影响数据库存储, oss等不受影响)</p>
                        <div className="displayflexstart">
                            <span className="form_text">Telnet成功正则表达式</span>
                            <Input name="TERMINAL_TELNET_REGEX" value={TERMINAL_TELNET_REGEX}
                                   onChange={this.onInputChange}/>
                        </div>
                        <p>登录telnet服务器成功后的提示正则表达式，如: Last\s*login|success|成功</p>
                    </div>
                    <div className="form-btns displayflexend">
                        <button onClick={this.reset}>重置</button>
                        <button onClick={(e) => this.submitForm(e)}>提交</button>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="create_form">
                    <div className="displayflexbetween" style={{alignItems: "flex-start"}}>
                        <div className="from_container settingTerminal">
                            <h4>命令存储</h4>
                            <CreateComponent hasSelected={false}
                                             selectedRowKeys={[]}
                                             reloadData={this.reloadData}
                                             keyWord={"settingTerminalCommand"}
                                             title={"创建命令存储"}/>
                            <Table rowKey="id"
                                   size={tableConfig.size}
                                   scroll={tableConfig.scroll}
                                   pagination={tableConfig.pagination}
                                   bordered={tableConfig.bordered}
                                   dataSource={DEFAULT_TERMINAL_COMMAND_STORAGE}
                                   columns={this.columnsCommand}/>
                        </div>
                        <div className="from_container settingTerminal">
                            <h4>录像存储</h4>
                            <CreateComponent hasSelected={false}
                                             selectedRowKeys={[]}
                                             reloadData={this.reloadData}
                                             keyWord={"settingTerminalReplay"}
                                             title={"创建录像存储"}/>
                            <Table rowKey="id"
                                   size={tableConfig.size}
                                   scroll={tableConfig.scroll}
                                   pagination={tableConfig.pagination}
                                   bordered={tableConfig.bordered}
                                   dataSource={DEFAULT_TERMINAL_REPLAY_STORAGE}
                                   columns={this.columnsReplay}/>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}

export default TerminalSetting;
