import React, {Component} from 'react';
import {Input, Select, Checkbox, message, Spin} from "antd";
import {checkEmptyInput, createOptions, checkInteger} from "../../../common/common";
import {
    fetchDatas,
    postDatas,
    patchDatas,
    getUserSelectOptions,
    getRoleSelectOptions,
} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            html_id: "",
            enabled: false,
            sort: [],
            href: "",
            users: [],
            roles: [],
            userList: [],
            roleList: [],
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

    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/dashboards/v1/dashboards/${record.id}/`, result => {
            let arr = [];
            result.roles.map((item)=>{
                arr.push(item.toString());
            });
            this.setState({
                name: result["name"],
                html_id: result["html_id"],
                enabled: result["enabled"],
                sort: result["sort"],
                href: result["href"],
                users: result["users"],
                roles:arr,
            });
        });
    };

    /**获取下拉列表选项**/
    getSelectOptions = () => {
        /**用户**/
        getUserSelectOptions(userList =>
            this.setState({
                userList,
            }),
        );
        /**角色**/
        getRoleSelectOptions(roleList =>
            this.setState({
                roleList,
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
    /**监控复选框事件**/
    onCheckBoxChange = (e) => {
        this.setState({
            enabled: e.target.checked
        });
    };
    /**提交表单**/
    submitForm = (e) => {
        e.preventDefault();
        let {edit,record}=this.props;
        let {name, html_id, enabled, sort, href, users, roles,} = this.state;
        let requiredObject = {name, html_id, sort,users, roles,};
        let data = {name, html_id, enabled, sort, href, users, roles};
        if (checkEmptyInput(requiredObject)) {
            checkInteger("Sort", sort);
            if(edit){
                patchDatas(`/dashboards/v1/dashboards/${record.id}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("编辑成功!");
                        this.props.onCancel();
                    }
                }))
            } else{
                postDatas("/dashboards/v1/dashboards/", data).then((result => {
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
        let {name, html_id, enabled, sort, href, users, roles, userList, roleList} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name"
                                   value={name}
                                   onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">Html ID</span>
                            <Input name="html_id" value={html_id} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text"> </span>
                            <Checkbox onChange={this.onCheckBoxChange} checked={enabled}>启用</Checkbox>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">排序</span>
                            <Input name="sort" type="number"
                                   value={sort} onChange={this.onInputChange} minLength={0}
                                   maxLength={65535}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">链接</span>
                            <Input name="href" value={href} onChange={this.onInputChange}/>
                        </div>

                        <div className="displayflexstart">
                            <span className="form_text required">用户</span>
                            <Select mode="tags"
                                    size="default"
                                    value={users}
                                    onChange={(value) => this.handleSelectChange(value, "users")}>
                                {createOptions(userList)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">角色</span>
                            <Select mode="tags"
                                    size="default"
                                    value={roles}
                                    onChange={(value) => this.handleSelectChange(value, "roles")}>
                                {createOptions(roleList)}
                            </Select>
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