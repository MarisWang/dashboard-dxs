import React from 'react';
import {Icon, Popconfirm, Tooltip, message, Table, Button, Menu, Dropdown} from 'antd';
import NodeTree from "./nodesTree";
import {deleteDatas, fetchDatas,postDatas} from "../../../common/apiManager";
import Editor from "../../../common/editor";
import ViewMore from "../../../common/viewMore";
import {assetHeader, tableConfig} from "../../../common/tableHeader";
import CreateComponent from "../../../common/creator";
import AssetDetail from "./assetDetail";
import Config from "../../../config/config";
import {SearchInput} from "hermes-react";
import $ from "jquery";

export default class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            assetLists: [],
            visible: true,
            selectedRowKeys: [],
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }

    /**表格的操作**/
    pushOperationControl = () => {
        const operation = {
            title: '操作', width: "120px", dataindex: 'operation',
            render: (text, record) =>
                this.state.tableDatas.length >= 1 ? (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                        &nbsp;&nbsp;
                        <Tooltip title="测试可连接性">
                            <Icon type="api" theme="filled" onClick={() => this.testConnectability(record.id)}/>
                        </Tooltip>
                        &nbsp;&nbsp;
                        <Editor reloadData={this.getTableDatas}
                                keyWord={"asset"}
                                record={record}
                                title={"编辑资产"}/>
                        &nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreAssets"}
                                  record={record}/>
                    </div>
                ) : null,
        };
        let result = assetHeader.find(item => item.dataindex === "operation");
        if (!result) {
            assetHeader.push(operation);
        }
        this.columns = assetHeader;
    };

    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/assets-simple/`, result => {
            this.setState({isLoading: false});
            let Lists = [];
            for (let item in result) {
                Lists.push({
                    name: `${result[item].hostname}(${result[item].ip})`,
                    id: result[item].id.toString()
                });
            }
            this.setState({
                tableDatas: result,
                assetLists: Lists,
            });
        });
    };

    /**查询节点下的资产**/
    fetchAssetUnderNode = (id) => {
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/assets-simple/?node_id=${id}`, result => {
            this.setState({isLoading: false});
            let Lists = [];
            for (let item in result) {
                Lists.push({
                    name: `${result[item].hostname}(${result[item].ip})`,
                    id: result[item].id.toString()
                });
            }
            this.setState({
                tableDatas: result,
                assetLists: Lists,
            });
        });
    };
    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        deleteDatas(`/assets/v1/assets/${key}`).then((result) => {
            if (result && result.data === "") {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        })
    };

    /**测试可链接性**/
    testConnectability = (id) => {
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/assets/${id}/alive/`, result => {
            this.setState({isLoading: false});
            window.open(`${Config.api}/ops/celery/task/${result["task"]}/log/`, '测试可链接性', 'height=500, width=800');
        });
    };

    /**切换网络**/
    changeNetWork = () => {
        fetchDatas("/assets/v1/assets/switch-network/", result => {
            if (result.msg === "成功") {
                this.getTableDatas();
                message.success("网络切换成功！")
            } else {
                message.success("网络切换失败！")
            }
        });
    };
    /**节点展开切换**/
    switchNode = () => {
        this.setState({
            visible: !this.state.visible,
        });
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/assets/v1/assets-simple/?search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };

    /**导出表格数据**/
    downloadExcel = () => {
        let data = {
            'resources': this.state.selectedRowKeys
        };
        postDatas("/common/v1/resources/cache/", data).then((result) => {
            let vlaue = $(".ant-search-input .ant-input").val();
            if (vlaue === "") {
                window.open(`${Config.api}/api/assets/v1/assets/?search=&node_id=&format=csv&spm=${result.spm}`);
            } else {
                window.open(`${Config.api}/api/assets/v1/assets/?search=${vlaue}&node_id=&format=csv&spm=${result.spm}`);
            }
        })
    };
    /**表格多选**/
    onSelectChange = selectedRowKeys => {
        this.setState({selectedRowKeys});
    };

    render() {
        const {tableDatas, isLoading, visible, selectedRowKeys} = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <div onClick={this.downloadExcel}>导出Excel</div>
                </Menu.Item>
            </Menu>
        );
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="wrapper">
                <div className="displayflexbetween">
                    <Button type="primary" onClick={this.switchNode}>{visible ? "隐藏树节点" : "显示树节点"}</Button>
                    <div className="displayflexend">
                        <SearchInput onSearch={this.onSearchTables} placeholder="请输入名称或用户名..."/>
                        <div className="displayflexend form-btns">
                            <button onClick={this.changeNetWork}>切换网络</button>
                            <CreateComponent reloadData={this.getTableDatas}
                                             keyWord={"asset"}
                                             title={"创建资产"}/>
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <Button type="primary">表格CVS</Button>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <div className="displayflexbetween" style={{alignItems: "flex-start"}}>
                    <NodeTree assetLists={this.state.assetLists}
                              visible={visible}
                              fetchAssetUnderNode={this.fetchAssetUnderNode}
                              getTableDatas={this.getTableDatas}/>
                    <Table rowKey="id"
                           className="assetTable"
                           style={{width: visible ? "calc(100% - 260px)" : "100%"}}
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={tableDatas}
                           columns={assetHeader}
                           rowSelection={rowSelection}
                           expandedRowRender={record =>
                               <AssetDetail record={record}
                                            reloadData={this.getTableDatas}/>}
                    />
                </div>
            </div>
        );
    }
}




