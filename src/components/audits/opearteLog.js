import React from 'react';
import {Table, Tabs} from 'antd';
import {opearHeader, tableConfig} from "../../common/tableHeader";
import {fetchDatas} from "../../common/apiManager";
import moment from "moment";
import {SearchInput} from "hermes-react";

const TabPane = Tabs.TabPane;

export default class Users extends React.Component {
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

    componentDidMount() {
        this.getTableDatas(this.state.limit,this.state.offset);
    }

    getTableDatas = (limit, offset) => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/audits/v1/operate-log/?limit=${limit}&offset=${offset}`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result["results"],
                    total: result.count
                });
            });
        }, 500)
    };

    /**搜索**/
    onSearchTables=(value)=>{
        this.setState({isLoading: true});
        let {limit, offset} = this.state;
        fetchDatas(`/audits/v1/operate-log/?limit=${limit}&offset=${offset}&search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };
    /**分页方法**/
    pageChange = (page, pageSize) => {
        this.setState({
            limit: page,
            offset: pageSize
        });
        this.getTableDatas(pageSize, (page - 1) * pageSize);
    };
    render() {
        let {tableDatas, isLoading,total} = this.state;
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
                       columns={opearHeader}
                       expandedRowRender={record =>
                           <Tabs defaultActiveKey={"1"} animated>
                               <TabPane tab="详情" key="1">
                                   <ul className="displayflexbetween detailList">
                                       <li><span>日期：</span>{moment(record["datetime"]).format('LLL')}</li>
                                   </ul>
                               </TabPane>
                           </Tabs>
                       }
                />
            </div>
        )
    }
}
