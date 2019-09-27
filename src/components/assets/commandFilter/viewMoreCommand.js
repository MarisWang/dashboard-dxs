import React from 'react';
import {Icon, message, Popconfirm, Table, Tabs,} from 'antd';
import {filterSubHeader, tableConfig} from "../../../common/tableHeader";
import {deleteDatas, fetchDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import CreateComponent from "../../../common/creator";

const TabPane = Tabs.TabPane;

export default class CommandFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            optionsList: [],
            tagList: [],
            selectedItem: "",
        };
    }

    componentWillMount() {
        this.opeartionOptions();
        this.getTableDatas();
    }

    /**规则表格的头部**/
    opeartionOptions = () => {
        const operation = {
            title: '操作', width: "120px", dataIndex: 'operation', render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"commandRule"}
                                record={record}
                                title={"编辑命令过滤器规则"}/>
                    </div>
                );
            },
        };
        let result = filterSubHeader.find(item => item.dataIndex === "operation");
        if (!result) filterSubHeader.push(operation);
    };
    /**获得规则表格的数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/assets/v1/cmd-filter/${this.props.record.id}/rules/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };
    /**删除 delete**/
    handleDelete = (record) => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/cmd-filter/${record.filter}/rules/${record.id}/`).then((result => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== record.id)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };

    render() {
        const {tableDatas, isLoading,} = this.state;
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                    <TabPane tab="规则" key="1">
                        <CreateComponent hasSelected={false}
                                         selectedRowKeys={[]}
                                         reloadData={this.getTableDatas}
                                         record={this.props.record}
                                         keyWord={"commandRule"}
                                         title={"创建命令过滤器规则"}/>
                        <Table rowKey="id"
                               size={tableConfig.size}
                               scroll={tableConfig.scroll}
                               pagination={tableConfig.pagination}
                               bordered={tableConfig.bordered}
                               loading={isLoading}
                               expandRowByClick={true}
                               dataSource={tableDatas}
                               columns={filterSubHeader}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
