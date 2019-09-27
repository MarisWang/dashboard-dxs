import React, {Component} from 'react';
import {Input, message, Select, Spin} from "antd";
import {checkEmptyInput, createOptions} from "../../../common/common";
import {
    fetchDatas,
    getComdStoragesSelectOptions,
    getReplyStoragesSelectOptions,
    patchDatas
} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            remote_addr: "",
            command_storage: [],
            replay_storage: [],
            comment: "",
            commandStorageLists: [],
            replayStorageLists: []
        };
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
        fetchDatas(`/terminal/v1/terminal/${record}`, result => {
            result.command_storage = result.command_storage === "" ? [] : result.command_storage.split(",");
            result.replay_storage = result.replay_storage === "" ? [] : result.replay_storage.split(",");
            this.setState(result);
        });
    };
    /**获取下拉选项的值**/
    getSelectOptions = () => {
        /**command-storages**/
        getComdStoragesSelectOptions(commandList => {
            this.setState({
                commandStorageLists: commandList
            });
        });
        /**replay-storage**/
        getReplyStoragesSelectOptions(commandList => {
            this.setState({
                replayStorageLists: commandList
            })
        });
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
        let {name, remote_addr, command_storage, replay_storage, comment} = this.state;
        let requiredObject = {name};
        let data = {name, remote_addr, command_storage, replay_storage, comment};
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                data.command_storage = data.command_storage.toString();
                data.replay_storage = data.replay_storage.toString();
                patchDatas(`/terminal/v1/terminal/${record}/`, data).then((result => {
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
        let {name, remote_addr, command_storage, replay_storage, comment, commandStorageLists, replayStorageLists} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>信息</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name" value={name} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">远端地址</span>
                            <Input name="remote_addr" value={remote_addr} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">命令存储</span>
                            <Select size="default"
                                    value={command_storage}
                                    onChange={(value) => this.handleSelectChange(value, "command_storage")}>
                                {createOptions(commandStorageLists)}
                            </Select>
                        </div>
                        <p>命令支持存储到服务器端数据库、ES中，默认存储的服务器端数据库，更多查看文档</p>
                        <div className="displayflexstart">
                            <span className="form_text required">录像存储</span>
                            <Select size="default"
                                    value={replay_storage}
                                    onChange={(value) => this.handleSelectChange(value, "replay_storage")}>
                                {createOptions(replayStorageLists)}
                            </Select>
                        </div>
                        <p>录像文件支持存储到服务器端硬盘、AWS S3、 阿里云 OSS 中，默认存储到服务器端硬盘, 更多查看文档</p>
                    </div>
                    <div className="from_container">
                        <h4>其他</h4>
                        <div className="displayflexstart">
                            <span className="form_text">备注</span>
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