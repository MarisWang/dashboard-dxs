import React from 'react';
import {Icon, message, Popconfirm, Table, Breadcrumb} from 'antd';
import {groupHeader, tableConfig} from "../../../common/tableHeader";
import GroupDetail from "./groupDetail";
import {deleteDatas, fetchDatas} from "../../../common/apiManager";
import CreateComponent from "../../../common/creator";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import {SearchInput} from "hermes-react";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }

    pushOperationControl = () => {
        const operation = {
            title: '操作', width: "120px", dataIndex: 'operation', render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"groupCreate"}
                                record={record.id}
                                title={"编辑用户组"}/>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreUserGroup"}
                                  record={record}/>
                    </div>
                );
            },
        };
        let result = groupHeader.find(item => item.dataIndex === "operation");
        if (!result) groupHeader.push(operation);
    };

    /**获得数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(()=>{
            fetchDatas("/users/v1/groups/?display=1",result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result,
                });
            });
        },500)
    };
    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/users/v1/groups/${key}`).then((result => {
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
        fetchDatas(`/users/v1/groups/?display=1&search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };
    render() {
        let {tableDatas, isLoading} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                    <CreateComponent reloadData={this.getTableDatas}
                                     keyWord={"groupCreate"}
                                     title={"创建用户组"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={groupHeader}
                       expandedRowRender={record => <GroupDetail record={record} reloadData={this.getTableDatas}/>}/>
            </div>
        )
    }
}
