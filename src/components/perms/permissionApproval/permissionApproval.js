import React from 'react';
import {Icon, message, Popconfirm, Table, Tabs} from 'antd';
import {approvalHeader, tableConfig} from "../../../common/tableHeader";
import {deleteDatas, fetchDatas, putDatas} from "../../../common/apiManager";
import moment from "moment";
import CreateComponent from "../../../common/creator";
import {SearchInput} from "hermes-react";

const TabPane = Tabs.TabPane;

export default class AdminAuthorization extends React.Component {
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

    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/apply-perms/v1/apply-permissions/`, tableDatas => {
                this.setState({isLoading: false});
                let role = JSON.parse(localStorage.getItem("Auth")).user.role;
                tableDatas.map((item) => {
                    item["role"] = role;
                });
                this.setState({
                    tableDatas
                });
            });
        }, 500)
    };
    /**操作**/
    pushOperationControl = () => {
        let userId = JSON.parse(localStorage.getItem("Auth")).user.userid;
        const operation = {
            title: '动作', dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        {
                            (record.role === 1 || record.role === 2 || record.role === 5) && record.status === "Applying" && record["applicant"] !== userId ?
                                <div className="displayflexcenter">
                                    <button className="tableBtns greenBtn"
                                            onClick={() => this.pastOrrefuseToApply(record.id, "Approved")}>通过
                                    </button>
                                    &nbsp;&nbsp;
                                    <button className="tableBtns redBtn"
                                            onClick={() => this.pastOrrefuseToApply(record.id, "Disapproved")}>拒绝
                                    </button>
                                    &nbsp;&nbsp;
                                </div>
                                : null
                        }
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <button className="tableBtns blueBtn">删除</button>
                        </Popconfirm>
                    </div>
                );
            }
        };
        let result = approvalHeader.find(item => item.dataIndex === "operation");
        if (!result) approvalHeader.push(operation);
    };
    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/apply-perms/v1/apply-permissions/${key}`).then((result => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };
    /**通过申请 决绝申请**/
    pastOrrefuseToApply = (id, status) => {
        let data = {
            id: id,
            status: status
        };
        putDatas(`/apply-perms/v1/apply-permissions/approve/`, data).then((result => {
            if (result && result.msg === "success") {
                this.getTableDatas();
                this.pushOperationControl();
                message.success("操作成功！");
            } else {
                message.error("操作失败！");
            }
        }));
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/apply-perms/v1/apply-permissions/?search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };
    render() {
        let {tableDatas, isLoading} = this.state;
        let role = JSON.parse(localStorage.getItem("Auth")).user.role;
        return (
            <div className="wrapper">
                {
                    role === 1 || role === 5 ?
                        <div className="displayflexend">
                            {/*<SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>*/}
                        </div>
                        :
                        <div className="displayflexend">
                            {/*<SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>*/}
                            <CreateComponent reloadData={this.getTableDatas}
                                             keyWord={"applyForAuth"}
                                             title={"创建授权申请"}/>
                        </div>
                }
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={approvalHeader}
                       expandedRowRender={record =>
                           <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                               <TabPane tab="详情" key="1">
                                   <ul className="displayflexbetween detailList">
                                       <li><span>申请时间: </span> {moment(record["date_applied"]).format('LLL')}</li>
                                       <li><span>失效时间: </span> {moment(record["end"]).format('LLL')}</li>
                                       <li>
                                           <span>审批时间: </span> {record["date_approved"] ? moment(record["date_approved"]).format('LLL') : "未审批"}
                                       </li>
                                       <li><span>生效时间: </span> {moment(record["start"]).format('LLL')}</li>
                                   </ul>
                               </TabPane>
                           </Tabs>
                       }
                />
            </div>
        );
    }
}
