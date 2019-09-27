import React from 'react';
import {Select, message, Tree} from "antd";
import {fetchDatas, getAssetsSelectOptions} from "../../../common/apiManager";
import {createOptions, toTreeData} from "../../../common/common";
import {Terminal} from 'xterm'

let term = new Terminal();
const {TreeNode} = Tree;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systemUser:[],
            systemUserList: [],
            treeData: [],
            expandedKeys: [],/**展开的节点**/
            // selectedKeys: [],/**多选选中的节点**/
            checkedKeys: [],/**多选选中的节点**/
        };
    }

    componentWillMount() {
        this.getSelectOptions();
        this.getTreeDatas();
    }

    componentDidMount() {
        this.onExpand([]);
    }

    /**获取下拉列表选项**/
    getSelectOptions = () => {
        /**系统用户**/
        fetchDatas("/users/v1/users/system-users/",result => {
            let systemUserList = result.data;
            let Lists = [];
            for (let item in systemUserList) {
                Lists.push({
                    name: systemUserList[item]["system_user_name"],
                    id: systemUserList[item]["system_user_id"]
                });
            }
            this.setState({
                    systemUserList:Lists,
                })
            }
        );
    };
    /**获得树形图数据**/
    getTreeDatas = () => {
        ///perms/v1/users/nodes-assets/tree/?cache_policy=1&system_user=${systemUser}
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
    /**监控复选框事件**/
    handleSelectChange = (value, role) => {
        this.getTreeDatas(value);
        this.setState({
            [role]: value
        });
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**运行命令行**/
    runFakeTerminal = () => {
        if (term._initialized) {
            return;
        }
        term._initialized = true;
        term.prompt = () => {
            term.write('\r\n$ ');
        };
        let {checkedKeys} = this.state;
        term.writeln(`已选择资产;${checkedKeys}`);
        term.writeln(`总共：${checkedKeys.length}`);
        term.writeln('');
        term.prompt();

        term.on('key', function (key, ev) {
            const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
            if (ev.keyCode === 13) {
                term.prompt();
            } else if (ev.keyCode === 8) {
                // Do not delete the prompt
                if (term._core.buffer.x > 2) {
                    term.write('\b \b');
                }
            } else if (printable) {
                term.write(key);
            }
        });
        term.on('paste', function (data) {
            term.write(data);
        });
    };
    /**执行**/
    execute = () => {
        let {checkedKeys,systemUser} = this.state;
        if (checkedKeys.length !== 0 && systemUser.length !== 0) {
            term.open(document.getElementById('command'));
            this.runFakeTerminal();
        } else {
            message.error("请选择资产和系统用户!");
        }
    };
    /**树节点的多选**/
    onCheck = checkedKeys => {
        this.setState({checkedKeys});
    };

    render() {
        let {treeData, expandedKeys, systemUserList} = this.state;
        return (
            <div className="wrapper">
                <div className="displayflexbetween" style={{alignItems: "flex-start"}}>
                    <Tree expandedKeys={expandedKeys}
                          checkable
                          onCheck={this.onCheck}
                          onExpand={this.onExpand}>
                        {this.renderTreeNodes(treeData)}
                    </Tree>
                    <div style={{width: "calc(100% - 420px)"}}>
                        <div id="command"/>
                        <br/>
                        <div className="displayflexbetween jobCenterCommandContent">
                            <textarea className="jobCenterCommand" autoFocus={true}/>
                            <div className="displayflexstart command">
                                <span className="form_text required">系统用户</span>
                                <Select size="default"
                                        style={{width: "300px"}}
                                        onChange={(value) => this.handleSelectChange(value, "systemUser")}>
                                    {createOptions(systemUserList)}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="displayflexend form-btns">
                    <button onClick={this.execute}>执行</button>
                </div>
                <br/>
            </div>
        );
    }
}