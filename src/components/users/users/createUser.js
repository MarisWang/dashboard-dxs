import React, {Component} from 'react';
import moment from 'moment';
import {Input, DatePicker, Radio, Select, message, Spin, Tree, Checkbox} from "antd";
import ReactPasswordStrength from 'react-password-strength';
import {checkEmptyInput, createOptions, deleteNullObject} from "../../../common/common";
import {dashboardList, navList} from "../../../common/jsondata";
import {
    getUserGroupSelectOptions,
    postDatas,
    getRoleSelectOptions,
    fetchDatas,
    patchDatas
} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            email: "",
            groups: [],
            password_strategy: false,
            password: "",
            otp_level: 0,
            role: "4",
            date_expired: "2100-01-10 08:00:00 +0800",
            wechat: "",
            phone: "",
            comment: "",
            userGroupLists: [],
            roleLists: [],
            pageloading: true,

            navbars: [],
            dashboradCheckedKeys: [],

            navBarList: []
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
        }, 1000);
    }

    /**设置默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/users/v1/users/${record.id}`, result => {
            result.role = result.role.toString(); //重要，传过来的是数字，必须转成字符串，否则下拉列表不能正常显示
            result.navbars.map((item) => {
                navList.map((obj) => {
                    if (obj.value === item.toString()) {
                        obj.checked = true
                    } else {
                        if (obj.children) {
                            obj.children.map((kid) => {
                                if (kid.value === item.toString()) {
                                    kid.checked = true
                                }
                            })
                        }
                    }
                });
                result.navBarList = navList;
            });
            this.setState(result);
        });
    };


    /**下拉选项**/
    getSelectOptions = () => {
        getRoleSelectOptions(roleLists =>
            this.setState({
                roleLists,
            }),
        );
        getUserGroupSelectOptions(userGroupLists =>
            this.setState({
                userGroupLists,
            }),
        );
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    onDateChange = (value, dataString) => {
        this.setState({
            date_expired: `${dataString} +0800`
        })
    };
    /**监控select**/
    handleSelectChange = (value, name) => {
        this.setState({
            [name]: value
        });
    };
    submitForm = (e) => {
        e.preventDefault();
        let {record, edit} = this.props;
        let {name, username, email, groups, password_strategy, password, otp_level, role, date_expired, wechat, phone, comment} = this.state;
        let requiredObject = {};
        if (password_strategy) {
            password_strategy = "0";
            requiredObject = {name, username, email};
        } else {
            password_strategy = "1";
            requiredObject = edit ? {name, username, email} : {name, username, email, password};
        }
        if (checkEmptyInput(requiredObject)) {
            let data = deleteNullObject({
                name,
                username,
                email,
                groups,
                password_strategy,
                password,
                otp_level,
                role,
                date_expired,
                wechat,
                phone,
                comment,
            });
            if (edit) {
                patchDatas(`/users/v1/users/${record.id}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/users/v1/users/", data).then((result => {
                    if (result && result instanceof Object) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
    };
    /**密码安全等级**/
    changeCallback = pass => {
        this.setState({password: pass.password});
    };
    onChange = (e) => {

    };

    render() {
        let {edit} = this.props;
        let {
            name, username, email, role, groups, password_strategy, otp_level,
            date_expired, wechat, phone, comment, userGroupLists, roleLists, navBarList
        } = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>账户</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name" value={name} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">用户名</span>
                            <Input name="username" value={username} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">邮件</span>
                            <Input name="email" value={email} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">用户组</span>
                            <Select mode="tags"
                                    size="default"
                                    value={groups}
                                    onChange={(value) => this.handleSelectChange(value, "groups")}>
                                {createOptions(userGroupLists)}
                            </Select>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>认证 </h4>
                        <div className="displayflexstart">
                            <span className="form_text">密码策略</span>
                            <Radio.Group onChange={this.onInputChange} value={password_strategy}
                                         name="password_strategy" disabled={true}>
                                <Radio value={true}>Reset link will be generated and sent to the user</Radio>
                                <Radio value={false}>Set password</Radio>
                            </Radio.Group>
                        </div>
                        {
                            !password_strategy ? <div className="displayflexstart">
                                {
                                    !edit ? <span className="form_text required">密码</span>
                                        : <span className="form_text">密码</span>
                                }

                                <ReactPasswordStrength
                                    className="customClass"
                                    minLength={5}
                                    minScore={2}
                                    name="password"
                                    changeCallback={this.changeCallback}
                                    inputProps={{name: "password", autoComplete: "new-password"}}
                                    onChange={this.onInputChange}/>
                            </div> : null
                        }
                        <div className="displayflexstart">
                            <span className="form_text">MFA</span>
                            <Radio.Group onChange={this.onInputChange} value={otp_level} name="otp_level">
                                <Radio value={0}>禁用</Radio>
                                <Radio value={1}>启用</Radio>
                                <Radio value={2}>强制启用</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>角色安全</h4>
                        <div className="displayflexstart">
                            <span className="form_text">角色</span>
                            <Select size="default"
                                    value={role}
                                    onChange={(value) => this.handleSelectChange(value, "role")}>
                                {createOptions(roleLists)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">失效日期</span>
                            <DatePicker showTime
                                        value={moment(date_expired, 'YYYY/MM/DD h:mm:ss')}
                                        onChange={this.onDateChange}/>
                        </div>
                    </div>
                    <div className="from_container">
                        <h4>个人信息 </h4>
                        <div className="displayflexstart">
                            <span className="form_text">手机</span>
                            <Input name="phone"
                                   value={phone}
                                   onChange={this.onInputChange} minLength={1}
                                   maxLength={128}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">微信</span>
                            <Input name="wechat"
                                   value={wechat}
                                   onChange={this.onInputChange} minLength={1}
                                   maxLength={128}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">备注</span>
                            <textarea name="comment"
                                      value={comment}
                                      onChange={this.onInputChange}/>
                        </div>
                    </div>
                    {/*{*/}
                    {/*    edit ?*/}
                    {/*        <div className="from_container">*/}
                    {/*            <h4>菜单选项</h4>*/}
                    {/*            <div className="displayflexstart">*/}
                    {/*                <span className="form_text">导航栏</span>*/}
                    {/*                {*/}
                    {/*                    navBarList.map((item, index) =>*/}
                    {/*                        <div key={index}*/}
                    {/*                             style={{width: "100%", textAlign: "left", lineHeight: "20px"}}>*/}
                    {/*                            <span style={{width: "175px"}}/>*/}
                    {/*                            <Checkbox name={item.value}*/}
                    {/*                                      checked={item.checked}*/}
                    {/*                                      onChange={this.onChange}>{item.label}</Checkbox>*/}
                    {/*                            <div className="displayflexstart">*/}
                    {/*                                <span style={{width: "225px"}}/>*/}
                    {/*                                {*/}
                    {/*                                    item.children ?*/}
                    {/*                                        item.children.map((kids, kind) =>*/}
                    {/*                                            <Checkbox name={kids.value}*/}
                    {/*                                                      key={kind}*/}
                    {/*                                                      checked={kids.checked}*/}
                    {/*                                                      onChange={this.onChange}>{kids.label}</Checkbox>*/}
                    {/*                                        )*/}
                    {/*                                        : null*/}
                    {/*                                }*/}
                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    )*/}
                    {/*                }*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        : null*/}
                    {/*}*/}

                    {/*{*/}
                    {/*    edit ?*/}
                    {/*        <div className="from_container">*/}
                    {/*            <h4>仪表盘选项</h4>*/}
                    {/*            <div className="displayflexstart alignItemStart">*/}
                    {/*                <span className="form_text">仪表盘</span>*/}
                    {/*                {*/}
                    {/*                    dashboardList.map((item, index) =>*/}
                    {/*                        <div key={index}*/}
                    {/*                             style={{width: "100%", textAlign: "left", lineHeight: "30px"}}>*/}
                    {/*                            <span style={{width: "175px"}}/>*/}
                    {/*                            <Checkbox name={item.value}*/}
                    {/*                                      checked={item.checked}*/}
                    {/*                                      onChange={this.onChange}>{item.label}</Checkbox>*/}
                    {/*                        </div>*/}
                    {/*                    )*/}
                    {/*                }*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        : null*/}
                    {/*}*/}

                    <div className="form-btns displayflexend">
                        <button onClick={this.props.onCancel}>取消</button>
                        <button onClick={(e) => this.submitForm(e)}>提交</button>
                    </div>
                </div>
            </Spin>
        );
    }
}
