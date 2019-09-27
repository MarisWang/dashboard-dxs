import React from 'react';
import {Icon, message, Popconfirm, Select, Table} from 'antd';
import {subIptableStatus, tableConfig} from "../../../../common/tableHeader";
import {fetchDatas, getAssetsSelectOptions, patchDatas} from "../../../../common/apiManager";
import {createOptions} from "../../../../common/common";

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            assetLists: [],
            securitygroup: [],
            assets: []
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
        this.getSelectOptions();
    }

    /**表格头部**/
    pushOperationControl = () => {
        const operation = {
            title: '动作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Popconfirm title="确定从安全组删除吗?" onConfirm={() => this.handleDelete(record.id)}>
                            <Icon type="delete" theme="filled"/>
                        </Popconfirm>
                    </div>
                );
            }
        };
        let result = subIptableStatus.find(item => item.dataIndex === "operation");
        if (!result) subIptableStatus.push(operation);
    };
    /**表格数据**/
    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/assets/v1/assets/?securitygroup_id=${this.props.record.id}`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500);
    };
    /**获得下拉选项和标签项**/
    getSelectOptions = () => {
        /**标签**/
        getAssetsSelectOptions(assetLists =>
            this.setState({
                assetLists,
            }),
        );
    };
    /**监控复选框事件**/
    handleSelectChange = (value, role) => {
        this.setState({
            [role]: value
        });
    };
    /**添加选中项目**/
    addSeletedItem = () => {
        let data = {assets:this.state.assets};
        patchDatas(`/applications/v1/securitygroups/${this.props.record.id}/`, data).then((result => {
            if (result && result instanceof Object) {
                this.setState({ assets:[]});
                this.getTableDatas();
                message.success("添加成功!");
            } else {
                message.error("添加失败!");
            }
        }))
    };
    /**删除 delete**/
    handleDelete = key => {
        const tableDatas = [...this.state.tableDatas];
        let data = {securitygroup: null};
        patchDatas(`/assets/v1/assets/${key}/`, data).then((result => {
            if (result && result instanceof Object) {
                this.getTableDatas();
                this.setState({tableDatas: tableDatas.filter(item => item.id !== key)});
                message.success("删除成功！");
            } else {
                message.error("删除失败！");
            }
        }));
    };

    render() {
        const {assetLists, tableDatas, isLoading,assets} = this.state;
        return (
            <div>
                <div className="displayflexstart">
                    <h4>安全组 : &nbsp;&nbsp;&nbsp;</h4>
                    <Select mode="tags"
                            className="multipleSelection"
                            value={assets}
                            style={{width: 240}}
                            onChange={(value) => this.handleSelectChange(value, "assets")}>
                        {createOptions(assetLists)}
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
                       dataSource={tableDatas}
                       columns={subIptableStatus}/>
            </div>
        );
    }
}
