import React from 'react';
import {Tabs,} from 'antd';
import EntryRule from "../viewMorePages/entryRules/entryrule";
import Ipsets from "../viewMorePages/ipsets/ipsets";
import OutboundRule from "../viewMorePages/outBoundRules/outboundrule";

const TabPane = Tabs.TabPane;

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="入口规则" key="1">
                    <EntryRule record={this.props.record}/>
                </TabPane>
                <TabPane tab="出口规则" key="2">
                    <OutboundRule record={this.props.record}/>
                </TabPane>
                <TabPane tab="IPsets" key="3">
                    <Ipsets record={this.props.record}/>
                </TabPane>
            </Tabs>
        );
    }
}
