import React, {Component} from 'react';
import {Input, Select, Checkbox, message, Spin} from "antd";
import {
    getNavSelectOptions,
    getUserSelectOptions,
    postDatas,
    getRoleSelectOptions,
    fetchDatas, patchDatas
} from "../../../common/apiManager";
import {checkEmptyInput, checkInteger, createOptions} from "../../../common/common";

const levelList = [
    {id: "1", name: "一级目录",},
    {id: "2", name: "二级目录"},
    {id: "3", name: "三级目录"},
];

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parent: "",
            name: "",
            html_id: "",
            level: [],
            enabled:false,
            sort: '',
            href: '',
            users: [],
            roles: [],
            i_css: "",
            span_css: "",
            userLists: [],
            rolesLists: [],
            parentLists: [],
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

    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/navbars/v1/navbars/${record.id}/`, result => {
            let rolesArr = [];
            for (let i in result["roles"]) {
                rolesArr.push(result["roles"][i].toString());
            }
            this.setState({
                name: result["name"],
                parent: result["parent"],
                html_id: result["html_id"],
                level: result["level"],
                enabled: result["enabled"],
                sort: result["sort"],
                href: result["href"],
                users: result["users"],
                roles: rolesArr,
                i_css: result["i_css"],
                span_css: result["span_css"],
            });
        });
    };

    getSelectOptions = () => {
        /**导航**/
        getNavSelectOptions(parentLists =>
            this.setState({
                parentLists,
            }),
        );
        /**用户**/
        getUserSelectOptions(userLists =>
            this.setState({
                userLists,
            }),
        );
        /**角色**/
        getRoleSelectOptions(rolesLists =>
            this.setState({
                rolesLists,
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
    submitForm = (e) => {
        e.preventDefault();
        let {edit,record}=this.props;
        let {name, html_id, enabled, sort, href, users, roles,} = this.state;
        let requiredObject = {name, html_id,sort, href, users, roles};
        let data = {name, html_id, enabled, sort, href, users, roles,};
        if (checkEmptyInput(requiredObject)) {
            checkInteger("Sort", sort);
            if(edit){
                patchDatas(`/navbars/v1/navbars/${record.id}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("编辑成功!");
                        this.props.onCancel();
                    }
                }))
            } else{
                postDatas(`/navbars/v1/navbars/`, data).then((result => {
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
        let {parent, name, html_id, enabled, sort, href, users,level, roles, i_css, span_css, userLists, rolesLists, parentLists,} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <div className="displayflexstart">
                            <span className="form_text">父目录</span>
                            <Select size="default"
                                    value={parent}
                                    onChange={(value) => this.handleSelectChange(value, "parent")}>
                                {createOptions(parentLists)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name" value={name} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">Html ID</span>
                            <Input name="html_id" value={html_id} onChange={this.onInputChange}/>
                        </div>

                        <div className="displayflexstart">
                            <span className="form_text">目录层级</span>
                            <Select size="default"
                                    value={level}
                                    onChange={(value) => this.handleSelectChange(value, "level")}>
                                {createOptions(levelList)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text"> </span>
                            <Checkbox onChange={this.onCheckBoxChange} checked={enabled}>启用</Checkbox>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">排序</span>
                            <Input name="sort" value={sort} type="number" onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">链接</span>
                            <Input name="href" value={href} onChange={this.onInputChange}/>
                        </div>

                        <div className="displayflexstart">
                            <span className="form_text required">用户</span>
                            <Select mode="tags"
                                    size="default"
                                    value={users}
                                    onChange={(value) => this.handleSelectChange(value, "users")}>
                                {createOptions(userLists)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">角色</span>
                            <Select mode="tags"
                                    size="default"
                                    value={roles}
                                    onChange={(value) => this.handleSelectChange(value, "roles")}>
                                {createOptions(rolesLists)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">导航图标样式</span>
                            <Input name="i_css" value={i_css} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">下拉图标样式</span>
                            <Input name="span_css" value={span_css} onChange={this.onInputChange}/>
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