import React from 'react';
import {Table, Tabs, Icon, Tooltip, message} from 'antd';
import {fetchDatas,getNodesSelectOptions} from "../../../common/apiManager";
import {tableConfig} from "../../../common/tableHeader";
import Config from "../../../config/config";

const TabPane = Tabs.TabPane;

export default class SystemUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assetLists: [],
            isLoading: false,
            optionsList: [],
            tagList: [],
            selectedItem: "",
        };
        this.assetColumn = [
            {
                title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
                    return (index + 1)
                }
            },
            {title: '主机名', dataIndex: 'hostname'},
            {title: 'IP', dataIndex: 'ip'},
            {title: '端口', dataIndex: 'port'},
            // {title: '可连接', dataIndex: 'connectivity'},
            {
                title: '动作', width: "120px", dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <div>
                            <Tooltip title="更新认证">
                                <Icon type="enter" onClick={this.update}/>
                            </Tooltip>
                            &nbsp;&nbsp;&nbsp;
                            <Tooltip title="查看认证">
                                <Icon type="retweet" onClick={this.update}/>
                            </Tooltip>
                            &nbsp;&nbsp;&nbsp;
                            <Tooltip title="测试可连接性">
                                <Icon type="api" theme="filled" onClick={() => this.testConnectability(record.id)}/>
                            </Tooltip>
                        </div>
                    );
                }
            }
        ];
    }

    componentWillMount() {
        this.getSelectOptions();
    }

    componentDidMount() {
        this.getTableDatas();
    }

    /**获取下拉选项的值**/
    getSelectOptions = () => {
        getNodesSelectOptions(optionsList=>{
            let tagList = [];
            let nodes = this.props.record.nodes;
            /**已经添加的标签选项，根据groups_display的数据，和optionsList对比，相同的在optionsList删除，生成tagList**/
            for (let item in nodes) {
                let findObj = optionsList.find(x => x.id === nodes[item]);
                if (findObj) {
                    tagList.push(findObj);
                    optionsList = optionsList.filter(x => x.id !== nodes[item]);
                }
            }
            this.setState({
                optionsList,
                tagList
            });
        });
    };
    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        let openRow = this.props.record.id;
        setTimeout(() => {
            fetchDatas(`/assets/v1/system-user/${openRow}/assets/`,result => {
                this.setState({
                    isLoading: false,
                    assetLists: result,
                });
            });
        }, 500)
    };
    /**测试可链接性**/
    testConnectability = (id) => {
        fetchDatas(`/assets/v1/assets/${id}/alive/`,result => {
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
                <TabPane tab="资产管理" key="1">
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