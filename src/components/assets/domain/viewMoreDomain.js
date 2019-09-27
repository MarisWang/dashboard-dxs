import React from 'react';
import {Icon, message, Popconfirm, Table, Tabs, Tooltip} from 'antd';
import {domainGateway, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import {deleteDatas, fetchDatas, postDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import Config from "../../../config/config";

const TabPane = Tabs.TabPane;

export default class Domain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentWillMount() {
        this.opeartionOptions();
        this.getTableDatas();
    }

    /**设置操作选项**/
    opeartionOptions = () => {
        const operation = {
            title: '操作', width: "120px", dataIndex: 'operation', render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        <Tooltip title="测试可连接性">
                            <Icon type="api" theme="filled"
                                  onClick={() => this.testConnectability(record.id, record.port)}/>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"gateway"}
                                record={record.id}
                                title={"编辑网关"}/>
                    </div>
                );
            },
        };
        let result = domainGateway.find(item => item.dataIndex === "operation");
        if (!result) domainGateway.push(operation);
    };
    /***获得表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/assets/v1/gateway/?domain=${this.props.record.id}`,result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result,
                });
            });
        }, 500)
    };
    /**删除 delete**/
    handleDelete = (key) => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/gateway/${key}`).then((result => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };
    /**测试可链接性**/
    testConnectability = (id, port) => {
        this.setState({isLoading: true});
        let data = {port: port};
        postDatas(`/assets/v1/gateway/${id}/test-connective/`, data).then((result => {
            this.setState({isLoading: false});
            window.open(`${Config.api}/ops/celery/task/${result["task"]}/log/`, '测试可链接性', 'height=500, width=800');
        }));
    };

    render() {
        const {tableDatas, isLoading,} = this.state;
        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="网关" key="1">
                        <CreateComponent reloadData={this.getTableDatas}
                                         keyWord={"gateway"}
                                         title={"创建网关"}/>
                        <br/>
                        <Table rowKey="id"
                               size={tableConfig.size}
                               scroll={tableConfig.scroll}
                               pagination={tableConfig.pagination}
                               bordered={tableConfig.bordered}
                               loading={isLoading}
                               dataSource={tableDatas}
                               columns={domainGateway}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
