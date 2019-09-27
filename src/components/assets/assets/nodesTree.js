import React, {Component} from 'react';
import {Tree, Icon, Modal, message,} from 'antd';
import AssetSelect from "./assetSelect";
import {fetchDatas, postDatas, patchDatas, deleteDatas} from "../../../common/apiManager";
import Config from "../../../config/config";

const {TreeNode} = Tree;

class NodesTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opearteVisiable: false,
            expandedKeys: [],
            treeData: [],
            top: 0,
            selectItem: {},
            drawerVisible: false,
            asset: [],
            openFrom: "",
            deleteAble: false
        };
        this.treeData = this.state.treeData;
        this.expandedKeys = [];
        this.switchOffOpearte.bind(this);
    }

    componentWillMount() {
        this.getTreeDatas();
    }

    componentDidMount() {
        // 手动触发，否则会遇到第一次添加子节点不展开的Bug
        this.onExpand([]);
        window.addEventListener('click', this.switchOffOpearte)
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.switchOffOpearte)
    }

    /**获得数据**/
    getTreeDatas = () => {
        /** //assets/v1/nodes/children/tree/?assets=0&all=1**/
        fetchDatas(`/assets/v1/nodes/children/tree/?assets=0&all=1`, result => {
            let treeData = [];
            result.map((item, index) => {
                let Node = item.meta.node;
                let obj = {
                    id: Node.id,
                    key: Node.key,
                    amount: Node["assets_amount"],
                    value: Node.value,
                    defaultValue: Node.value,
                    isEditable: false,
                    children: []
                };
                if (index === 0) {
                    treeData.push(obj)
                } else {
                    treeData[0].children.push(obj)
                }
            });
            this.treeData = treeData;
            this.setState({
                treeData: this.treeData,
            });
            this.onExpand([treeData[0].id]);
        });
    };

    /**展开节点**/
    onExpand = (expandedKeys) => {
        this.switchOffOpearte();
        this.expandedKeys = expandedKeys;
        this.setState({expandedKeys: expandedKeys});
    };
    /**渲染节点**/
    renderTreeNodes = data => data.map((item) => {
        if (item.isEditable) {
            item.title = (
                <div id={item.key}>
                    <input className="editInput"
                           value={item.value}
                           onChange={(e) => this.onChange(e, item.id)}/>
                    <Icon type='close'
                          onClick={() => this.onClose(item.id, item.defaultValue)}/>
                    <Icon type='check' onClick={() => this.onSave(item.id)}/>
                </div>
            );
        } else {
            item.title = (
                <div id={item.key}>
                    <span >{`${item.value}(${item.amount})`}</span>
                </div>
            )
        }

        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.id} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }

        return <TreeNode {...item} id={item.key}/>;
    });

    /**异步加载节点数据**/
    onLoadData = treeNode =>
        new Promise(resolve => {
            fetchDatas(`/assets/v1/nodes/children/tree/?assets=0&all=1&key=${treeNode.props.dataRef.key}`, result => {
                console.log("treeNode", result);
                let treeData = [];
                result.map((item, index) => {
                    let Node = item.meta.node;
                    if (treeNode.props.dataRef.key !== Node.key) {
                        let obj = {
                            id: Node.id,
                            key: Node.key,
                            amount: Node["assets_amount"],
                            value: Node.value,
                            defaultValue: Node.value,
                            isEditable: false,
                            children: []
                        };
                        treeData.push(obj)
                    }
                });
                treeNode.props.dataRef.children = treeData;
                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            });
        });

    /**添加**/
    onAdd = (e) => {
        this.switchOffOpearte();
        // 防止expandedKeys重复
        // Tip: Must have, expandedKeys should not be reduplicative
        if (this.state.expandedKeys.indexOf(this.state.selectItem) === -1) {
            this.expandedKeys.push(this.state.selectItem);
        }
        this.addNode(this.state.selectItem, this.treeData);
    };
    /**添加节点**/
    addNode = (key, data) => data.map((item) => {
        if (item.id === key) {
            let params = {value: `New Node ${item["children"].length + 1}`};
            postDatas(`/assets/v1/nodes/${item.id}/children/`, params).then((result => {
                if (result && result instanceof Object) {
                    let OBJ = {
                        id: result.id,
                        key: result.key,
                        title: result["assets_amount"],
                        value: result.value,
                        defaultValue: result.value,
                        isEditable: false,
                        children: []
                    };
                    if (item.children) {
                        item.children.push(OBJ);
                    } else {
                        item.children = [];
                        item.children.push(OBJ);
                    }
                    this.setState({
                        expandedKeys: this.expandedKeys,
                        treeData: this.treeData
                    });
                    return;
                }
            }));
        }
        if (item.children) {
            this.addNode(key, item.children)
        }
    });

    /**删除**/
    onDelete = () => {
        this.switchOffOpearte();
        deleteDatas(`/assets/v1/nodes/${this.state.selectItem}/`).then((result) => {
            if (result) {
                this.deleteNode(this.state.selectItem, this.treeData);
            }
        });
    };
    /**删除节点**/
    deleteNode = (key, data) => data.map((item, index) => {
        if (item.id === key) {
            data.splice(index, 1);
            message.success("删除成功！");
            return;
        } else {
            if (item.children) {
                this.deleteNode(key, item.children)
            }
        }
        this.setState({
            treeData: this.treeData
        });
    });

    /**编辑**/
    onEdit = () => {
        this.switchOffOpearte();
        this.editNode(this.state.selectItem, this.treeData);
        this.setState({
            treeData: this.treeData
        });
    };
    /**编辑节点**/
    editNode = (key, data) => data.map((item) => {
        item.isEditable = item.id === key;
        // 当某节点处于编辑状态，并改变数据，点击编辑其他节点时，此节点变成不可编辑状态，value 需要回退到 defaultvalue
        item.value = item.defaultValue;
        if (item.children) {
            this.editNode(key, item.children)
        }
    });

    /**取消修改**/
    onClose = (key, defaultValue) => {
        this.switchOffOpearte();
        this.closeNode(key, defaultValue, this.treeData);
        this.setState({
            treeData: this.treeData
        });
    };

    /**取消修改**/
    closeNode = (key, defaultValue, data) => data.map((item) => {
        item.isEditable = false;
        if (item.id === key) {
            item.value = defaultValue;
        }
        if (item.children) {
            this.closeNode(key, defaultValue, item.children)
        }
    });

    /**保存修改数据**/
    onSave = (key) => {
        this.switchOffOpearte();
        this.saveNode(key, this.treeData);
    };
    /**保存修改数据**/
    saveNode = (key, data) => data.map((item) => {
        if (item.id === key) {
            let params = {value: item.value};
            patchDatas(`/assets/v1/nodes/${key}/`, params).then((result) => {
                if (result && result instanceof Object) {
                    message.success("编辑成功！");
                    item.defaultValue = item.value;
                    this.setState({
                        treeData: this.treeData
                    });
                }
            });
        }
        if (item.children) {
            this.saveNode(key, item.children)
        }
        item.isEditable = false;
    });

    /**修改后给节点赋值 **/
    onChange = (e, key) => {
        this.switchOffOpearte();
        this.changeNode(key, e.target.value, this.treeData);
        this.setState({
            treeData: this.treeData
        });
    };
    /**修改后给节点赋值**/
    changeNode = (key, value, data) => data.map((item) => {
        if (item.id === key) {
            item.value = value;
        }
        if (item.children) {
            this.changeNode(key, value, item.children)
        }
    });

    /**操作选项开关**/
    switchOffOpearte = () => {
        this.setState({
            opearteVisiable: false,
        });
    };
    /**点击选中树节点，改变表格资产数据**/
    selectNodeCheckAsset = (selectedKeys, info) => {
        this.switchOffOpearte();
        let assetId = info.node.props.dataRef.id;
        this.props.fetchAssetUnderNode(assetId);
    };
    /**添加资产到节点**/
    addToSsset = () => {
        this.switchOffOpearte();
        this.setState({
            drawerVisible: true,
            openFrom: "addToSsset"
        });
    };
    /**移动到资产节点**/
    moveToAssetNode = () => {
        this.switchOffOpearte();
        this.setState({
            drawerVisible: true,
            openFrom: "moveToAssetNode"
        });
    };
    /**更新节点资产硬件信息**/
    upDateNodeAssetInfo = () => {
        this.switchOffOpearte();
        fetchDatas(`/assets/v1/nodes/${this.state.selectItem}/refresh-hardware-info/`, result => {
            window.open(`${Config.api}/ops/celery/task/${result["task"]}/log/`, '测试可链接性', 'height=500, width=800');
        });
    };
    /**测试节点资产可连接性**/
    testAssetConnectivity = () => {
        this.switchOffOpearte();
        fetchDatas(`/assets/v1/nodes/${this.state.selectItem}/test-connective/`, result => {
            window.open(`${Config.api}/ops/celery/task/${result["task"]}/log/`, '测试可链接性', 'height=500, width=800');
        });
    };
    /**刷新所有节点资产数量**/
    refreshAllNodeAsset = () => {
        this.switchOffOpearte();
        fetchDatas(`/assets/v1/nodes/refresh-assets-amount/`, result => {
            this.props.getTableDatas();
            message.success("刷新成功！");
            this.getTreeDatas();
            // window.location.reload();
        });
    };
    /**显示所有节点资产**/
    onlyShowCurrentNodeAsset = () => {
        this.switchOffOpearte();
        fetchDatas(`/assets/v1/nodes/children/tree/?assets=0&all=1`, result => {
            this.props.getTableDatas();
            message.success("操作成功！");
        });
    };
    /**关闭模态框**/
    onDrawerClose = () => {
        this.setState({
            drawerVisible: false,
            openFrom: ""
        });
    };
    /**监控select**/
    handleSelectChange = (value, name) => {
        this.setState({
            [name]: value
        });
    };
    /**右键点开，打开操作选项**/
    rightClickSelectNode = (selectedKeys) => {
        let eleId = selectedKeys.node.props.dataRef.key;
        let item = selectedKeys.node.props.dataRef.id;
        let element = document.getElementById(eleId);
        let Top = element.offsetTop;
        this.setState({
            top: Top - 5,
            opearteVisiable: !this.state.opearteVisiable,
            selectItem: item,
            deleteAble: selectedKeys.node.props.children.length <= 0
        });
    };

    render() {
        let {treeData, expandedKeys, opearteVisiable, drawerVisible, top, openFrom, selectItem, deleteAble} = this.state;
        let {visible} = this.props;
        return (
            <div className="viewTree">
                {
                    visible ?
                        <div className="treeContent displayflexstart">
                            <Tree expandedKeys={expandedKeys}
                                onSelect={this.selectNodeCheckAsset}
                                onRightClick={this.rightClickSelectNode}
                                loadData={this.onLoadData}
                                onExpand={this.onExpand}
                            >
                                {this.renderTreeNodes(treeData)}
                            </Tree>
                            {
                                opearteVisiable ?
                                    <ul className="tree-opearte" style={{top: `${top}px`}}>
                                        <li onClick={this.onAdd}><Icon type="plus-square"/>新建节点</li>
                                        <li onClick={this.onEdit}><Icon type="form"/>重命名节点</li>
                                        {deleteAble ?
                                            <li onClick={this.onDelete} className="hr-line"><Icon type="minus-square"/>删除节点
                                            </li>
                                            : null
                                        }
                                        <li onClick={this.addToSsset}><Icon type="copy" theme="filled"/>添加资产到节点</li>
                                        <li onClick={this.moveToAssetNode} className="hr-line">
                                            <Icon type="close-square" theme="filled"/>移动资产到节点
                                        </li>
                                        <li onClick={this.upDateNodeAssetInfo}>
                                            <Icon type="interaction" theme="filled"/>更新节点资产硬件信息
                                        </li>
                                        <li onClick={this.testAssetConnectivity} className="hr-line">
                                            <Icon type="delete" theme="filled"/>测试节点资产可连接性
                                        </li>
                                        <li onClick={this.refreshAllNodeAsset}><Icon type="api" theme="filled"/>刷新所有节点资产数量
                                        </li>
                                        <li onClick={this.onlyShowCurrentNodeAsset}><Icon type="read" theme="filled"/>显示所有节点资产
                                        </li>
                                    </ul> : null
                            }
                        </div>
                        : null
                }
                <Modal title="请选择资产"
                       wrapClassName="wrap_for_create"
                       style={{top: 10}}
                       width="95vw"
                       destroyOnClose={true}
                       footer={null}
                       onOk={this.handleOk}
                       onCancel={this.onDrawerClose}
                       maskClosable={false}
                       visible={drawerVisible}>
                    <AssetSelect onDrawerClose={this.onDrawerClose}
                                 selectItem={selectItem}
                                 openFrom={openFrom}/>
                </Modal>
            </div>
        )
    }
}

export default NodesTree;