import React from 'react';
import {Table, Popconfirm, Icon, message,Tooltip} from 'antd';
import {adminUserHeader, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import {fetchDatas, deleteDatas} from "../../../common/apiManager";
import AdminUserDetail from "./adminUserDetail";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import Config from "../../../config/config";
import {SearchInput} from "hermes-react";

export default class Adminuser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            selectedRowKeys: [],
            isLoading: false,
            openRow: ""
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }

    getTableDatas = () => {
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/admin-user/`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result
            });
        });
    };

    /**搜索**/
    onSearchTables=(value)=>{
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/admin-user/?search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };

    pushOperationControl = () => {
        const operation = {
            title: '动作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        <Tooltip title="测试可连接性">
                            <Icon type="api" theme="filled" onClick={() => this.testConnectability(record.id)}/>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"adminUser"}
                                record={record.id}
                                title={"编辑管理用户"}/>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreAdminUser"}
                                  record={record}/>
                    </div>
                );
            }
        };
        let result = adminUserHeader.find(item => item.dataIndex === "operation");
        if (!result) adminUserHeader.push(operation);
    };

    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/admin-user/${key}`).then((result) => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        })
    };
    /**测试可链接性**/
    testConnectability = (id) => {
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/admin-user/${id}/connective/`,result => {
            this.setState({isLoading: false});
            window.open(`${Config.api}/ops/celery/task/${result["task"]}/log/`, '测试可链接性', 'height=500, width=800');
        });
    };
    /**展开表格详情**/
    onExpandedRowsChange = (expandedRows) => {
        let rows = expandedRows[expandedRows.length - 1];
        this.setState({
            openRow: rows
        });
    };
    render() {
        const {tableDatas, selectedRowKeys, isLoading} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                    <CreateComponent hasSelected={false}
                                     reloadData={this.getTableDatas}
                                     selectedRowKeys={selectedRowKeys}
                                     keyWord={"adminUser"}
                                     title={"创建管理用户"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       dataSource={tableDatas}
                       columns={adminUserHeader}
                       loading={isLoading}
                       onExpandedRowsChange={this.onExpandedRowsChange}
                       expandedRowRender={record => <AdminUserDetail record={record}  reloadData={this.getTableDatas}/>}
                />
            </div>
        );
    }
}
