import React from 'react';
import {Icon, Table, Tooltip} from 'antd';
import {iptableStatus, tableConfig,} from "../../../common/tableHeader";
import {fetchDatas} from "../../../common/apiManager";
import ViewMore from "../../../common/viewMore";
import {SearchInput} from "hermes-react";

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }
    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/assets/v1/assets/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };
    /**表格操作功能**/
    pushOperationControl = () => {
        const operation = {
            title: '动作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Tooltip title="刷新" onClick={this.getTableDatas}>
                            <Icon type="sync"/>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewIpstatus"}
                                  type="asset_id"
                                  record={record}/>
                    </div>
                );
            }
        };
        let result = iptableStatus.find(item => item.dataIndex === "operation");
        if (!result) iptableStatus.push(operation);
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/assets/?search=${value}`, result => {
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
                       columns={iptableStatus}/>
            </div>
        );
    }
}
