import React from 'react';
import {Icon, Table, Tooltip, Tabs} from 'antd';
import {offlineSessionHeader, tableConfig} from "../../../common/tableHeader";
import {fetchDatas} from "../../../common/apiManager";
import Config from "../../../config/config";
import moment from "moment";
import {SearchInput} from "hermes-react";

const TabPane = Tabs.TabPane;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            total: 0,
            limit: 15,
            offset: 0
        };
    }

    componentWillMount() {
        this.pushOperationControl();
    }

    componentDidMount() {
        this.getTableDatas(this.state.limit,this.state.offset);
    }

    getTableDatas = (limit, offset) => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/terminal/v1/sessions/?is_finished=True&limit=${limit}&offset=${offset}`, result => {
                console.log(result);
                this.setState({
                    isLoading: false,
                    tableDatas: result["results"],
                    total: result.count
                });
            });
        }, 500)
    };
    pushOperationControl = () => {
        const operation = {
            title: '动作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Tooltip title="回放">
                            <Icon type="play-circle" onClick={() => this.replaySessiosn(record.id)}/>
                        </Tooltip>
                    </div>
                );
            }
        };
        let result = offlineSessionHeader.find(item => item.dataIndex === "operation");
        if (!result) offlineSessionHeader.push(operation);
    };

    /**回放会话**/
    replaySessiosn = (id) => {
        window.open(`${Config.api}/luna/replay/${id}/`, '测试可链接性', 'height=500, width=800');
    };

    /**分页方法**/
    pageChange = (page, pageSize) => {
        this.getTableDatas(pageSize, (page - 1) * pageSize);
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        let {limit, offset} = this.state;
        fetchDatas(`/terminal/v1/sessions/?is_finished=True&limit=${limit}&offset=${offset}&search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result["results"],
                total: result.count
            });
        });
    };
    render() {
        const {tableDatas, isLoading, total} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={{
                           defaultPageSize: 15,
                           showSizeChanger: true,
                           total: total,
                           onChange: this.pageChange,
                           onShowSizeChange: this.pageChange,
                           pageSizeOptions:[15,30,50,100]
                       }}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={offlineSessionHeader}
                       expandedRowRender={record =>
                           <Tabs defaultActiveKey={"1"} animated>
                               <TabPane tab="详情" key="1">
                                   <ul className="displayflexbetween detailList">
                                       <li><span>开始日期：</span>{moment(record["date_start"]).format('LLL')}</li>
                                       <li><span>登陆来源：</span>{record["login_from"]}</li>
                                   </ul>
                               </TabPane>
                           </Tabs>
                       }
                />
            </div>
        );
    }
}
