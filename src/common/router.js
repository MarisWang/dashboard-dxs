import React, {Component} from "react";

import FistTimeLogin from '../components/firstTimeLogin/firstTimeLogin';
import Dashboard from '../components/dashboard/dashboard';

import Users from '../components/users/users/users';
import UserGroup from '../components/users/userGroups/group';

import Asset from '../components/assets/assets/asset';
import Domain from "../components/assets/domain/domain";
import Systemuser from "../components/assets/systemUser/systemUser";
import Serviceser from "../components/assets/serviceUser/serviceUser";
import Adminuser from "../components/assets/adminUser/adminUser";
import Labels from "../components/assets/labelManagement/label";
import CommandFilter from "../components/assets/commandFilter/commandFilter";
import BulkTasks from "../components/assets/tasks/bulkTasks";

import Authorize from "../components/perms/adminAuth/adminAuth";
import TeamLeaderAuth from "../components/perms/teamLeaderAuth/teamLeaderAuth";
import UserApply from "../components/perms/userApply/userApply";
import Approval from "../components/perms/permissionApproval/permissionApproval";

import OnlineSession from "../components/sessions/onLineSession/onlineSession";
import OfflineSession from "../components/sessions/offLineSession/offlineSession";
import CommandSession from "../components/sessions/commands/commands";
import TerminalSession from "../components/sessions/terminal/terminal";

import FirewallStatus from "../components/iptablesManagement/fireWallStatus/iptablesStatus";
import SecurityGroupTemplate from "../components/iptablesManagement/securityGroupTem/securityGroupsTemplate";
import SecurityGroup from "../components/iptablesManagement/securityGroup/securityGroups";
import Push from "../components/iptablesManagement/push/push";

import TaskList from "../components/jobcenter/taskList/taskList";
import CommandExecution from "../components/jobcenter/command/commandExecution";

import LoginLog from "../components/audits/loginLog";
import FirewallRecord from "../components/audits/iptablesHistory";
import OpearteLog from "../components/audits/opearteLog";
import PasswordLog from "../components/audits/passwordLog";
import FtpLog from "../components/audits/ftpLog";
import TaskRecord from "../components/audits/taskHistory";

import MenuComponent from "../components/menu/dashboard/dashboard";
import NavComponent from "../components/menu/navBar/navbar";

import Setting from "../components/settings/setting";

import AccountDetails from "../components/accountDetails/accountDetails";
import MFA from "../components/MFA/mfa";
import BindMfa from "../components/MFA/bindMfa";

import MyAssets from "../components/myAsset/myAsset";
import WebTerminal from "../components/webTerminal/webTerminal";
import CommandExecute from "../components/applyForAuth/applyForAuth";
import DocManage from "../components/docManage/docManage";

import HardAntiWhite from "../components/hardDefense/hardAntiWhite";
import OperationRecord from "../components/hardDefense/operationRecord";


export default class Router extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const pages = {
            firstlogin: <FistTimeLogin/>,//登陆

            maindashboard: <Dashboard/>, //仪表盘

            user: <Users/>,//用户
            usergroup: <UserGroup/>,//用户组

            asset: <Asset/>,//资产
            domain: <Domain/>,//网域
            systemuser: <Systemuser/>, //系统用户
            serviceuser: <Serviceser/>, //服务用户
            adminuser: <Adminuser/>,//管理用户
            labels: <Labels/>,//标签
            commandfilters: <CommandFilter/>,//命令过略
            bulktasks: <BulkTasks/>,//批量任务

            adminauthentication: <Authorize/>, //授权列表
            groupadminauthen: <TeamLeaderAuth/>, //组长授权
            userapply: <UserApply/>, //用户申请
            permissionapproval: <Approval/>, //审批

            iptablesstatus: <FirewallStatus/>, //防火墙状态
            securitygroupstemplate: <SecurityGroupTemplate/>, //安全组模板
            securitygroups: <SecurityGroup/>, //安全组
            push: <Push/>, //推送

            sessiononline: <OnlineSession/>, //在线会话
            sessionoffline: <OfflineSession/>, //历史会话
            commands: <CommandSession/>, //命令记录
            terminal: <TerminalSession/>, //终端管理


            tasklist: <TaskList/>, //任务列表
            commandexecution: <CommandExecution/>, //命令执行

            loginlog: <LoginLog/>, //登录日志
            ftplog: <FtpLog/>, //FTP日志
            operatelog: <OpearteLog/>, //操作日志
            passwordchangelog: <PasswordLog/>, //改密日志
            iptableshistory: <FirewallRecord/>, //防火墙变更记录
            taskhistory: <TaskRecord/>, //批量任务记录

            dashboard: <MenuComponent/>, //仪表盘
            navbar: <NavComponent/>, //导航栏

            settings: <Setting/>, //设置

            account_details: <AccountDetails/>, //账户详情
            profile: <AccountDetails/>,//个人信息

            setmfas: <MFA/>,
            bindmfa: <BindMfa/>,

            addtohardwarewhitelist:<HardAntiWhite />, //硬防加白
            operationrecords:<OperationRecord />, //操作记录


            myassets: <MyAssets/>, //我的资产
            webterminal: <WebTerminal/>, //web终端
            applypermission: <CommandExecute/>,//申请权限
            filemanager: <DocManage/>,//文件管理
        };
        let {keyWord} = this.props;
        let nav = JSON.parse(localStorage.getItem("nav"));
        return (
            <div>
                {
                    keyWord === "index" ? pages[nav]
                    : pages[keyWord]}
            </div>
        );
    }
}