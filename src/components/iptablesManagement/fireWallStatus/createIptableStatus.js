import React, {Component} from 'react';
import {Tabs} from "antd";
import EntryRules from "../viewMorePages/entryRules/createEntryrule";
import OutboundRule from "../viewMorePages/outBoundRules/createOutboundRule";
import Ipsets from "../viewMorePages/ipsets/createIpsets";

const {TabPane} = Tabs;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="入站规则" key="1">
                    <EntryRules/>
                </TabPane>
                <TabPane tab="出站规则" key="2">
                    <OutboundRule/>
                </TabPane>
                <TabPane tab="IPsets" key="3">
                    <Ipsets/>
                </TabPane>
            </Tabs>
        );
    }
}