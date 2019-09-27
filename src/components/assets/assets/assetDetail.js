import React from 'react';
import {Switch, Tabs, message, Select, Tag} from 'antd';
import {fetchDatas, patchDatas, getNodesSelectOptions} from "../../../common/apiManager";
import moment from "moment";
import {createOptions} from "../../../common/common";

const TabPane = Tabs.TabPane;

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOptions: [],
            nodes: [],
            nodes_display: [],
            recordData: {}
        };
    }

    componentWillMount() {
        this.getSelectOptions();
        this.getDefaultNodeValue();
    }

    /**获取节点**/
    getDefaultNodeValue = () => {
        fetchDatas(`/assets/v1/assets-simple/${this.props.record.id}`, result => {
            let nodesObj = [];
            result["nodes_display"].map((item) => {
                nodesObj.push({
                    key: item.id,
                    label: item.name,
                })
            });
            this.setState({
                nodes_display: result["nodes_display"],
                nodes: nodesObj,
                recordData: result
            });
        });
    };

    /**节点管理**/
    getSelectOptions = () => {
        getNodesSelectOptions(selectOptions => {
            this.setState({
                selectOptions
            });
        });
    };

    /**监控复选框事件**/
    handleSelectChange = (value, role) => {
        this.setState({
            [role]: value
        });
    };
    /**添加选中项目**/
    addSeletedItem = () => {
        let {id} = this.props.record;
        let {nodes} = this.state;
        let node = [];
        nodes.map((item) => {
            node.push(item.key)
        });
        nodes = node;
        let data = {nodes: nodes};
        patchDatas(`/assets/v1/assets/${id}/`, data).then((result => {
            if (result && result instanceof Object) {
                this.props.reloadData();
                this.getDefaultNodeValue();
                message.success("修改成功!");
            }
        }))
    };
    /**表格详情中，激活中**/
    activeUserGroup = (checked) => {
        let data = {'is_active': checked};
        patchDatas(`/assets/v1/assets/${this.props.record.id}/`, data).then((result => {
            if (checked) {
                message.success("激活成功！")
            } else {
                message.success("已取消激活！")
            }
        }))
    };
    /**更新硬件信息**/
    updateHardwareInfo = () => {
        fetchDatas(`/assets/v1/assets/${this.props.record.id}/alive/`, result => {
            message.success("更新成功！")
        })
    };

    render() {
        let {nodes, selectOptions, nodes_display, recordData, is_active} = this.state;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="详情" key="1">
                    <ul className="displayflexbetween detailList">
                        <li><span>公网IP：</span>{recordData["public_ip"]}</li>
                        <li><span>协议:</span>{recordData.protocols}</li>
                        <li><span>管理用户:</span>{recordData["admin_user_display"]}</li>
                        <li><span>网域:</span>{recordData["domains_display"]}</li>
                        <li><span>制造商:</span>{recordData["vendor"]}</li>
                        <li><span>型号:</span>{recordData.model}</li>
                        <li><span>CPU::</span>{recordData["cpu_model"]}</li>
                        <li><span>内存:</span>{recordData["memory"]}</li>
                        <li><span>硬盘:</span>{recordData["disk_total"]}</li>
                        <li><span>系统平台:</span>{recordData.platform}</li>
                        <li>
                            <span>操作系统:</span>{recordData["os"] ? `${recordData["os"]} ${recordData["os_version"]} ${recordData["os_arch"]}` : ""}
                        </li>
                        <li><span>序列号:</span>{recordData["sn"]}</li>
                        <li><span>资产编号:</span>{recordData["number"]}</li>
                        <li><span>创建日期:</span>{moment(recordData["date_created"]).format('LLL')}</li>
                        <li><span>备注:</span>{recordData["comment"]}</li>
                        <li>
                            <span>激活中:</span>
                            <Switch checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                    onChange={this.activeUserGroup}
                                    checked={recordData["is_active"]}
                                    size={"small"}/>
                        </li>
                        <li>
                            <span>更新硬件信息:</span>
                            <button className="small-button" onClick={this.updateHardwareInfo}>更新</button>
                        </li>
                    </ul>
                    <div className="displayflexstart">
                        <h4>节点 : &nbsp;&nbsp;&nbsp;</h4>
                        <Select mode="tags"
                                labelInValue
                                size="default"
                                className="multipleSelection"
                                value={nodes}
                                onChange={(value) => this.handleSelectChange(value, "nodes")}>
                            {createOptions(selectOptions)}
                        </Select>
                        <button className="small-button" onClick={this.addSeletedItem}>保存</button>
                    </div>
                    <br/>
                    <div className="displayflexstart">
                        {
                            nodes_display.map((item, index) =>
                                <Tag key={index} color="#108ee9">{item.value}</Tag>
                            )
                        }
                    </div>
                    <br/>
                </TabPane>
            </Tabs>
        );
    }
}

export default EditableTable