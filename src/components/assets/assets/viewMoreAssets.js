import React from 'react';
import {Table, Tabs,} from 'antd';
import {assetAuthorizationHeader, assetUserHeader,tableConfig} from "../../../common/tableHeader";
import {fetchDatas} from "../../../common/apiManager";

const TabPane = Tabs.TabPane;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            privilegeUserLists: [],
            assetAuthorizationLists: [],
            assetUserLists: [],
            optionsList: [],
            tagList: [],
            isLoading:false
        };
    }

    componentDidMount() {
        this.getTableDatas();
    }

    getTableDatas = () => {
        this.setState({isLoading: true});
        let openRow = this.props.record.id;
        setTimeout(()=>{
            // //有权限用户 和 资产用户列表
            // fetchDatas(`/perms/v1/asset-permissions/user/?asset_id=${openRow}&created_by=admin`, result => {
            //     this.setState({
            //         isLoading: false,
            //         privilegeUserLists: result["perms_users"],
            //         assetUserLists: result["system_users"]
            //     });
            // });
            //资产授权
            fetchDatas(`/perms/v1/asset-permissions/?asset_id=${openRow}`, result => {
                this.setState({
                    isLoading: false,
                    assetAuthorizationLists: result
                });
            });
            //资产用户列表
            fetchDatas(`/assets/v1/asset-user/?asset_id=${openRow}`, result => {
                this.setState({
                    isLoading: false,
                    assetUserLists: result
                });
            });
        },500)
    };

    render() {
        let {privilegeUserLists, assetAuthorizationLists, assetUserLists,isLoading} = this.state;
        return (
            <Tabs defaultActiveKey="1">
                {/*<TabPane tab="有权限用户" key="1">*/}
                {/*    <Table rowKey="id"*/}
                {/*           size={tableConfig.size}*/}
                {/*           scroll={tableConfig.scroll}*/}
                {/*           pagination={tableConfig.pagination}*/}
                {/*           bordered={tableConfig.bordered}*/}
                {/*           loading={isLoading}*/}
                {/*           dataSource={privilegeUserLists}*/}
                {/*           columns={privilegeUserHeader}*/}
                {/*           expandedRowRender={record => <UserDetail record={record} reloadData={this.getTableDatas}/>}/>}*/}
                {/*    />*/}
                {/*</TabPane>*/}
                <TabPane tab="资产用户列表" key="1">
                    <Table rowKey="id"
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={assetUserLists}
                           columns={assetUserHeader}
                    />
                </TabPane>
                <TabPane tab="资产授权" key="2">
                    <Table rowKey="id"
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={assetAuthorizationLists}
                           columns={assetAuthorizationHeader}
                           // expandedRowRender={record => <AdminDetail record={record}/>}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
