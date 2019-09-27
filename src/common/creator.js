import React, {Component} from 'react';
import {Button, Dropdown, Menu, Modal} from "antd";
import UserCreate from "../components/users/users/createUser";
import GroupCreate from "../components/users/userGroups/createUserGroup";
import AdminUserCreate from "../components/assets/adminUser/createAdminUser";
import Asset from "../components/assets/assets/createAsset";
import Command from "../components/assets/commandFilter/createCommand";
import CommandRule from "../components/assets/commandFilter/createCommandRule";
import Domain from "../components/assets/domain/createDomain";
import Gateway from "../components/assets/domain/createGateway";
import Label from "../components/assets/labelManagement/createLabel";
import ServiceCreate from "../components/assets/serviceUser/createServiceUser";
import SystemCreate from "../components/assets/systemUser/createSystemUser";
import SecurityGroups from "../components/iptablesManagement/securityGroup/createSecurityGroups";
import SecurityGroupTem from "../components/iptablesManagement/securityGroupTem/CreateSecurityTem";

import EntryRules from "../components/iptablesManagement/viewMorePages/entryRules/createEntryrule";
import OutBoundRules from "../components/iptablesManagement/viewMorePages/outBoundRules/createOutboundRule";
import CreateIpsets from "../components/iptablesManagement/viewMorePages/ipsets/createIpsets";

import Dashboar from "../components/menu/dashboard/createDashboard";
import NavBar from "../components/menu/navBar/createNavBar";
import AdminAuth from "../components/perms/viewMorePages/createAuth";
import SettingTerminalComand from "../components/settings/createSettingTerminalComand";
import RettingTerminalReplay from "../components/settings/createSettingTerminalReplay";

import ApplyForAuth from "../components/applyForAuth/createApplyForAuth";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    closeDrawer = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        let {hasSelected, selectedRowKeys, keyWord, title} = this.props;
        let {visible} = this.state;
        const createForm = {
            userCreate: <UserCreate onCancel={this.closeDrawer}
                                    reloadData={this.props.reloadData}/>,
            groupCreate: <GroupCreate onCancel={this.closeDrawer}
                                      reloadData={this.props.reloadData}/>,
            asset: <Asset onCancel={this.closeDrawer}
                          reloadData={this.props.reloadData}/>,
            domain: <Domain onCancel={this.closeDrawer}
                            reloadData={this.props.reloadData}/>,
            gateway: <Gateway onCancel={this.closeDrawer}
                              reloadData={this.props.reloadData}/>,
            systemCreate: <SystemCreate onCancel={this.closeDrawer}
                                        reloadData={this.props.reloadData}/>,
            serviceCreate: <ServiceCreate onCancel={this.closeDrawer}
                                          reloadData={this.props.reloadData}/>,
            adminUser: <AdminUserCreate onCancel={this.closeDrawer}
                                        reloadData={this.props.reloadData}/>,
            label: <Label onCancel={this.closeDrawer}
                          reloadData={this.props.reloadData}/>,
            command: <Command onCancel={this.closeDrawer}
                              reloadData={this.props.reloadData}/>,
            commandRule: <CommandRule onCancel={this.closeDrawer}
                                      reloadData={this.props.reloadData}
                                      record={this.props.record}/>,
            adminAuth: <AdminAuth onCancel={this.closeDrawer}
                                  reloadData={this.props.reloadData}
                                  selectdTabkey={this.props.selectdTabkey}/>,

            securityGroups: <SecurityGroups onCancel={this.closeDrawer}
                                            reloadData={this.props.reloadData}/>,
            securityGroupTem: <SecurityGroupTem onCancel={this.closeDrawer}
                                                reloadData={this.props.reloadData}/>,

            entryRules: <EntryRules onCancel={this.closeDrawer}
                                    reloadData={this.props.reloadData}
                                    record={this.props.record}/>,
            outBoundRules: <OutBoundRules onCancel={this.closeDrawer}
                                          reloadData={this.props.reloadData}
                                          record={this.props.record}/>,
            ipsets: <CreateIpsets onCancel={this.closeDrawer}
                                  reloadData={this.props.reloadData}
                                  record={this.props.record}/>,

            dashboard: <Dashboar onCancel={this.closeDrawer}
                                 reloadData={this.props.reloadData}/>,
            navBar: <NavBar onCancel={this.closeDrawer}
                            reloadData={this.props.reloadData}/>,
            settingTerminalCommand: <SettingTerminalComand onCancel={this.closeDrawer}
                                                           reloadData={this.props.reloadData}/>,
            settingTerminalReplay: <RettingTerminalReplay onCancel={this.closeDrawer}
                                                          reloadData={this.props.reloadData}/>,
            applyForAuth: <ApplyForAuth onCancel={this.closeDrawer}
                            reloadData={this.props.reloadData}/>,
        };

        const menu = (
            <Menu>
                <Menu.Item>
                    <div onClick={this.downloadExcel}>导出Excel</div>
                </Menu.Item>
            </Menu>
        );

        return (
            <div>
                <div className="displayflexbetween">
                    <Button type="primary" onClick={this.showDrawer} htmlType={"button"}>{title}</Button>
                </div>
                <Modal title={title}
                       wrapClassName="wrap_for_create"
                       style={{top: 10}}
                       width="95vw"
                       visible={visible}
                       destroyOnClose={true}
                       footer={null}
                       onOk={this.handleOk}
                       onCancel={this.closeDrawer}>
                    {createForm[keyWord]}
                </Modal>
            </div>
        );
    }
}