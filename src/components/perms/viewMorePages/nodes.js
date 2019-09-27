import React from 'react';
import {Icon, Table, Popconfirm, Select, message} from 'antd';
import {patchDatas, getNodesSelectOptions} from "../../../common/apiManager";
import {createOptions} from "../../../common/common";
import {tableConfig} from "../../../common/tableHeader";

export default class AdminAuthorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeLists: [],
            nodeListTags: [],
            isLoading: false,
            selectedItem: ""
        };
        this.columns = [
            {
                title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
                    return (index + 1)
                }
            },
            {title: '名称', dataIndex: 'name'},
            {title: '用户名', dataIndex: 'text'},
            {
                title: '动作', width: "120px", dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <div>
                            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                                <Icon type="delete" theme="filled"/>
                            </Popconfirm>
                        </div>
                    );
                }
            }
        ]
    }

    componentWillMount() {
        this.getSelectOptions();
    }

    /**选择用户**/
    getSelectOptions = () => {
        let {record, nodeLists} = this.props;
        let nodeListTags = [];
        let nodes = record.nodes;
        /**已经添加的标签选项，根据groups_display的数据，和optionsList对比，相同的在optionsList删除，生成tagList**/
        for (let i = 0; i < nodes.length; i++) {
            let findObj = nodeLists.find(x => x.id === nodes[i]);
            if (findObj) {
                nodeListTags.push(findObj);
                nodeLists = nodeLists.filter(x => x.id !== nodes[i]);
            }
        }
        this.setState({
            nodeListTags,
            nodeLists
        });
    };
    /**添加**/
    addSeletedItem = () => {
        this.setState({isLoading: true});
        let nodes = this.props.record.nodes;
        let {selectedItem} = this.state;
        nodes.push(selectedItem);
        let data = {nodes: nodes};
        setTimeout(() => {
            patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/`, data).then((result => {
                if (result && result.msg === "ok") {
                    this.setState({isLoading: false});
                    this.props.reloadData();
                    message.success("添加成功！");
                    this.props.onCancel()
                }
            }));
        }, 500);
        this.getSelectOptions();
    };
    /**删除**/
    handleDelete = (id) => {
        this.setState({isLoading: true});
        let nodes = this.props.record.nodes;
        let node = nodes.filter(x => x !== id);
        let data = {nodes: node};
        setTimeout(() => {
            patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/`, data).then((result => {
                this.setState({isLoading: false});
                if (result) {
                    this.props.reloadData();
                    message.success("删除成功！");
                    this.props.onCancel();
                }
            }));
        }, 500);
    };

    /**选中要添加的选项**/
    onSelectChange = value => {
        this.setState({
            selectedItem: value
        })
    };

    render() {
        let {nodeLists, nodeListTags, isLoading} = this.state;
        return (
            <div>
                <div className="displayflexstart">
                    <h4>添加节点 : &nbsp;&nbsp;&nbsp;</h4>
                    <Select showSearch
                            style={{width: 240}}
                            optionFilterProp="children"
                            onChange={this.onSelectChange}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {createOptions(nodeLists)}
                    </Select>
                    <button className="small-button" onClick={this.addSeletedItem}>添加</button>
                </div>
                <br/>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={nodeListTags}
                       columns={this.columns}/>
            </div>
        );
    }
}
