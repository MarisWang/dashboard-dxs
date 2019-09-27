import React from 'react';
import {Icon, message, Popconfirm, Table, Tabs} from 'antd';
import {ServiceUserHedaer, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import {fetchDatas, deleteDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import moment from "moment";
import {SearchInput} from "hermes-react";

const TabPane = Tabs.TabPane;

export default class ServiceUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            usersGroupLists: [],
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
                                keyWord={"serviceCreate"}
                                record={record.id}
                                title={"编辑服务用户"}/>
                    </div>
                );
            },
        };
        let result = ServiceUserHedaer.find(item => item.dataIndex === "operation");
        if (!result) ServiceUserHedaer.push(operation);
    };
    /**table datas**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/assets/v1/service-user/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };

    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/service-user/${key}`).then((result => {
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
        fetchDatas(`/assets/v1/service-user/?search=${value}`, result => {
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
                    {/*<SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>*/}
                    <CreateComponent keyWord={"serviceCreate"}
                                     reloadData={this.getTableDatas}
                                     title={"创建服务用户"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={ServiceUserHedaer}
                       expandedRowRender={record =>
                           <Tabs defaultActiveKey="1">
                               <TabPane tab="详情" key="1">
                                   <ul className="displayflexbetween detailList">
                                       <li><span>Shell:</span>{record["shell"]}</li>
                                       <li><span>Sudo:</span>{record["sudo"]}</li>
                                       <li><span>创建时间:</span>{moment(record["create"]).format('LLL')}</li>
                                   </ul>
                               </TabPane>
                           </Tabs>
                       }
                />
            </div>
        );
    }
}
