import React from 'react';
import {Icon, message, Popconfirm, Table} from 'antd';
import CreateComponent from "../../../common/creator";
import {adminAuthHeader, tableConfig} from "../../../common/tableHeader";
import UserApplyDetails from "../viewMorePages/authDetails";
import {deleteDatas, fetchDatas, putDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import {SearchInput} from "hermes-react";

export default class AdminAuthorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentWillMount() {
        this.getTableDatas();
    }

    componentDidMount() {
        this.pushOperationControl();
    }

    /**表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/perms/v1/asset-permissions/?created_by=system`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };
    /**操作选项**/
    pushOperationControl = () => {
        let role = JSON.parse(localStorage.getItem("Auth")).user.role;
        const operation = {
            title: '动作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        {
                            role === 2 ? null :
                                <Editor reloadData={this.getTableDatas}
                                        keyWord={"adminAuth"}
                                        record={record}
                                        title={`编辑管理员授权`}/>
                        }
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreAdminAuth"}
                                  record={record}/>
                    </div>
                );
            }
        };
        let result = adminAuthHeader.find(item => item.dataIndex === "operation");
        if (!result) adminAuthHeader.push(operation);
    };
    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/perms/v1/asset-permissions/${key}`).then((result) => {
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
        fetchDatas(`/perms/v1/asset-permissions/?created_by=system&search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };
    render() {
        let {isLoading, tableDatas} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                    <CreateComponent reloadData={this.getTableDatas}
                                     keyWord={"adminAuth"}
                                     selectdTabkey="User"
                                     title={`创建组长授权`}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={adminAuthHeader}
                       expandedRowRender={record =>
                           <UserApplyDetails record={record} reloadData={this.getTableDatas}/>
                       }
                />
            </div>
        );
    }
}
