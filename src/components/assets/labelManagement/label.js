import React from 'react';
import {Table, Popconfirm, Icon, message} from 'antd';
import {labelHeader, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import {fetchDatas, deleteDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
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
            fetchDatas(`/assets/v1/labels/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };

    pushOperationControl = () => {
        const operation = {
            title: '动作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"label"}
                                record={record.id}
                                title={"编辑标签管理"}/>
                    </div>
                );
            }
        };
        let result = labelHeader.find(item => item.dataIndex === "operation");
        if (!result) labelHeader.push(operation);
    };

    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/labels/${key}`).then((result) => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        })
    };

    /**搜索**/
    onSearchTables=(value)=>{
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/labels/?search=${value}`, result => {
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
                    <CreateComponent reloadData={this.getTableDatas}
                                     keyWord={"label"}
                                     title={"创建标签"}/>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       columns={labelHeader}
                />
            </div>
        );
    }
}
