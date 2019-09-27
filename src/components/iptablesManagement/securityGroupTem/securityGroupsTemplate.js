import React from 'react';
import {Icon, message, Popconfirm, Table} from 'antd';
import {tableConfig, templateHeader} from "../../../common/tableHeader";
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

    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/applications/v1/securitygroups/?is_template=true`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/applications/v1/securitygroups/?is_template=true&search=${value}`, result => {
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
                        <Editor reloadData={this.reloadData}
                                keyWord={"securityGroupTem"}
                                record={record}
                                title={"编辑安全组模板"}/>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.reloadData}
                                  keyWord={"viewIpstatus"}
                                  type="securitygroup_id"
                                  record={record}/>
                    </div>
                );
            }
        };
        let result = templateHeader.find(item => item.dataIndex === "operation");
        if (!result) templateHeader.push(operation);
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

    reloadData = () => {
        this.getTableDatas();
    };

    render() {
        const {tableDatas, isLoading} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                    <CreateComponent reloadData={this.reloadData}
                                     keyWord={"securityGroupTem"}
                                     title={"创建安全组模板"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={templateHeader}
                />
            </div>
        );
    }
}
