import React from 'react';
import {Table, Tabs} from 'antd';
import {tableConfig, taskRecordHeader} from "../../common/tableHeader";
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
            fetchDatas(`/assets/v1/bulktask/?limit=${limit}&offset=${offset}`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result["results"],
                    total: result.count
                });
            });
        }, 500)
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        let {limit, offset} = this.state;
        fetchDatas(`/assets/v1/bulktask/?limit=${limit}&offset=${offset}&search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result["results"],
                total: result.count
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
                       columns={taskRecordHeader}
                       expandedRowRender={record =>
                           <Tabs defaultActiveKey="1">
                               <TabPane tab="详情" key="1">
                                   <ul className="displayflexbetween detailList">
                                       <li><span>上传文件：</span>{record["uploadfiles"]}</li>
                                       <li><span>备注：</span>{record["comment"]}</li>
                                       <li><span>Ipset：</span>{record["ipsets"]}</li>
                                       <li><span>创建日期：</span>{moment(record["date_created"]).format('LLL')}</li>
                                       <li><span>文件路径：</span>{record["file_path"]}</li>
                                       <li><span>节点：</span>{record["nodes"]}</li>
                                       <li><span>用户：</span>{record["users"]}</li>
                                       <li><span>创建者：</span>{record["created_by"]}</li>
                                       <li><span>Ip：</span>{record["ipset"]}</li>
                                       <li><span>标签：</span>{record["labels"]}</li>
                                       <li><span>防火墙规则：</span>{record["iptables"]}</li>
                                   </ul>
                               </TabPane>
                           </Tabs>
                       }
                />
            </div>
        )
    }
}
