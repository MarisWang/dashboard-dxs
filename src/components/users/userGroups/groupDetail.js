import React from 'react';
import {message, Select, Tabs, Tag} from 'antd';
import {fetchDatas, getUserSelectOptions, patchDatas} from "../../../common/apiManager";
import {createOptions} from "../../../common/common";

const TabPane = Tabs.TabPane;

export default class GroupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOptions: [],
            users: [],
        };
    }
    componentWillMount() {
        this.getSelectOptions();
    }

    /**获得下拉选项和标签项**/
    getSelectOptions = () => {
        //获取当前数据
        fetchDatas(`/users/v1/groups/${this.props.record.id}`, result => {
            this.setState({
                users: result.users
            })
        });
        getUserSelectOptions(selectOptions => {
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
        let data = {users: this.state.users};
        patchDatas(`/users/v1/groups/${id}/users/`, data).then((result => {
            if (result && result instanceof Object) {
                this.props.reloadData();
                message.success("修改成功!");
            }
        }));
    };

    render() {
        let {users, selectOptions} = this.state;
        let {record} = this.props;
        return (
            <Tabs defaultActiveKey={"1"}>
                <TabPane tab="详情" key="1">
                    <div className="displayflexstart">
                        <h4>添加用户 : &nbsp;&nbsp;&nbsp;</h4>
                        <Select mode="tags"
                                size="default"
                                className="multipleSelection"
                                value={users}
                                onChange={(value) => this.handleSelectChange(value, "users")}>
                            {createOptions(selectOptions)}
                        </Select>
                        <button className="small-button" onClick={this.addSeletedItem}>保存</button>
                    </div>
                    <br/>
                    <div className="displayflexstart">
                        {
                            record.users.map((item, index) =>
                                <Tag key={index} color="#108ee9">{item}</Tag>
                            )
                        }
                    </div>
                    <br/>
                </TabPane>
            </Tabs>
        )
    }
}
