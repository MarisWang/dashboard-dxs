import React from 'react';
import {message, Select, Tabs, Tag,} from 'antd';
import {getUserGroupSelectOptions, getUserSelectOptions, patchDatas, fetchDatas} from "../../../common/apiManager";
import {createOptions} from "../../../common/common";

const TabPane = Tabs.TabPane;

export default class CommandFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOptions: [],
            users: [],
            groupSelectOptions: [],
            user_groups: [],
        };
    }

    componentDidMount() {
        this.getSelectOptions();
        this.setState({
            users: this.props.record.users,
            user_groups: this.props.record.user_groups
        })
    }

    /**获得下拉选项和标签项**/
    getSelectOptions = () => {
        getUserSelectOptions(selectOptions => {
            this.setState({
                selectOptions
            });
        });
        getUserGroupSelectOptions(groupSelectOptions => {
            this.setState({
                groupSelectOptions
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
        let data = {users: this.state.users};
        patchDatas(`/assets/v1/cmd-filter/${id}/`, data).then((result => {
            if (result && result instanceof Object) {
                this.props.reloadData();
                message.success("修改成功!");
            }
        }));
    };

    /**添加选中项目**/
    addGroupSeletedItem = () => {
        let {id} = this.props.record;
        let data = {user_groups: this.state.user_groups};
        patchDatas(`/assets/v1/cmd-filter/${id}/`, data).then((result => {
            if (result && result instanceof Object) {
                this.props.reloadData();
                message.success("修改成功!");
            }
        }));
    };

    render() {
        let {users, selectOptions, user_groups, groupSelectOptions} = this.state;
        let {record} = this.props;
        let users_display = record["users_display"] === "" ? [] : record["users_display"].split(",");
        let user_groups_display = record["user_groups_display"] === "" ? [] : record["user_groups_display"].split(",");
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                    <TabPane tab="详情" key="1">
                        <div className="displayflexstart">
                            <h4>添加用户 : &nbsp;&nbsp;&nbsp;</h4>
                            <Select mode="tags"
                                    size="default"
                                    className="multipleSelection"
                                    value={users}
                                    onChange={(value) => this.handleSelectChange(value, "users")}>
                                {createOptions(selectOptions)}
                            </Select>
                            <button className="small-button" onClick={this.addSeletedItem}>保存</button>
                        </div>
                        <br/>
                        <div className="displayflexstart">
                            {
                                users_display.map((item, index) =>
                                    <Tag key={index} color="#108ee9">{item}</Tag>
                                )
                            }
                        </div>
                        <br/>
                        <div className="displayflexstart">
                            <h4>添加用组 : &nbsp;&nbsp;&nbsp;</h4>
                            <Select mode="tags"
                                    size="default"
                                    className="multipleSelection"
                                    value={user_groups}
                                    onChange={(value) => this.handleSelectChange(value, "user_groups")}>
                                {createOptions(groupSelectOptions)}
                            </Select>
                            <button className="small-button" onClick={this.addGroupSeletedItem}>保存</button>
                        </div>
                        <br/>
                        <div className="displayflexstart">
                            {
                                user_groups_display.map((item, index) =>
                                    <Tag key={index} color="#108ee9">{item}</Tag>
                                )
                            }
                        </div>
                        <br/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
