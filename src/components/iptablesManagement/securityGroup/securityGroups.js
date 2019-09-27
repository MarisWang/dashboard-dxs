import React from 'react';
import {Icon, message, Popconfirm, Table, Tooltip} from 'antd';
import {iptableSecurityGroupHeader, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import {deleteDatas, fetchDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import {SearchInput} from "hermes-react";

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false
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
            fetchDatas(`/applications/v1/securitygroups/?is_template=false`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };
    /**操作选项**/
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
                                keyWord={"securityGroups"}
                                record={record}
                                title={"编辑安全组"}/>
                        &nbsp;&nbsp;&nbsp;
                        <Tooltip title="推送" onClick={() => this.push(record.id)}>
                            <Icon type="cloud-upload"/>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreSecurityGroup"}
                                  record={record}/>
                    </div>
                );
            }
        };
        let result = iptableSecurityGroupHeader.find(item => item.dataIndex === "operation");
        if (!result) iptableSecurityGroupHeader.push(operation);
    };

    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/applications/v1/securitygroups/${key}`).then((result) => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        })
    };
    /**推送**/
    push = (id) => {
        this.setState({isLoading: true});
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 3000)
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/applications/v1/securitygroups/?is_template=false&search=${value}`, result => {
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
                                     keyWord={"securityGroups"}
                                     title={"创建安全组"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={iptableSecurityGroupHeader}
                />
            </div>
        );
    }
}
