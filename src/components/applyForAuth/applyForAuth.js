import React from 'react';
import {Icon, Popconfirm, message, Table, Tabs} from 'antd';
import {deleteDatas, fetchDatas} from "../../common/apiManager";
import Editor from "../../common/editor";
import {applyForAuthHeader, tableConfig} from "../../common/tableHeader";
import CreateComponent from "../../common/creator";
import LeaderAuthTbale from "../perms/teamLeaderAuth/teamLeaderAuth";
import UserApplyTable from "../perms/userApply/userApply";
import {SearchInput} from "hermes-react";


const {TabPane} = Tabs;

export default class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            selectdTabkey:"admin"
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }

    pushOperationControl = () => {
        const operation = {
            title: '操作', width: "120px", dataindex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"applyForAuth"}
                                record={record}
                                title={"编辑资产"}/>
                    </div>
                )
            }
        };
        let result = applyForAuthHeader.find(item => item.dataindex === "operation");
        if (!result) {
            applyForAuthHeader.push(operation);
        }
        this.columns = applyForAuthHeader;
    };

    /**获取表格数据  **/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/apply-perms/v1/apply-permissions/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500);
    };

    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/apply-perms/v1/apply-permissions/${key}`).then((result) => {
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
    onSearchTables=(value)=>{
        this.setState({isLoading: true});
        fetchDatas(`/apply-perms/v1/apply-permissions/?search=${value}`, result => {
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
                                     keyWord={"applyForAuth"}
                                     title={"创建授权申请"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={applyForAuthHeader}
                    // expandedRowRender={record =>
                    //     <AssetDetail record={record}
                    //                  reloadData={this.getTableDatas}/>}
                />
            </div>
        );
    }
}




