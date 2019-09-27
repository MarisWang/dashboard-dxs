import React from 'react';
import {Icon, Table, Popconfirm, Select, message,} from 'antd';
import {patchDatas, getAssetsSelectOptions} from "../../../common/apiManager";
import {createOptions} from "../../../common/common";
import {tableConfig} from "../../../common/tableHeader";

export default class AdminAuthorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assetListOptions: [],
            assetListTags: [],
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

    /**选择资产**/
    getSelectOptions = () => {
        let {record,assetListOptions} = this.props;
        let assetListTags = [];
        let assets = record.assets;
        /**已经添加的标签选项，根据groups_display的数据，和optionsList对比，相同的在optionsList删除，生成tagList**/
        for (let i = 0; i < assets.length; i++) {
            let findObj = assetListOptions.find(x => x.id === assets[i]);
            if (findObj) {
                assetListTags.push(findObj);
                assetListOptions = assetListOptions.filter(x => x.id !== assets[i]);
            }
        }
        this.setState({
            assetListTags,
            assetListOptions
        });
    };

    /**添加**/
    addSeletedItem = () => {
        this.setState({isLoading: true});
        let {selectedItem} = this.state;
        let assets = this.props.record.assets;
        assets.push(selectedItem);
        let data = {assets: assets};
        setTimeout(() => {
            patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/asset/add/`, data).then((result => {
                this.setState({isLoading: false});
                if (result && result.msg === "ok") {
                    this.props.reloadData();
                    message.success("添加成功！");
                    // this.props.onCancel()
                }
            }));
        }, 500);
        this.getSelectOptions();
    };
    /**删除**/
    handleDelete = (id) => {
        this.setState({isLoading: true});
        let data = {assets: id.split(",")};
        setTimeout(() => {
            patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/asset/remove/`, data).then((result => {
                this.setState({isLoading: false});
                if (result && result.msg === "ok") {
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
        let {assetListOptions, assetListTags, isLoading} = this.state;
        return (
            <div>
                <div className="displayflexstart">
                    <h4>添加资产 : &nbsp;&nbsp;&nbsp;</h4>
                    <Select showSearch
                            style={{width: 240}}
                            optionFilterProp="children"
                            onChange={this.onSelectChange}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {createOptions(assetListOptions)}
                    </Select>
                    <button className="small-button" onClick={() => this.addSeletedItem("assets_add")}>添加</button>
                </div>
                <br/>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={assetListTags}
                       columns={this.columns}/>
            </div>
        );
    }
}
