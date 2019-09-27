import React from 'react';
import {Table, Tree, message} from 'antd';
import {fetchDatas, patchDatas} from "../../../common/apiManager";
import {tableConfig} from "../../../common/tableHeader";
import {toTreeData} from "../../../common/common";

const {TreeNode} = Tree;

export default class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            treeData: [],
            isLoading: false,
            assetLists: [],
            selectedRowKeys: [],
            expandedKeys: [],
        };
        this.columns = [
            {
                title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
                    return (index + 1)
                }
            },
            {title: '主机名', dataIndex: 'hostname', sorter: (a, b) => this.tableSortFun(a, b, "hostname")},
            {title: 'IP(默认填内网IP)', dataIndex: 'ip'},
        ];
    }

    componentWillMount() {
        this.getTableDatas();
        this.getTreeDatas();
    }

    componentDidMount() {
        this.onExpand([]);
    }

    /**获取表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/assets/v1/assets/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result,
                });
            });
        }, 500)
    };
    /**获得树形图数据**/
    getTreeDatas = () => {
        fetchDatas(`/assets/v1/nodes/`, result => {
            let treeData = toTreeData(result);
            this.setState({
                treeData: treeData,
            });
            this.onExpand([treeData[0].id]);
        });
    };
    /**展开节点**/
    onExpand = (expandedKeys) => {
        this.setState({expandedKeys: expandedKeys});
    };
    /**渲染树形图**/
    renderTreeNodes = data => data.map(item => {
        if (item.children) {
            return (
                <TreeNode title={item.value} key={item.id} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode key={item.key} {...item} />;
    });
    /**选中节点，渲染表格**/
    selectNode = (selectedKeys, info) => {
        this.setState({selectedRowKeys: []});
        let id = info.node.props.dataRef.id;
        this.setState({isLoading: true});
        setTimeout(()=>{
            fetchDatas(`/assets/v1/assets/?node_id=${id}`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result,
                });
            });
        },500)
    };
    /**确认添加**/
    comfirmeToAdd = (params) => {
        let data = {assets: params};
        patchDatas(`/assets/v1/nodes/${this.props.selectItem}/assets/add/`, data).then((result) => {
            if (result && result instanceof Object) {
                message.success("添加成功！");
            } else {
                message.error("添加失败！");
            }
            this.props.onDrawerClose();
        });
    };

    /**确认移动**/
    comfirmeToReplace = (params) => {
        let data = {assets: params};
        patchDatas(`/assets/v1/nodes/${this.props.selectItem}/assets/replace/`, data).then((result) => {
            if (result && result instanceof Object) {
                message.success("移动成功！");
            } else {
                message.error("移动失败！");
            }
            this.props.onDrawerClose();
        });
    };
    /**确认提交节点操作**/
    comfiremSubmit = () => {
        let {selectedRowKeys} = this.state;
        let {openFrom} = this.props;
        /**添加资产到节点**/
        if (openFrom === "addToSsset") {
            this.comfirmeToAdd(selectedRowKeys);
        }
        /**移动到资产节点**/
        if (openFrom === "moveToAssetNode") {
            this.comfirmeToReplace(selectedRowKeys);
        }
    };

    render() {
        const {tableDatas, isLoading, treeData, selectedRowKeys, expandedKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRowKeys})
            }
        };
        return (
            <div className="wrapper">
                <div className="displayflexbetween" style={{alignItems: "flex-start"}}>
                    <Tree expandedKeys={expandedKeys}
                          onExpand={this.onExpand}
                          onSelect={this.selectNode}>
                        {this.renderTreeNodes(treeData)}
                    </Tree>
                    <Table rowKey="id"
                           rowSelection={rowSelection}
                           className="assetTable"
                           style={{width: "calc(100% - 420px)"}}
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={tableDatas}
                           columns={this.columns}
                    />
                </div>
                <div className="displayflexend form-btns">
                    <button onClick={this.props.onDrawerClose}>取消</button>
                    <button onClick={this.comfiremSubmit}>添加</button>
                </div>
            </div>
        );
    }
}




