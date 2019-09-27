import React, {Component} from 'react';
import {Modal, Tooltip} from "antd";
// import ViewMoreIpStatuAsset from "../components/iptablesManagement/asset/assets";
import ViewMoreIpStatus from "../components/iptablesManagement/fireWallStatus/viewMoreIpStatus";
import ViewMoreSecurityGroup from "../components/iptablesManagement/securityGroup/viewSecurityGroup";
import ViewMoreSecurityGroupTem from "../components/iptablesManagement/securityGroupTem/viewSecurityGroupTem";
import ViewMoreCommand from "../components/assets/commandFilter/viewMoreCommand";
import ViewMoreUser from "../components/users/users/viewMoreUser";
import ViewMoreUserGroup from "../components/users/userGroups/viewMoreUserGroup";
import ViewMoreAssets from "../components/assets/assets/viewMoreAssets";
import ViewMoreDomain from "../components/assets/domain/viewMoreDomain";
import ViewMoreSystemUser from "../components/assets/systemUser/viewMoreSystemUser";
import ViewMoreAdminUser from "../components/assets/adminUser/viewMoreAdminUser";
import ViewMoreAdminAuth from "../components/perms/viewMorePages/viewMoreAuth";
import ViewMoreTaskList from "../components/jobcenter/taskList/viewMoreTaskList";
import ViewMoreSessionCommand from "../components/sessions/commands/viewMoreSessionCommand"

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
        let {keyWord, record} = this.props;
        let {visible} = this.state;
        const createForm = {
            viewMoreUser: <ViewMoreUser onCancel={this.closeDrawer}
                                        reloadData={this.props.reloadData}
                                        record={record}/>,
            viewMoreUserGroup: <ViewMoreUserGroup onCancel={this.closeDrawer}
                                        reloadData={this.props.reloadData}
                                        record={record}/>,
            viewMoreAssets: <ViewMoreAssets onCancel={this.closeDrawer}
                                            reloadData={this.props.reloadData}
                                            record={record}/>,
            viewMoreDomain: <ViewMoreDomain onCancel={this.closeDrawer}
                                            reloadData={this.props.reloadData}
                                            record={record}/>,
            viewMoreSystemUser: <ViewMoreSystemUser onCancel={this.closeDrawer}
                                                    reloadData={this.props.reloadData}
                                                    record={record}/>,
            viewMoreAdminUser: <ViewMoreAdminUser onCancel={this.closeDrawer}
                                                  reloadData={this.props.reloadData}
                                                  record={record}/>,
            viewMoreAdminAuth: <ViewMoreAdminAuth onCancel={this.closeDrawer}
                                                  reloadData={this.props.reloadData}
                                                  record={record}/>,
            // viewMoreIpStatuAsset: <ViewMoreIpStatuAsset onCancel={this.closeDrawer}
            //                                 reloadData={this.props.reloadData}
            //                                 record={record}/>,
            viewIpstatus: <ViewMoreIpStatus onCancel={this.closeDrawer}
                                            reloadData={this.props.reloadData}
                                            type={this.props.type}
                                            record={record}/>,
            viewMoreSecurityGroupTem: <ViewMoreSecurityGroupTem onCancel={this.closeDrawer}
                                                                reloadData={this.props.reloadData}
                                                                type={this.props.type}
                                                                record={record}/>,
            viewMoreSecurityGroup: <ViewMoreSecurityGroup onCancel={this.closeDrawer}
                                                          reloadData={this.props.reloadData}
                                                          type={this.props.type}
                                                          record={record}/>,
            viewMoreCommand: <ViewMoreCommand onCancel={this.closeDrawer}
                                              reloadData={this.props.reloadData}
                                              record={record}/>,
            viewMoreTaskList: <ViewMoreTaskList onCancel={this.closeDrawer}
                                                reloadData={this.props.reloadData}
                                                record={record}/>,
            viewMoreSessionCommand: <ViewMoreSessionCommand onCancel={this.closeDrawer}
                                                            reloadData={this.props.reloadData}
                                                            record={record}/>,
        };
        return (
            <div className="displayflexcenter">
                <Tooltip title="查看更多">
                    <img className="viewMore"
                         // src={require("../images/Eyesearch-01.svg")}
                         src={require("../images/viewmore-01.svg")}
                         onClick={this.showDrawer}
                         alt="viewmore"/>
                </Tooltip>
                <Modal
                    title={""}
                    wrapClassName="wrap_for_create"
                    style={{top: 25}}
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