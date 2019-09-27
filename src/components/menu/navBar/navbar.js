import React from 'react';
import {Table, Popconfirm, Icon, message} from 'antd';
import {navHeader, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import {fetchDatas, deleteDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import {SearchInput} from "hermes-react";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentWillMount() {
        this.pushOperationControl();
    }

    componentDidMount() {
        this.getTableDatas();
    }

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
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"navBar"}
                                record={record}
                                title={"编辑导航"}/>
                    </div>
                );
            }
        };
        let result = navHeader.find(item => item.dataIndex === "operation");
        if (!result) navHeader.push(operation);
        this.setState({columns: navHeader});
    };

    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/navbars/v1/navbars/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };
    /**删除**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/navbars/v1/navbars/${key}`).then((result) => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        })
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/navbars/v1/navbars/?search=${value}`, result => {
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
                    <CreateComponent
                        reloadData={this.getTableDatas}
                        keyWord={"navBar"}
                        title={"创建导航"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       columns={navHeader}
                       dataSource={tableDatas}
                />
            </div>
        )
    }
}
