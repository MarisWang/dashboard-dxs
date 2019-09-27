import React from 'react';
import {Icon, message, Popconfirm, Table, Tooltip} from 'antd';
import {tableConfig, taskListHeader} from "../../../common/tableHeader";
import TaskListDetail from "./taskListDetail";
import {deleteDatas, fetchDatas} from "../../../common/apiManager";
import ViewMore from "../../../common/viewMore";
import Config from "../../../config/config";
import {SearchInput} from "hermes-react";

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            total: 0,
            limit: 15,
            offset: 0
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas(this.state.limit, this.state.offset);
    }

    getTableDatas = (limit, offset) => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/ops/v1/tasks/?limit=${limit}&offset=${offset}`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result["results"],
                    total: result.count
                });
            });
        }, 500)
    };
    pushOperationControl = () => {
        const operation = {
            title: '动作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexstart">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        <Tooltip title="执行">
                            <Icon type="interaction" onClick={() => this.runTask(record.id)}/>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <Tooltip title="输出">
                            <Icon type="export" onClick={() => this.outputDataExecution(record.id)}/>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.reloadData}
                                  keyWord={"viewMoreTaskList"}
                                  record={record}/>
                    </div>
                );
            }
        };
        let result = taskListHeader.find(item => item.dataIndex === "operation");
        if (!result) taskListHeader.push(operation);
    };
    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/ops/v1/tasks/${key}`).then((result => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };
    /**执行**/
    runTask = (id) => {
        fetchDatas(`/ops/v1/tasks/${id}/run/`, result => {
            window.open(`${Config.api}/ops/celery/task/${result["task"]}/log/`, '测试可链接性', 'height=500, width=800');
        });
    };
    /**执行**/
    outputDataExecution = (id) => {
        window.open(`${Config.api}/ops/celery/task/${id}/log/`, '测试可链接性', 'height=500, width=800');
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        let {limit, offset} = this.state;
        fetchDatas(`/ops/v1/tasks/?limit=${limit}&offset=${offset}&search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result["results"],
                total: result.count
            });
        });
    };
    /**分页方法**/
    pageChange = (page, pageSize) => {
        this.setState({
            limit: page,
            offset: pageSize
        });
        this.getTableDatas(pageSize, (page - 1) * pageSize);
    };

    render() {
        const {tableDatas, isLoading, total} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={{
                           defaultPageSize: 15,
                           showSizeChanger: true,
                           total: total,
                           onChange: this.pageChange,
                           onShowSizeChange: this.pageChange,
                           pageSizeOptions:[15,30,50,100]
                       }}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={taskListHeader}
                       onExpandedRowsChange={this.onExpandedRowsChange}
                       expandedRowRender={record => <TaskListDetail record={record} reloadData={this.getTableDatas}/>}
                />
            </div>
        );
    }
}
