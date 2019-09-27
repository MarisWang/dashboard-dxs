import React from 'react';
import {Table, Tabs} from 'antd';
import {tableConfig, operationRecordsHeader} from "../../common/tableHeader";
import moment from "../assets/assets/assetDetail";
import {fetchDatas} from "../../common/apiManager";
import {SearchInput} from "hermes-react";

const TabPane = Tabs.TabPane;

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentDidMount() {
        this.getTableDatas();
    }

    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
            // fetchDatas("/audits/v1/operate-log/", result => {
            //     this.setState({
            //         isLoading: false,
            //         tableDatas: result,
            //     });
            // });
        }, 500)
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/audits/v1/operate-log/?search=${value}`, result => {
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
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={operationRecordsHeader}
                       expandedRowRender={record =>
                           <Tabs defaultActiveKey="1">
                               <TabPane tab="详情" key="1">
                                   <ul className="displayflexbetween detailList">
                                       <li><span>创建者：</span>{record["public_ip"]}</li>
                                       <li><span>备注:</span>{record.protocols}</li>
                                       <li><span>日期:</span>{moment(record["date_created"]).format('LLL')}</li>
                                   </ul>
                               </TabPane>
                           </Tabs>
                       }/>
            </div>
        )
    }
}
