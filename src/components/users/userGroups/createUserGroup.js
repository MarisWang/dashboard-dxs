import React, {Component} from 'react';
import {Input, message, Select, Spin} from "antd";
import {checkEmptyInput, createOptions, deleteNullObject} from "../../../common/common";
import {
    fetchDatas,
    postDatas,
    patchDatas,
    getUserSelectOptions,
    getGroupAdminSelectOptions
} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            managers_display: [],//显示的id
            users_display: [],
            comment: "",
            usersLists: [],
            groupLists: [],
            pageloading: true
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
        fetchDatas(`/users/v1/groups/${record}/?display=1/`, result => {
            let userObj = [];
            result["users_display"].map((item) => {
                userObj.push({
                    key: item.id,
                    label: item.name,
                })
            });
            result.users_display = userObj;

            let groupObj = [];
            result["managers_display"].map((item) => {
                groupObj.push({
                    key: item.id,
                    label: item.name,
                })
            });
            result.managers_display = groupObj;
            this.setState(result);
        });
    };
    /**获取下拉选项的值**/
    getSelectOptions = () => {
        getUserSelectOptions(usersLists =>
            this.setState({
                usersLists,
            }),
        );
        getGroupAdminSelectOptions(groupLists =>
            this.setState({
                groupLists,
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
    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name, managers_display, comment, users_display} = this.state;
        let users = [];
        users_display.map((item) => {
            users.push(item.key)
        });
        let managers = [];
        managers_display.map((item) => {
            managers.push(item.key)
        });
        let requiredObject = {name, users};
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                let data = {name, managers, comment, users};
                patchDatas(`/users/v1/groups/${record}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                let data = deleteNullObject({name, managers, comment, users});
                postDatas("/users/v1/groups/", data).then((result => {
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
        let {name, managers_display, comment, users_display, usersLists, groupLists} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>用户组</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name" value={name} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">组长</span>
                            <Select mode="tags"
                                    labelInValue
                                    size="default"
                                    value={managers_display}
                                    onChange={(value) => this.handleSelectChange(value, "managers_display")}>
                                {createOptions(groupLists)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">用户</span>
                            <Select mode="tags"
                                    labelInValue
                                    size="default"
                                    value={users_display}
                                    onChange={(value) => this.handleSelectChange(value, "users_display")}>
                                {createOptions(usersLists)}
                            </Select>
                        </div>
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