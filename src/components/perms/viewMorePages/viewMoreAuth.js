import React from 'react';
import {Icon, message, Popconfirm, Select, Spin, Table, Tabs,} from 'antd';
import UserGroups from "./usergroups";
import Assets from "./assets";
import Nodes from "./nodes";
import {fetchDatas, patchDatas} from "../../../common/apiManager";
import {createOptions} from "../../../common/common";
import {tableConfig} from "../../../common/tableHeader";

const TabPane = Tabs.TabPane;

export default class AdminAuthorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            userGruopOptions: [],
            assetListOptions: [],
            nodeLists: [],
            systemUserList: [],
            userListTags: [],
            pageloading: true,
            isLoading: false,
        };
        this.columns = [
            {
                title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
                    return (index + 1)
                }
            },
            {title: '名称', dataIndex: 'name'},
            {title: '用户名', dataIndex: 'text'},
            {
                title: '动作', width: "120px", dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <div>
                            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                                <Icon type="delete" theme="filled"/>
                            </Popconfirm>
                        </div>
                    );
                }
            }
        ]
    }

    componentWillMount() {
        this.getSelectOptions();
        setTimeout(() => {
            this.setState({
                pageloading: false
            })
        }, 500)
    }

    getSelectOptions = () => {
        let userId = JSON.parse(localStorage.getItem("Auth")).user.userid;
        fetchDatas(`/perms/v1/user-permissions/detail/${userId}/`, result => {
            result["perm_assets"].map((item) => {
                item.name = item.ip;
            });
            let {record} = this.props;
            let nodeListTags = [];
            let nodeListOptions = result["perm_managed_users"];
            let users = record.users;
            /**已经添加的标签选项，根据groups_display的数据，和optionsList对比，相同的在optionsList删除，生成tagList**/
            for (let i = 0; i < users.length; i++) {
                let findObj = nodeListOptions.find(x => x.id === users[i]);
                if (findObj) {
                    nodeListTags.push(findObj);
                    nodeListOptions = nodeListOptions.filter(x => x.id !== users[i]);
                }
            }
            this.setState({
                nodeListTags,
                userList: nodeListOptions,
                userGruopOptions: result["perm_groups"],
                assetListOptions: result["perm_assets"],
                nodeLists: result["perm_nodes"],
                systemUserList: result["perm_system_users"],
            });
        });
    };

    /**添加**/
    addSeletedItem = () => {
        this.setState({isLoading: true});
        let users = this.props.record.users;
        let {selectedItem} = this.state;
        users.push(selectedItem);
        let data = {users: users};
        setTimeout(() => {
            patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/user/add/`, data).then((result => {
                this.setState({isLoading: false});
                if (result && result.msg === "ok") {
                    this.props.reloadData();
                    message.success("添加成功！");
                }
            }));
        }, 500);
        this.getSelectOptions();
    };
    /**删除**/
    handleDelete = (id) => {
        this.setState({isLoading: true});
        let data = {users: id.split(",")};
        setTimeout(() => {
            patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/user/remove/`, data).then((result => {
                this.setState({isLoading: false});
                this.props.reloadData();
                message.success("删除成功！");
                this.props.onCancel();
            }));
        }, 500);
    };

    /**选中要添加的选项**/
    onSelectChange = value => {
        this.setState({
            selectedItem: value
        })
    };

    render() {
        let {userList, isLoading, pageloading,nodeListTags,nodeLists,userGruopOptions,assetListOptions} = this.state;
        return (
            <Spin spinning={pageloading}>
                <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                    <TabPane tab="用户" key="1">
                        <div className="displayflexstart">
                            <h4>添加用户 : &nbsp;&nbsp;&nbsp;</h4>
                            <Select showSearch
                                    style={{width: 240}}
                                    optionFilterProp="children"
                                    onChange={this.onSelectChange}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {createOptions(userList)}
                            </Select>
                            <button className="small-button" onClick={this.addSeletedItem}>添加</button>
                        </div>
                        <br/>
                        <Table rowKey="id"
                               size={tableConfig.size}
                               scroll={tableConfig.scroll}
                               pagination={tableConfig.pagination}
                               bordered={tableConfig.bordered}
                               loading={isLoading}
                               dataSource={nodeListTags}
                               columns={this.columns}/>
                    </TabPane>
                    <TabPane tab="用户组" key="2">
                        <UserGroups record={this.props.record}
                                    onCancel={this.props.onCancel}
                                    userGruopOptions={userGruopOptions}
                                    reloadData={this.props.reloadData}/>
                    </TabPane>
                    <TabPane tab="节点" key="3">
                        <Nodes record={this.props.record}
                               onCancel={this.props.onCancel}
                               nodeLists={nodeLists}
                               reloadData={this.props.reloadData}/>
                    </TabPane>
                    <TabPane tab="资产" key="4">
                        <Assets record={this.props.record}
                                onCancel={this.props.onCancel}
                                assetListOptions={assetListOptions}
                                reloadData={this.props.reloadData}/>
                    </TabPane>
                </Tabs>
            </Spin>
        );
    }
}
