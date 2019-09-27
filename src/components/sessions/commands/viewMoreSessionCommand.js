import React from 'react';
import {Table, Tabs,} from 'antd';
import {fetchDatas} from "../../../common/apiManager";
import moment from "moment";
import {tableConfig} from "../../../common/tableHeader";

const TabPane = Tabs.TabPane;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false
        };
        this.columns = [
            {
                title: '#', width: "120px", dataIndex: '',
                render: (text, record, index) => {
                    return index + 1
                }
            },
            {title: '命令', dataIndex: 'input'},
            {
                title: '日期', dataIndex: 'timestamp', render: (text, record, index) => {
                    return moment(text * 1000).format('LLL');
                }
            },
        ];
    }

    componentWillMount() {
        this.getTableDatas();
    }

    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            if(this.props.record["session"]){
                let session = this.props.record["session"];
                fetchDatas(`/terminal/v1/command/?session=${session}`, result => {
                    this.setState({
                        isLoading: false,
                        tableDatas: result
                    });
                });
            }
        }, 500)
    };

    render() {
        const {tableDatas, isLoading} = this.state;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="详情" key="1">
                    <Table rowKey="id"
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={tableDatas}
                           columns={this.columns}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
