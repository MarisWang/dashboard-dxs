import React from 'react';
import {message, Table} from 'antd';
import {deleteDatas, fetchDatas} from '../../common/apiManager';
import {FTPHeader, tableConfig} from "../../common/tableHeader";
import {SearchInput} from "hermes-react";
import CreateComponent from "../../common/creator";

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

    /**获得数据**/
    getTableDatas = (limit, offset) => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/audits/v1/ftp-log/?limit=${limit}&offset=${offset}`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result["results"],
                    total: result.count
                });
            });
        }, 500)
    };
    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/audits/v1/user-login-log/${key}`).then((result => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };

    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        let {limit, offset} = this.state;
        fetchDatas(`/audits/v1/ftp-log/?limit=${limit}&offset=${offset}&search=${value}`, result => {
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
                           onShowSizeChange: this.pageChange
                       }}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={FTPHeader}
                />
            </div>
        )
    }
}
