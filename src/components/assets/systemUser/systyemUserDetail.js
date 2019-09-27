import React from 'react';
import {Tabs, Switch,message} from 'antd';
import {fetchDatas, patchDatas} from "../../../common/apiManager";

const TabPane = Tabs.TabPane;

export default class SystemUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    /**表格详情中，自动推送:**/
    autoPush = (checked) => {
        let data = {'auto_push': checked};
        patchDatas(`/assets/v1/system-user/${this.props.record.id}/`, data).then((result => {
            if (checked) {
                message.success("激活成功！")
            } else {
                message.success("已取消激活！")
            }
        }))
    };
    /**立刻推送系统:**/
    pushRightAway = () => {
        fetchDatas(`/assets/v1/system-user/${this.props.record.id}/push/`,result => {
            message.success("推送成功！")
        })
    };

    render() {
        let {record} = this.props;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="详情" key="1">
                    <ul className="displayflexbetween detailList">
                        <li><span>Shell:</span>{record["shell"]}</li>
                        <li><span>Sudo:</span>{record["sudo"]}</li>
                        <li><span>备注:</span>{record["comment"]}</li>
                        <li><span>资产:</span>{record["assets_amount"]}</li>
                        <li><span>可连接:</span>{record["reachable_amount"]}</li>
                        <li><span>不可达:</span>{record["unreachable_amount"]}</li>
                        <li><span>创建日期:</span>{record["name"]}</li>
                        <li><span>创建者:</span>{record["name"]}</li>
                        <li><span>立刻推送系统:</span>
                            <button className="small-button" onClick={this.pushRightAway}>推送</button>
                        </li>
                        <li>
                            <span>自动推送:</span>
                            <Switch checkedChildren="OFF"
                                    unCheckedChildren="ON"
                                    onChange={this.autoPush}
                                    checked={record["auto_push"]}
                                    size={"small"}/>
                        </li>
                    </ul>
                    <br/>
                </TabPane>
            </Tabs>
        );
    }
}
