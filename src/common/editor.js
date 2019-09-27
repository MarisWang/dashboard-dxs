import React, {Component} from 'react';
import {Icon, Modal, Tooltip} from "antd";
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
import SystemCreate from "../components/assets/systemUser/editSystenUser";
import IptableStatus from "../components/iptablesManagement/fireWallStatus/createIptableStatus";
import SecurityGroups from "../components/iptablesManagement/securityGroup/createSecurityGroups";
import SecurityGroupTem from "../components/iptablesManagement/securityGroupTem/CreateSecurityTem";
import CreateDashboard from "../components/menu/dashboard/createDashboard";
import NavBar from "../components/menu/navBar/createNavBar";
import AdminAuth from "../components/perms/viewMorePages/createAuth";
import SessionTerminal from "../components/sessions/terminal/createTerminal";
import EntryRules from "../components/iptablesManagement/viewMorePages/entryRules/editEntryRule";
import Ipsets from "../components/iptablesManagement/viewMorePages/ipsets/editIpsets";
import OutBoundRules from "../components/iptablesManagement/viewMorePages/outBoundRules/editOutBoundRule";
import MyAsset from "../components/myAsset/createMyAsset";
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
        let {keyWord, title, record} = this.props;
        let {visible} = this.state;
        const createForm = {
            userCreate: <UserCreate onCancel={this.closeDrawer}
                                reloadData={this.props.reloadData}
                                edit={true}
                                record={record}/>,
            groupCreate: <GroupCreate onCancel={this.closeDrawer}
                                      reloadData={this.props.reloadData}
                                      edit={true}
                                      record={record}/>,
            asset: <Asset onCancel={this.closeDrawer}
                          reloadData={this.props.reloadData}
                          edit={true}
                          record={record}/>,
            domain: <Domain onCancel={this.closeDrawer}
                            reloadData={this.props.reloadData}
                            edit={true}
                            record={record}/>,
            gateway: <Gateway onCancel={this.closeDrawer}
                              reloadData={this.props.reloadData}
                              edit={true}
                              record={record}/>,
            systemCreate: <SystemCreate onCancel={this.closeDrawer}
                                        reloadData={this.props.reloadData}
                                        edit={true}
                                        record={record}/>,
            serviceCreate: <ServiceCreate onCancel={this.closeDrawer}
                                          reloadData={this.props.reloadData}
                                          edit={true}
                                          record={record}/>,
            adminUser: <AdminUserCreate onCancel={this.closeDrawer}
                                        reloadData={this.props.reloadData}
                                        edit={true}
                                        record={record}/>,
            label: <Label onCancel={this.closeDrawer}
                          reloadData={this.props.reloadData}
                          edit={true}
                          record={record}/>,
            command: <Command onCancel={this.closeDrawer}
                              reloadData={this.props.reloadData}
                              edit={true}
                              record={record}/>,
            commandRule: <CommandRule onCancel={this.closeDrawer}
                                      reloadData={this.props.reloadData}
                                      edit={true}
                                      record={record}/>,
            adminAuth: <AdminAuth onCancel={this.closeDrawer}
                                  reloadData={this.props.reloadData}
                                  edit={true}
                                  record={record}
                                  selectdTabkey={this.props.selectdTabkey}/>,
            iptableStatus: <IptableStatus onCancel={this.closeDrawer}
                                          reloadData={this.props.reloadData}
                                          edit={true}
                                          record={record}/>,

            entryRules: <EntryRules onCancel={this.closeDrawer}
                                    reloadData={this.props.reloadData}
                                    record={this.props.record}
                                    edit={true}/>,
            ipsets: <Ipsets onCancel={this.closeDrawer}
                            reloadData={this.props.reloadData}
                            record={this.props.record}
                            edit={true}/>,
            outBoundRules: <OutBoundRules onCancel={this.closeDrawer}
                                          reloadData={this.props.reloadData}
                                          record={this.props.record}
                                          edit={true}/>,


            securityGroups: <SecurityGroups onCancel={this.closeDrawer}
                                            reloadData={this.props.reloadData}
                                            edit={true}
                                            record={record}/>,
            securityGroupTem: <SecurityGroupTem onCancel={this.closeDrawer}
                                                reloadData={this.props.reloadData}
                                                edit={true}
                                                record={record}/>,
            sessionTerminal: <SessionTerminal onCancel={this.closeDrawer}
                                              reloadData={this.props.reloadData}
                                              edit={true}
                                              record={record}/>,
            dashboard: <CreateDashboard onCancel={this.closeDrawer}
                                 reloadData={this.props.reloadData}
                                 edit={true}
                                 record={record}/>,
            navBar: <NavBar onCancel={this.closeDrawer}
                            reloadData={this.props.reloadData}
                            edit={true}
                            record={record}/>,
            myAsset: <MyAsset onCancel={this.closeDrawer}
                            reloadData={this.props.reloadData}
                            edit={true}
                            record={record}/>,
            applyForAuth: <ApplyForAuth onCancel={this.closeDrawer}
                                                reloadData={this.props.reloadData}
                                                edit={true}
                                                record={record}/>,
        };
        return (
            <div>
                <Tooltip title="编辑">
                    <Icon type="edit" theme="filled" onClick={this.showDrawer}/>
                </Tooltip>
                <Modal  title={title}
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