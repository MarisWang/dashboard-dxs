import React from 'react';
import {Table, Tabs, Icon, Tooltip, message} from 'antd';
import {deleteDatas, fetchDatas,} from "../../../common/apiManager";
import {tableConfig} from "../../../common/tableHeader";
import Config from "../../../config/config";

const TabPane = Tabs.TabPane;

export default class SystemUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assetLists: [],
            assetNodeLists: [],
            isLoading: false
        };
        this.assetColumn = [
            {
                title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
                    return (index + 1)
                }
            },
            {title: '主机名', dataIndex: 'hostname'},
            {title: 'IP', dataIndex: 'ip'},
            {title: '端口', dataIndex: 'ssh_port'},
            {
                title: '可连接', dataIndex: 'connectivity',
                render: (text, record) => {
                    return text.status === 1 ? <Icon type="check"/> : <Icon type="close"/>
                }
            },
            {
                title: '动作', width: "120px", dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <div>
                            <Tooltip title="更新认证">
                                <Icon type="retweet" onClick={this.update}/>
                            </Tooltip>
                            &nbsp;&nbsp;&nbsp;
                            <Tooltip title="查看认证">
                                <Icon type="enter" onClick={this.update}/>
                            </Tooltip>
                            &nbsp;&nbsp;&nbsp;
                            <Tooltip title="测试">
                                <Icon type="api" onClick={() => this.testConnectability(record.id)}/>
                            </Tooltip>
                        </div>
                    );
                }
            }
        ];
    }

    componentDidMount() {
        this.getTableDatas();
    }

    /**资产列表**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(()=>{
            fetchDatas(`/assets/v1/assets/`, result => {
                this.setState({
                    isLoading: false,
                    assetLists: result,
                });
            });
        },500)
    };
    /**删除操作**/
    handleDelete = id => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/system-user/${id}`).then((result) => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== id)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        })
    };
    /**测试可链接性**/
    testConnectability = (id) => {
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/assets/${id}/alive/`,result => {
            this.setState({isLoading: false});
            window.open(`${Config.api}/ops/celery/task/${result["task"]}/log/`, '测试可链接性', 'height=500, width=800');
        });
    };
    /**查看认证和更新认证**/
    update = () => {
        message.warning("缺少API，马上就好，敬请期待！")
    };

    render() {
        let {assetLists, isLoading} = this.state;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="资产列表" key="1">
                    <Table rowKey="id"
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={assetLists}
                           columns={this.assetColumn}
                           rowClassName="editable-row"
                    />
                </TabPane>
            </Tabs>
        );
    }
}
