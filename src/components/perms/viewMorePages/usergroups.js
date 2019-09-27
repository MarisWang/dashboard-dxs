import React from 'react';
import {Icon, Table, Popconfirm, Select, message} from 'antd';
import {patchDatas, getUserGroupSelectOptions} from "../../../common/apiManager";
import {createOptions} from "../../../common/common";
import {tableConfig} from "../../../common/tableHeader";

export default class AdminAuthorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userGruopOptions: [],
            userGruopTags: [],
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
        let {record,userGruopOptions} = this.props;
        let userGruopTags = [];
        let user_groups = record.user_groups;
        /**已经添加的标签选项，根据groups_display的数据，和optionsList对比，相同的在optionsList删除，生成tagList**/
        for (let i = 0; i < user_groups.length; i++) {
            let findObj = userGruopOptions.find(x => x.id === user_groups[i]);
            if (findObj) {
                userGruopTags.push(findObj);
                userGruopOptions = userGruopOptions.filter(x => x.id !== user_groups[i]);
            }
        }
        this.setState({
            userGruopTags,
            userGruopOptions
        });
    };
    /**添加**/
    addSeletedItem = () => {
        this.setState({isLoading: true});
        let user_groups = this.props.record.user_groups;
        let {selectedItem} = this.state;
        user_groups.push(selectedItem);
        let data = {user_groups: user_groups};
        setTimeout(() => {
            patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/`, data).then((result => {
                this.setState({isLoading: false});
                if (result && result instanceof Object) {
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
        let user_groups = this.props.record.user_groups;
        let userGroups = user_groups.filter(x => x !== id);
        let data = {user_groups: userGroups};
        setTimeout(() => {
            patchDatas(`/perms/v1/asset-permissions/${this.props.record.id}/`, data).then((result => {
                this.setState({isLoading: false});
                this.props.reloadData();
                message.success("删除成功！");
                this.props.onCancel();
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
        let {userGruopOptions, userGruopTags, isLoading} = this.state;
        return (
            <div>
                <div className="displayflexstart">
                    <h4>添加用户组 : &nbsp;&nbsp;&nbsp;</h4>
                    <Select showSearch
                            style={{width: 240}}
                            optionFilterProp="children"
                            onChange={this.onSelectChange}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {createOptions(userGruopOptions)}
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
                       dataSource={userGruopTags}
                       columns={this.columns}/>
            </div>
        );
    }
}
