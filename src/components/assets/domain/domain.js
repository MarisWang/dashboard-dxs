import React from 'react';
import {Icon, message, Popconfirm, Table} from 'antd';
import {domainHedaer, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import {deleteDatas, fetchDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import {SearchInput} from "hermes-react";

export default class Domain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
        };
    }

    componentWillMount() {
        this.opeartionOptions();
        this.getTableDatas();
    }

    opeartionOptions = () => {
        const operation = {
            title: '操作', width: "120px", dataIndex: 'operation', render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"domain"}
                                record={record.id}
                                title={"编辑网域"}/>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreDomain"}
                                  record={record}/>
                    </div>
                );
            },
        };
        let result = domainHedaer.find(item => item.dataIndex === "operation");
        if (!result) domainHedaer.push(operation);
    };
    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/assets/v1/domain/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result,
                });
            });
        }, 500)
    };

    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/domain/${key}`).then((result => {
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
        console.log(value);
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/domain/?search=${value}`, result => {
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
                    {/*<SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>*/}
                    <CreateComponent reloadData={this.getTableDatas}
                                     keyWord={"domain"}
                                     title={"创建网域"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={domainHedaer}
                />
            </div>
        );
    }
}
