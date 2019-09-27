import React from 'react';
import {message, Select, Switch, Tabs, Tag,} from 'antd';
import {patchDatas, fetchDatas} from "../../../common/apiManager";
import {createOptions} from "../../../common/common";

const {TabPane} = Tabs;

export default class AdminAuthorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOptions: [],
            system_users: [],
        };
    }

    componentDidMount() {
        this.getSelectOptions();
        this.setState({
            system_users: this.props.record.system_users
        })
    }

    /**下拉选项**/
    getSelectOptions = () => {
        let userId = JSON.parse(localStorage.getItem("Auth")).user.userid;
        fetchDatas(`/perms/v1/user-permissions/detail/${userId}/`, result => {
            if (result && result instanceof Object) {
                this.setState({
                    selectOptions: result["perm_system_users"],
                });
            }
        })
    };
    /**激活**/
    activePerms = (checked) => {
        let data = {is_active: checked};
        patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/`, data).then((result => {
            if (checked) {
                message.success("已经激活！")
            } else {
                message.success("已经取消激活！")
            }
        }))
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
        let data = {system_users: this.state.system_users};
        patchDatas(`/perms/v1/asset-permissions/${id}/`, data).then((result => {
            if (result && result instanceof Object) {
                this.props.reloadData();
                message.success("修改成功!");
            }
        }));
    };

    render() {
        let {record} = this.props;
        let {selectOptions, system_users,} = this.state;
        let system_users_display = record["system_users_display"] === "" ? [] : record["system_users_display"].split(",");
        return (
            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                <TabPane tab="详情" key="1">
                    <ul className="displayflexbetween detailList">
                        <li><span>动作: </span>{record["actions"]}</li>
                        <li><span>备注: </span>{record["comment"]}</li>
                        <li><span>开始日期:</span>{record["date_start"]}</li>
                        <li><span>失效日期:</span> {record["date_expired"]}</li>
                        <li><span>创建日期:</span>{record["date_created"]}</li>
                        <li>
                            <span>激活中:</span>
                            <Switch checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                    onChange={this.activePerms}
                                    checked={record["is_active"]}
                                    size={"small"}/>
                        </li>
                    </ul>
                    <div className="displayflexstart hrBuleLine">
                        <h4>添加系统用户 : &nbsp;&nbsp;&nbsp;</h4>
                        <Select mode="tags"
                                size="default"
                                className="multipleSelection"
                                value={system_users}
                                onChange={(value) => this.handleSelectChange(value, "system_users")}>
                            {createOptions(selectOptions)}
                        </Select>
                        <button className="small-button" onClick={this.addSeletedItem}>保存</button>
                    </div>
                    <br/>
                    <div className="displayflexstart">
                        {
                            system_users_display.map((item, index) =>
                                <Tag key={index} color="#108ee9">{item}</Tag>
                            )
                        }
                    </div>
                    <br/>
                </TabPane>
            </Tabs>
        );
    }
}
