import React from 'react';
import {SearchInput} from 'hermes-react';
import {Icon, Popconfirm, Table, message, Button, Dropdown, Menu} from 'antd';
import UserDetail from "./userDetails";
import {userHeader, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import {fetchDatas, deleteDatas, postDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import Config from "../../../config/config";
import $ from "jquery";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            selectedRowKeys: [], // Check here to configure the default column
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }

    pushOperationControl = () => {
        let user = JSON.parse(localStorage.getItem("Auth")).user.username;
        const operation = {
            title: '操作', width: "120px", dataIndex: 'operation', render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        {
                            record.username === user || record.username === "admin" ? null :
                                <div className="displayflexcenter">
                                    <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                                        <Icon type="delete" theme="filled"/>
                                    </Popconfirm>
                                    &nbsp;&nbsp;&nbsp;
                                    <Editor reloadData={this.getTableDatas}
                                            keyWord={"userCreate"}
                                            record={record}
                                            title={"编辑用户"}/>
                                    &nbsp;&nbsp;&nbsp;
                                </div>
                        }
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreUser"}
                                  record={record}/>
                    </div>
                );
            },
        };
        let result = userHeader.find(item => item.dataIndex === "operation");
        if (!result) userHeader.push(operation);
    };
    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas("/users/v1/users/", result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result,
                });
            });
        }, 500)
    };

    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/users/v1/users/${key}/`).then((result => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/users/v1/users/?search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };
    /**导出表格数据**/
    downloadExcel = () => {
        let data = {
            'resources': this.state.selectedRowKeys
        };
        postDatas("/common/v1/resources/cache/", data).then((result) => {
            let vlaue = $(".ant-search-input .ant-input").val();
            if (vlaue === "") {
                window.open(`${Config.api}/api/users/v1/users/?search=&format=csv&spm=${result.spm}`);
            } else {
                window.open(`${Config.api}/api/users/v1/users/?search=${vlaue}&format=csv&spm=${result.spm}`);
            }
        })
    };
    /**表格多选**/
    onSelectChange = selectedRowKeys => {
        this.setState({selectedRowKeys});
    };

    render() {
        let {tableDatas, isLoading, selectedRowKeys} = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <div onClick={this.downloadExcel}>导出Excel</div>
                </Menu.Item>
            </Menu>
        );
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} id="searchInput" placeholder="请输入名称或用户名..."/>
                    <CreateComponent reloadData={this.getTableDatas}
                                     keyWord={"userCreate"}
                                     title={"创建新用户"}/>
                    <Dropdown overlay={menu} placement="bottomCenter">
                        <Button type="primary">表格CVS</Button>
                    </Dropdown>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={userHeader}
                       rowSelection={rowSelection}
                       expandedRowRender={record =>
                           <UserDetail record={record}
                                       reloadData={this.getTableDatas}/>}/>
            </div>
        )
    }
}
