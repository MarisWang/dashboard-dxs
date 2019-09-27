import React from 'react';
import {Icon, Table, Tooltip, Tabs, message} from 'antd';
import {onlineSessionHeader, tableConfig} from "../../../common/tableHeader";
import {fetchDatas, postDatas} from "../../../common/apiManager";
import moment from "moment";
import {SearchInput} from "hermes-react";
import CreateComponent from "../../../common/creator";

const TabPane = Tabs.TabPane;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentWillMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }

    pushOperationControl = () => {
        const operation = {
            title: '动作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div>
                        <Tooltip title="中断会话" onClick={() => this.disconnect(record.id)}>
                            <Icon type="scissor"/>
                        </Tooltip>
                    </div>
                );
            }
        };
        let result = onlineSessionHeader.find(item => item.dataIndex === "operation");
        if (!result) onlineSessionHeader.push(operation);
    };
    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/terminal/v1/sessions/?is_finished=False`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };
    /**中断会话**/
    disconnect = (session_id) => {
        this.setState({isLoading: true});
        let data = [session_id];
        setTimeout(() => {
            postDatas(`/terminal/v1/tasks/kill-session/`, data).then((result)=>{
                this.setState({isLoading: false});
                message.success("已经中断此会话！");
                this.getTableDatas();
            });
        }, 500)
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/terminal/v1/sessions/?is_finished=False&search=${value}`, result => {
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
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={onlineSessionHeader}
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
