import React from 'react';
import {Table, Tabs} from "antd";
import {tableConfig, taskVersionHeader, taskHistoryHeader} from "../../../common/tableHeader";
import {fetchDatas} from "../../../common/apiManager";

const TabPane = Tabs.TabPane;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskVersionData: [],
            taskHistoryData: [],
        }
    };

    componentWillMount() {
        this.getTableDatas();
    }
    /**表格数据**/
    getTableDatas = () => {
        let openRow = this.props.record.id;
        /**任务版本**/
        fetchDatas(`/ops/v1/adhoc/?task=${openRow}`, result => {
            this.setState({
                taskVersionData: result,
            });
        });
        /**执行历史**/
        fetchDatas(`/ops/v1/tasks/${openRow}`, result => {
            this.setState({
                taskHistoryData: [result],
            });
        });
    };

    render() {
        const {taskVersionData, taskHistoryData, isLoading} = this.state;
        return (
            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                <TabPane tab="任务各版本" key="1">
                    <Table rowKey="id"
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={taskVersionData}
                           columns={taskVersionHeader}
                           rowClassName="editable-row"/>
                </TabPane>
                <TabPane tab="执行历史" key="2">
                    <Table rowKey="id"
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={taskHistoryData}
                           columns={taskHistoryHeader}
                           rowClassName="editable-row"/>
                </TabPane>
            </Tabs>
        );
    }
}
