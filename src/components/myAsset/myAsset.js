import React from 'react';
import {Table} from 'antd';
import {fetchDatas} from "../../common/apiManager";
import {myAssetHeader, tableConfig} from "../../common/tableHeader";
import MyAssetDetail from "../myAsset/myAssetDetail";
import {SearchInput} from "hermes-react";

export default class Asset extends React.Component {
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
            fetchDatas(`/perms/v1/user/assets/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500);
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/perms/v1/user/assets/?search=${value}`, result => {
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
                       columns={myAssetHeader}
                       expandedRowRender={record =>
                           <MyAssetDetail record={record}
                                        reloadData={this.getTableDatas}/>}
                />
            </div>
        );
    }
}




