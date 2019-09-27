import React from 'react';
import {message, Select, Spin} from 'antd';
import {
    postDatas, getUserSelectOptions, getTaskTypeSelectOptions, getAssetsSelectOptions, getNodesSelectOptions,
    getLabelsSelectOptions, getSystemUsersSelectOptions, getServiceUsersSelectOptions,
} from "../../../common/apiManager";
import Config from "../../../config/config";
import {checkEmptyInput, createOptions,} from "../../../common/common";

export default class BulkTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task_type: "switch_network", //switch_network
            assets: [],
            nodes: [],
            labels: [],
            users: [],
            commands: "",
            comment: "",
            file_path: "/tmp/",
            ipset: "",
            from_page: "bulktasks",
            system_users: [],
            service_users: [],
            fileName: "选择文件",

            taskTypeLists: [],
            assetLists: [],
            nodesLists: [],
            labelLists: [],
            userLists: [],
            systemUserLists: [],
            serviceUserLists: [],
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

    /**获取下拉框选项**/
    getSelectOptions = () => {
        /**任务类型**/
        getTaskTypeSelectOptions(taskTypeLists =>
            this.setState({
                taskTypeLists,
            })
        );
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
        /**标签**/
        getLabelsSelectOptions(labelLists =>
            this.setState({
                labelLists,
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
        /**用户**/
        getUserSelectOptions(userLists =>
            this.setState({
                userLists,
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
        let {task_type, assets, labels, users, nodes, comment, system_users, service_users} = this.state;
        let requiredObject = {task_type, assets, comment};
        let ele = document.forms.namedItem("fileinfo");
        let formData = new FormData(ele);
        formData.append(" from_page", "bulktasks");
        formData.append("task_type", task_type);
        formData.append("assets", assets);

        let ArrList = {nodes, labels, users, system_users, service_users};
        for (let item in ArrList) {
            if (ArrList[item].length > 0) {
                formData.append(item, ArrList[item])
            } else {
                formData.delete(item)
            }
        }
        if (checkEmptyInput(requiredObject)) {
            postDatas(`/assets/v1/bulktask/`, formData).then((result => {
                if (task_type === "switch_network" && result.msg === "成功") {
                    this.setDefault();
                    message.success("网路切换成功!");
                } else {
                    this.setDefault();
                    window.open(`${Config.api}/ops/celery/task/${result["task_id"]}/log/`, '测试可链接性', 'height=500, width=800');
                }
            }))
        }
    };


    /**设置默认值**/
    setDefault = () => {
        this.setState({
            task_type: "switch_network", //switch_network
            assets: [],
            nodes: [],
            labels: [],
            users: [],
            commands: "",
            comment: "",
            file_path: "/tmp/",
            ipset: "",
            from_page: "bulktasks",
            system_users: [],
            service_users: [],
            fileName: "选择文件",
        })
    };
    typeOnSelect = () => {
        this.setState({fileName: "选择文件"})
    };
    /**选择文件**/
    chooseFile = () => {
        let val = document.getElementById("bulkTaskFile");
        this.setState({
            fileName: val.files[0].name
        });
    };

    render() {
        let {
            task_type, assets, labels, users, commands, nodes, comment, file_path, system_users, service_users,
            taskTypeLists, assetLists, nodesLists, labelLists, userLists, systemUserLists, serviceUserLists, fileName
        } = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="wrapper">
                    <form className="create_form" action="" onSubmit={(e) => this.submitForm(e)} name="fileinfo">
                        <div className="from_container">
                            <h4>目标主机</h4>
                            <div className="displayflexstart">
                                <span className="form_text required">Task type</span>
                                <Select size="default"
                                        value={task_type}
                                        onSelect={this.typeOnSelect}
                                        onChange={(value) => this.handleSelectChange(value, "task_type")}>
                                    {createOptions(taskTypeLists)}
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
                            {/*执行命令*/}
                            {
                                task_type === "commands" ?
                                    <div className="displayflexstart">
                                        <span className="form_text required">命令记录</span>
                                        <textarea name="commands" value={commands} onChange={this.onInputChange}/>
                                    </div>
                                    : null
                            }
                            {/*执行脚本  上传文件*/}
                            {
                                task_type === "scripts" || task_type === "uploadfiles" ?
                                    <div className="displayflexstart" id="uploadfiles">
                                        <span className="form_text">{task_type === "scripts" ? "脚本" : "上传文件"} </span>
                                        &nbsp;&nbsp;
                                        <div className="file">{fileName}
                                            <input type="file"
                                                   id="bulkTaskFile"
                                                   name={task_type === "scripts" ? "scripts" : "uploadfiles"}
                                                   onChange={this.chooseFile}/>
                                        </div>
                                    </div>
                                    : null
                            }

                            {/*推送系统用户  更改密码*/}
                            {
                                task_type === "system_users" || task_type === "change_passwd" ?
                                    <div className="displayflexstart">
                                        <span className="form_text required">系统用户</span>
                                        <Select mode="tags"
                                                size="default"
                                                value={system_users}
                                                onChange={(value) => this.handleSelectChange(value, "system_users")}>
                                            {createOptions(systemUserLists)}
                                        </Select>
                                    </div>
                                    : null
                            }
                            {/*推送服务用户*/}
                            {
                                task_type === "service_users" ?
                                    <div className="displayflexstart">
                                        <span className="form_text required">服务用户</span>
                                        <Select mode="tags"
                                                size="default"
                                                value={service_users}
                                                onChange={(value) => this.handleSelectChange(value, "service_users")}>
                                            {createOptions(serviceUserLists)}
                                        </Select>
                                    </div>
                                    : null
                            }
                            {/*上传文件 下载文件*/}
                            {
                                task_type === "uploadfiles" || task_type === "downloadfiles" ?
                                    <div>
                                        <div className="displayflexstart">
                                            <span className="form_text">文件路径</span>
                                            <textarea name="file_path"
                                                      value={file_path}
                                                      onChange={this.onInputChange}/>
                                        </div>
                                        <p>请不要在此传输过大的文件，大文件传输请使用xftp</p>
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
                    </form>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.setDefault}>重置</button>
                    <button onClick={this.submitForm}>提交</button>
                </div>
            </Spin>
        );
    }
}