import React, {Component} from 'react';
import {Checkbox, Input, message} from 'antd';
import {fetchDatas, postDatas} from "../../common/apiManager";

class LdapSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_class: "LDAPSettingForm",
            AUTH_LDAP_SERVER_URI: "", //
            AUTH_LDAP_BIND_DN: "", //  LDAP地址
            AUTH_LDAP_BIND_PASSWORD: "",//
            AUTH_LDAP_SEARCH_OU: "",//
            AUTH_LDAP_SEARCH_FILTER: "",//
            AUTH_LDAP_USER_ATTR_MAP: "",//
            AUTH_LDAP: false, //
        }
    }

    componentWillMount() {
        this.setDefaule();
    }

    /**设置默认值**/
    setDefaule = () => {
        // ?form_class=LDAPSettingForm
        fetchDatas(`/settings/v1/settings/`, result => {
            let objectList = {};
            result.map(item => {
                objectList[item.name] = item.value;
            });
            this.setState({
                AUTH_LDAP_SERVER_URI: objectList.AUTH_LDAP_SERVER_URI,
                AUTH_LDAP_BIND_DN: objectList.AUTH_LDAP_BIND_DN,
                AUTH_LDAP_BIND_PASSWORD: "",
                AUTH_LDAP_SEARCH_OU: objectList.AUTH_LDAP_SEARCH_OU,
                AUTH_LDAP_SEARCH_FILTER: objectList.AUTH_LDAP_SEARCH_FILTER,
                AUTH_LDAP_USER_ATTR_MAP: objectList.AUTH_LDAP_USER_ATTR_MAP,
                AUTH_LDAP: objectList.AUTH_LDAP === "True",
            });
        });
    };

    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {
            form_class,
            AUTH_LDAP_SERVER_URI,
            AUTH_LDAP_BIND_DN,
            AUTH_LDAP_BIND_PASSWORD,
            AUTH_LDAP_SEARCH_OU,
            AUTH_LDAP_SEARCH_FILTER,
            AUTH_LDAP_USER_ATTR_MAP,
            AUTH_LDAP
        } = this.state;
        let data = {
            form_class,
            AUTH_LDAP_SERVER_URI,
            AUTH_LDAP_BIND_DN,
            AUTH_LDAP_BIND_PASSWORD,
            AUTH_LDAP_SEARCH_OU,
            AUTH_LDAP_SEARCH_FILTER,
            AUTH_LDAP_USER_ATTR_MAP,
            AUTH_LDAP
        };
        postDatas("/settings/v1/settings/", data).then((result => {
            if (result) {
                this.setDefaule();
                message.success("修改成功!");
            }
        }))
    };
    /**批量导入**/
    bulkImport = () => {
        message.warning("缺少API，马上就好，敬请期待！")
    };
    /**测试链接**/
    testConnective = () => {
        message.warning("缺少API，马上就好，敬请期待！")
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
    reset = () => {
        this.setState({
            form_class: "LDAPSettingForm",
            AUTH_LDAP_SERVER_URI: "",
            AUTH_LDAP_BIND_DN: "",
            AUTH_LDAP_BIND_PASSWORD: "",
            AUTH_LDAP_SEARCH_OU: "",
            AUTH_LDAP_SEARCH_FILTER: "",
            AUTH_LDAP_USER_ATTR_MAP: "",
            AUTH_LDAP: false
        })
    };

    render() {
        let {
            AUTH_LDAP_SERVER_URI,
            AUTH_LDAP_BIND_DN,
            AUTH_LDAP_BIND_PASSWORD,
            AUTH_LDAP_SEARCH_OU,
            AUTH_LDAP_SEARCH_FILTER,
            AUTH_LDAP_USER_ATTR_MAP,
            AUTH_LDAP
        } = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>LDAP设置</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">LDAP地址</span>
                        <Input name="AUTH_LDAP_SERVER_URI"
                               onChange={this.onInputChange}
                               value={AUTH_LDAP_SERVER_URI}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">绑定DN</span>
                        <Input name="AUTH_LDAP_BIND_DN"
                               onChange={this.onInputChange}
                               value={AUTH_LDAP_BIND_DN}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">密码</span>
                        <Input name="AUTH_LDAP_BIND_PASSWORD"
                               onChange={this.onInputChange}
                               value={AUTH_LDAP_BIND_PASSWORD}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">用户OU</span>
                        <Input name="AUTH_LDAP_SEARCH_OU"
                               onChange={this.onInputChange}
                               value={AUTH_LDAP_SEARCH_OU}/>
                    </div>
                    <p>使用|分隔各OU</p>
                    <div className="displayflexstart">
                        <span className="form_text required">用户过滤器</span>
                        <Input name="AUTH_LDAP_SEARCH_FILTER"
                               onChange={this.onInputChange}
                               value={AUTH_LDAP_SEARCH_FILTER}/>
                    </div>
                    <p>可能的选项是(cn或uid或sAMAccountName=%(user)s)</p>
                    <div className="displayflexstart">
                        <span className="form_text required">LDAP属性映射</span>
                        <textarea name="AUTH_LDAP_USER_ATTR_MAP"
                                  onChange={this.onInputChange}
                                  value={AUTH_LDAP_USER_ATTR_MAP}/>
                    </div>
                    <p>用户属性映射代表怎样将LDAP中用户属性映射到jumpserver用户上，username, name,email 是jumpserver的属性</p>
                    <div className="displayflexstart">
                        <span className="form_text"> 启用LDAP认证</span>&nbsp;&nbsp;&nbsp;
                        <Checkbox name="AUTH_LDAP" onChange={this.onCheckBoxChange} checked={AUTH_LDAP}/>
                    </div>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.bulkImport}>Bulk import</button>
                    <button onClick={this.testConnective}>测试链接</button>
                    <button onClick={this.reset}>重置</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}

export default LdapSetting;
