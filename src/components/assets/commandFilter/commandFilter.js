import React from 'react';
import {Icon, message, Popconfirm, Table,} from 'antd';
import {filterHeader, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import CommandDetails from "./commandDetails";
import {deleteDatas, fetchDatas,} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import {SearchInput} from "hermes-react";

export default class CommandFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentDidMount() {
        this.opeartionOptions();
        this.getTableDatas();
    }

    opeartionOptions = () => {
        const operation = {
            title: '操作', width: "120px", dataIndex: 'operation', render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"command"}
                                record={record.id}
                                title={"编辑命令过滤"}/>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreCommand"}
                                  record={record}
                                  title={"查看更多"}/>
                    </div>
                );
            },
        };
        let result = filterHeader.find(item => item.dataIndex === "operation");
        if (!result) filterHeader.push(operation);
    };

    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(()=>{
            fetchDatas(`/assets/v1/cmd-filter/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        },500)
    };

    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
         deleteDatas(`/assets/v1/cmd-filter/${key}`).then((result => {
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
    onSearchTables=(value)=>{
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/cmd-filter/?search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };

    render() {
        const {tableDatas, isLoading,} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                    <CreateComponent reloadData={this.getTableDatas}
                                     keyWord={"command"}
                                     title={"创建命令过滤"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       dataSource={tableDatas}
                       columns={filterHeader}
                       loading={isLoading}
                       expandedRowRender={record => <CommandDetails record={record} reloadData={this.getTableDatas}/>}
                />
            </div>
        );
    }
}
