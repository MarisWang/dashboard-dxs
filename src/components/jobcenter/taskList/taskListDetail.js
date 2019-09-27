import React from 'react';
import {Tabs} from "antd";
import moment from "moment";

const TabPane = Tabs.TabPane;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    render() {
        let {record} = this.props;
        return (
            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                <TabPane tab="详情" key="1">
                    <ul className="displayflexbetween detailList">
                        <li><span>版本数量:</span>{record["versions"]}</li>
                        <li><span>最新版本:</span> {record["latest_version"]}</li>
                        <li><span>日期：</span>{moment(record["date_created"]).format('LLL')}</li>
                        <li><span>版本：</span> {record["versions"]}</li>
                        <li><span>主机：</span> {record["hosts"]}</li>
                        {/*<li><span>运行时间:</span>{record["time"]}</li>*/}
                        <li><span>是否完成:</span>{record["is_finished"] ? "是" : "否"}</li>
                        <li><span>最后运行:</span>{record["date_created"]}</li>
                        <li>内容:{record["contents"]}</li>
                    </ul>
                    <br/>
                    <h4 style={{textAlign: "left",color:"#08aafb"}}>最后运行成功主机</h4>
                    {
                        record["success_hosts"] ? record["success_hosts"].map((item, index) =>
                            <p key={index} style={{textAlign: "left"}}>{item}</p>
                        ) : <p style={{textAlign: "left"}}>没有主机</p>
                    }
                    <h4 style={{textAlign: "left",color:"#08aafb"}}>最后运行失败主机</h4>
                    {
                        record["failed_hosts"] ? record["failed_hosts"].map((item, index) =>
                            <p key={index} style={{textAlign: "left"}}>{item}</p>
                        ) : <p style={{textAlign: "left"}}>没有主机</p>
                    }
                </TabPane>
            </Tabs>
        );
    }
}
