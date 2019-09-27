import React from 'react';
import {Tabs, Select, message} from 'antd';
import {createOptions} from "../../../common/common";
import {getNodesSelectOptions, patchDatas} from "../../../common/apiManager";
import moment from "moment";

const TabPane = Tabs.TabPane;

export default class SystemUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assetNodeLists: [],
            nodes: [],
        };
    }

    componentDidMount() {
        this.getSelectOptions();
    }

    /**资产列表**/
    getSelectOptions = () => {
        /**节点**/
        getNodesSelectOptions(assetNodeLists =>
            this.setState({
                assetNodeLists,
            }),
        );
    };
    /**监控复选框事件**/
    handleSelectChange = (value, role) => {
        this.setState({
            [role]: value
        });
    };
    /**替换节点**/
    replaceNode = () => {
        let {nodes} = this.state;
        let data = {nodes:nodes};
        if (nodes !== []) {
            patchDatas(`/assets/v1/admin-user/${this.props.record.id}/nodes/`, data).then((result => {
                if (result && result instanceof Object) {
                    this.setState({nodes:[]});
                    message.success("节点替换成功！");
                }
            }));
        } else {
            message.error("没有选中的节点！")
        }
    };

    render() {
        let {assetNodeLists,nodes} = this.state;
        let {record} = this.props;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="详情" key="1">
                    <ul className="displayflexbetween detailUlList">
                        <li><span>创建日期：</span>{moment(record.email).format('LLL')}</li>
                    </ul>
                    <div className="displayflexstart">
                        <h4>替换资产管理员 : &nbsp;&nbsp;&nbsp;</h4>
                        <Select mode="tags"
                                className="multipleSelection"
                                style={{width:"260px"}}
                                value={nodes}
                                onChange={(value) => this.handleSelectChange(value, "nodes")}>
                            {createOptions(assetNodeLists)}
                        </Select>
                        <button className="small-button" onClick={this.replaceNode}>替换</button>
                    </div>
                    <br/>
                </TabPane>
            </Tabs>
        );
    }
}
