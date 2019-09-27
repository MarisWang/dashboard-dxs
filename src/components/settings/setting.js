import React, {Component} from 'react';
import BasicSetting from "./basicSetting";
import EmailSetting from "./emailSetting";
import EmailContentSetting from "./emailContentSetting";
import LdapSetting from "./ldapSetting";
import SecuritySetting from "./securitySetting";
import TerminalSetting from "./terminalSetting";
import {Tabs} from "antd";

const {TabPane} = Tabs;

export default class Setting extends Component {
    render() {
        return (
            <div className="wrapper">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="基本设置" key="1">
                        <BasicSetting/>
                    </TabPane>
                    <TabPane tab="邮件设置" key="2">
                        <EmailSetting/>
                    </TabPane>
                    <TabPane tab="邮件内容设置" key="3">
                        <EmailContentSetting/>
                    </TabPane>
                    <TabPane tab="LDAP设置" key="4">
                        <LdapSetting/>
                    </TabPane>
                    <TabPane tab="终端设置" key="5">
                        <TerminalSetting/>
                    </TabPane>
                    <TabPane tab="安全设置" key="6">
                        <SecuritySetting/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
};
