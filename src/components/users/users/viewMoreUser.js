import React from 'react';
import {Icon,Table, Tabs,} from 'antd';
import {fetchDatas} from "../../../common/apiManager";
import {tableConfig} from "../../../common/tableHeader";

const TabPane = Tabs.TabPane;

export default class CommandFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewtree: false,
            isLoading:false,
        };
        this.columns = [
            {
                title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
                    return (index + 1)
                }
            },
            {title: '主机名', dataIndex: 'hostname',},
            {title: 'IP', dataIndex: 'ip'},
            {
                title: '激活中', dataIndex: 'is_active', render: (text) => {
                    return text ? <Icon type="check"/> : <Icon type="close"/>
                }
            },
            {title: '系统用户', dataIndex: 'system_users_join'},
        ];
    }

    componentDidMount() {
        this.getTableDatas();
    }
    /**获得表格数据**/
    getTableDatas = () => {
        this.setState({isLoading:true});
        setTimeout(()=>{
            fetchDatas(`/perms/v1/user/${this.props.record.id}/assets/`,result => {
                this.setState({isLoading:false});
                this.setState({
                    tableDatas: result,
                });
            });
        },500)
    };

    render() {
        const {tableDatas,isLoading} = this.state;
        return (
            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                <TabPane tab="授权资产" key="1">
                    <Table rowKey="id"
                           size={tableConfig.size}
                           scroll={tableConfig.scroll}
                           pagination={tableConfig.pagination}
                           bordered={tableConfig.bordered}
                           loading={isLoading}
                           dataSource={tableDatas}
                           columns={this.columns}
                           // expandedRowRender={record =>
                           //     <AssetDetail record={record}
                           //                  reloadData={this.getTableDatas}/>
                           // }
                    />
                </TabPane>
            </Tabs>
        );
    }
}
