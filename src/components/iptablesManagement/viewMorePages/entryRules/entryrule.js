import React from 'react';
import {Icon, message, Popconfirm, Table, Tabs} from 'antd';
import {entryrulesHeader, tableConfig} from "../../../../common/tableHeader";
import {deleteDatas, fetchDatas} from "../../../../common/apiManager";
import CreateComponent from "../../../../common/creator";
import moment from "moment";
import Editor from "../../../../common/editor";

const TabPane = Tabs.TabPane;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            securitygroup_id:this.props.record.id
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }

    getTableDatas = () => {
        this.setState({isLoading: true});
        let query = window.location.pathname;
        let pathname = query.split("/")[1];
        let keyword = pathname==="iptablesstatus" ? "asset_id" :"securitygroup_id";
        setTimeout(() => {
            fetchDatas(`/applications/v1/iptables/?chain=INPUT&${keyword}=${this.state.securitygroup_id}`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 800)
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
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"entryRules"}
                                record={record}
                                title={"编辑入口规则"}/>
                    </div>
                );
            }
        };
        let result = entryrulesHeader.find(item => item.dataIndex === "operation");
        if (!result) entryrulesHeader.push(operation);
    };
    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/applications/v1/iptables/${key}/`).then((result => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };
    render() {
        const {tableDatas,isLoading} = this.state;
        return (
            <div>
                <CreateComponent reloadData={this.getTableDatas}
                                 keyWord={"entryRules"}
                                 record={this.props.record}
                                 title={"创建入站规则"}/>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={entryrulesHeader}
                       expandedRowRender={record =>
                           <Tabs defaultActiveKey="1">
                               <TabPane tab="详情" key="1">
                                   <ul className="displayflexbetween detailList">
                                       <li><span>最近更新者:</span>{record["last_updator"]}</li>
                                       <li><span>创建时间:</span>{moment(record["created_at"]).format('LLL')}</li>
                                       <li><span>更新时间:</span>{moment(record["updated_at"]).format('LLL')}</li>
                                       <li><span>规则备注:</span>{record["comment"]}</li>
                                   </ul>
                               </TabPane>
                           </Tabs>
                       }
                />
            </div>
        );
    }
}
