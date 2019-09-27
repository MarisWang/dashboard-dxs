import React from 'react';
import {SystemUserHedaer, tableConfig} from "../../../common/tableHeader";
import {Table, Popconfirm, Icon, message, Tooltip,} from 'antd';
import CreateComponent from "../../../common/creator";
import SystemUserDetail from "./systyemUserDetail";
import {fetchDatas, deleteDatas,} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import Config from "../../../config/config";
import {SearchInput} from "hermes-react";

export default class SystemUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            assetLists: [],
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }
    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/assets/v1/system-user/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };

    pushOperationControl = () => {
        const operation = {
            title: '动作',
            width: "120px",
            dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;
                        <Tooltip title="测试可连接性">
                            <Icon type="api" theme="filled" onClick={() => this.testConnectability(record.id)}/>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"systemCreate"}
                                record={record.id}
                                title={"编辑系统用户"}/>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreSystemUser"}
                                  record={record}/>
                    </div>
                );
            }
        };
        let result = SystemUserHedaer.find(item => item.dataIndex === "operation");
        if (!result) SystemUserHedaer.push(operation);
    };

    /**删除 delete**/
    handleDelete = id => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/system-user/${id}`).then((result) => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== id)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        })
    };
    /**测试可链接性**/
    testConnectability = (id) => {
        fetchDatas(`/assets/v1/system-user/${id}/connective/`,result => {
            window.open(`${Config.api}/ops/celery/task/${result["task"]}/log/`, '测试可链接性', 'height=500, width=800');
        });
    };

    /**搜索**/
    onSearchTables=(value)=>{
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/system-user/?search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };

    render() {
        const {tableDatas, isLoading} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                    <CreateComponent reloadData={this.getTableDatas}
                                     keyWord={"systemCreate"}
                                     title={"创建系统用户"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={SystemUserHedaer}
                       onExpandedRowsChange={this.onExpandedRowsChange}
                       expandedRowRender={record => <SystemUserDetail record={record}
                                                                      reloadData={this.getTableDatas}/>}
                />
            </div>
        );
    }
}
