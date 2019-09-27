import {Icon} from "antd";
import React from "react";
import moment from "moment";

/**sort event**/
export const tableSortFun = (a, b, str) => {
    if (!isNaN(a[str])) {
        return parseFloat(a[str]) - parseFloat(b[str]);
    } else {
        return a[str].localeCompare(b[str])
    }
};

export const tableConfig = {
    size: "small",
    scroll: {x: 700},
    pagination: {defaultPageSize: 15, hideOnSinglePage: true, showSizeChanger: true,pageSizeOptions:["15","30","50","100"]},
    bordered: true,
};
/**用户管理 用户**/
export const userHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name'},
    {title: '用户名', dataIndex: 'username', sorter: (a, b) => tableSortFun(a, b, "username")},
    {
        title: '角色', dataIndex: 'role_display', sorter: (a, b) => tableSortFun(a, b, "role_display")
    },
    {title: '用户组', dataIndex: 'groups_display'},
    {title: '用户来源', dataIndex: 'source_display'},
    {
        title: '激活中', dataIndex: 'is_active', render: (text) => {
            return text ? <Icon type="check"/> : <Icon type="close"/>
        }
    }
];
/**用户管理  用户组**/
export const groupHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {
        title: '用户', dataIndex: 'users', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '组长', dataIndex: 'managers_display',
    },
    {title: '创建者', dataIndex: 'created_by'},
    {
        title: '创建日期', dataIndex: 'date_created', render: (text, record) => {
            return moment(text).format('LLL');
        }
    },
    {title: '备注', dataIndex: 'comment'},
];

/**资产管理 资产**/
export const assetHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '主机名', dataIndex: 'hostname', sorter: (a, b) => tableSortFun(a, b, "hostname")},
    {title: 'IP(默认填内网IP)', dataIndex: 'ip'},
    {title: '硬件', dataIndex: 'hardware_info'},
    {title: '端口', dataIndex: 'ssh_port'},
    {title: '创建者', dataIndex: 'created_by'},
    {
        title: '可连接', dataIndex: 'connectivity', render: (text) => {
            if (text.status === 0) {
                return <span className="point faild"/>
            } else if (text.status === 1) {
                return <span className="point success"/>
            } else {
                return <span className="point warning"/>
            }
        }
    },
    {title: '备注', dataIndex: 'comment', editable: true, width: "180px"},
];
/**资产管理 有权限用户**/
// export const privilegeUserHeader = [
//     {
//         title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
//             return (index + 1)
//         }
//     },
//     {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
//     {title: '用户名', dataIndex: 'username',},
//     {title: '角色', dataIndex: 'role_display'},
//     {title: '用户组', dataIndex: 'groups_display'},
//     {title: '用户来源', dataIndex: 'get_source_display'},
//     {
//         title: '激活中', dataIndex: 'is_active', render: (text) => {
//             return text ? <Icon type="check"/> : <Icon type="close"/>
//         }
//     },
// ];
/**资产管理 资产授权**/
export const assetAuthorizationHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '创建者', dataIndex: 'created_by',},
    {
        title: '用户', dataIndex: 'users', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '用户组', dataIndex: 'user_groups', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '资产', dataIndex: 'assets', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '节点', dataIndex: 'nodes', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '系统用户', dataIndex: 'system_users', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '备注', dataIndex: 'comment', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '激活中', dataIndex: 'is_active', render: (text) => {
            return text ? <Icon type="check"/> : <Icon type="close"/>
        }
    },
];
/**资产管理 资产用户列表**/
export const assetUserHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '主机名', dataIndex: 'hostname', sorter: (a, b) => tableSortFun(a, b, "username")},
    {title: 'IP(默认填内网IP)', dataIndex: 'ip',},
    {title: '用户名', dataIndex: 'username'},
    {title: '版本', dataIndex: 'version'},
    {
        title: '连接', dataIndex: 'connectivity', render: (text, record, index) => {
            if (text.status === 0) {
                return <span className="point faild"/>
            } else if (text.status === 1) {
                return <span className="point success"/>
            } else {
                return <span className="point warning"/>
            }
        }
    },
    {
        title: '日期', dataIndex: 'date_updated', render: (text, record) => {
            return moment(text).format('LLL');
        }
    },
];


/**资产管理 网域**/
export const domainHedaer = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '资产', dataIndex: 'asset_count', sorter: (a, b) => tableSortFun(a, b, "asset_count")},
    {title: '网关', dataIndex: 'gateway_count'},
    {title: '创建者', dataIndex: 'org_id'},
    {
        title: '创建日期', dataIndex: 'date_created', render: (text, record) => {
            return moment(text).format('LLL');
        }
    },
    {title: '备注', dataIndex: 'comment'},
];
/**资产-网域-网管**/
export const domainGateway = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: 'IP', dataIndex: 'ip', sorter: (a, b) => tableSortFun(a, b, "asset_count")},
    {title: '端口', dataIndex: 'port'},
    {title: '协议', dataIndex: 'protocol'},
    {title: '用户名', dataIndex: 'username'},
    {title: '备注', dataIndex: 'comment'},
];


/**资产管理 系统用户**/
export const SystemUserHedaer = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '用户名', dataIndex: 'username', sorter: (a, b) => tableSortFun(a, b, "username")},
    {title: '协议', dataIndex: 'protocol'},
    {title: '登陆模式', dataIndex: 'login_mode_display'},
    {title: '比例', dataIndex: 'priority'},
    {title: '用户', dataIndex: 'users'},
];
/**资产管理 服务用户表**/
export const ServiceUserHedaer = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '用户名', dataIndex: 'username'},
    {title: '创建者', dataIndex: 'purpose'},
    {title: 'Shell', dataIndex: 'shell'},
    {title: 'Sudo', dataIndex: 'sudo'},
    {title: '备注', dataIndex: 'comment'},
];
/**资产管理 管理用户**/
export const adminUserHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '用户名', dataIndex: 'username', sorter: (a, b) => tableSortFun(a, b, "username")},
    {title: '资产', dataIndex: 'assets_amount'},
    {title: '可连接', dataIndex: 'reachable_amount'},
    {title: '不可达', dataIndex: 'unreachable_amount'},
    {title: '比例', dataIndex: 'become_user'},
    {title: '创建者', dataIndex: 'created_by'},
    {title: '备注', dataIndex: 'comment'},
];
/**资产管理 标签管理**/
export const labelHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '值', dataIndex: 'value', sorter: (a, b) => tableSortFun(a, b, "value")},
    {title: '资产', dataIndex: 'asset_count'},
];
/**资产管理 命令过滤**/
export const filterHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {
        title: '规则', dataIndex: 'rules', render: (text, record, index) => {
            return text
        }
    },
    {
        title: '用户', dataIndex: 'users', render: (text, record, index) => {
            return text.length
        }
    },
    {title: '创建者', dataIndex: 'created_by'},
    {
        title: '创建日期', dataIndex: 'date_created', render: (text, record, index) => {
            return moment(text).format('LLL');
        }
    },
    {
        title: '更新日期', dataIndex: 'date_updated', render: (text, record, index) => {
            return moment(text).format('LLL');
        }
    },
    {title: '备注', dataIndex: 'comment'},
];
/**资产管理 命令过滤-子表头**/
export const filterSubHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {
        title: '类型', dataIndex: 'type', render: (text, record, index) => {
            return text.display
        }
    },
    {title: '内容', dataIndex: 'content'},
    {title: '优先级', dataIndex: 'priority'},
    {
        title: '策略', dataIndex: 'action', render: (text, record, index) => {
            return text.display
        }
    },
    {title: '备注', dataIndex: 'comment'},
];


/**权限管理 管理员授权**/
export const adminAuthHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '创建者', dataIndex: 'created_by'},
    {
        title: '用户', dataIndex: 'users', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '用户组', dataIndex: 'user_groups', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '资产', dataIndex: 'assets', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '节点', dataIndex: 'nodes', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '系统用户', dataIndex: 'system_users', render: (text, record, index) => {
            return text.length
        }
    },
    {
        title: '有效', dataIndex: 'is_valid', render: (text) => {
            return text ? <Icon type="check"/> : <Icon type="close"/>
        }
    },
];
/**管理权限 审批**/
export const approvalHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {
        title: '申请人', dataIndex: 'applicant_display'
    },
    {
        title: '资产', dataIndex: 'assets_display', render: (text, record, index) => {
            return text
        }
    },
    {
        title: '节点', dataIndex: 'nodes_display', render: (text, record, index) => {
            return text
        }
    },
    {
        title: '系统用户', dataIndex: 'system_user_display'
    },
    {
        title: '审批人', dataIndex: 'approver_display'
    },
    {
        title: '状态', dataIndex: 'status', render: (text) => {
            return text
        }
    },
    {title: '申请原因', dataIndex: 'comment'},
];


/**申请审批**/
export const applyForAuthHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {
        title: '申请人', dataIndex: 'applicant_display'
    },
    {
        title: '资产', dataIndex: 'assets_display', render: (text, record, index) => {
            return text
        }
    },
    {
        title: '节点', dataIndex: 'nodes_display', render: (text, record, index) => {
            return text
        }
    },
    {
        title: '系统用户', dataIndex: 'system_user_display'
    },
    {
        title: '审批人', dataIndex: 'approver_display'
    },
    {
        title: '状态', dataIndex: 'status', render: (text) => {
            return text
        }
    },
    {title: '申请原因', dataIndex: 'comment'},
];

/**会话管理 在线会话**/
export const onlineSessionHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '用户', dataIndex: 'user', sorter: (a, b) => tableSortFun(a, b, "user")},
    {title: '资产', dataIndex: 'asset'},
    {title: '系统用户', dataIndex: 'system_user'},
    {title: '申请人', dataIndex: 'creator'},
    {title: '远端地址', dataIndex: 'remote_addr'},
    {title: '协议', dataIndex: 'protocol'},
    {title: '命令', dataIndex: 'command_amount'},
    {title: '时长', dataIndex: ''},
];
/**会话管理 历史会话**/
export const offlineSessionHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '用户', dataIndex: 'user', sorter: (a, b) => tableSortFun(a, b, "user")},
    {title: '资产', dataIndex: 'asset'},
    {title: '系统用户', dataIndex: 'system_user'},
    {title: '远端地址', dataIndex: 'remote_addr'},
    {title: '协议', dataIndex: 'protocol'},
    {title: '命令', dataIndex: 'command_amount'},
    {title: '时长', dataIndex: ''},
];
/**会话管理 命令记录**/
export const commandsHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    // {title: 'ID', dataIndex: 'name',},
    {title: '命令', dataIndex: 'input'},
    {title: '用户', dataIndex: 'user'},
    {title: '资产', dataIndex: 'asset'},
    {title: '系统用户', dataIndex: 'system_user'},
    // {title: '会话', dataIndex: 'session'},
    {
        title: '日期', dataIndex: 'timestamp', render: (text, record) => {
            return moment(text * 1000).format('LLL');
        }
    },
];
/**会话管理 终端管理**/
export const terminalHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '远端地址', dataIndex: 'remote_addr'},
    {title: '会话', dataIndex: 'session_online'},
    {
        title: '激活中', dataIndex: 'is_alive', render: (text) => {
            return text ? <Icon type="check"/> : <Icon type="close"/>
        }
    },
    {
        title: '在线', dataIndex: 'is_accepted', render: (text) => {
            return text
                ? <span className="point success"/>
                : <span className="point faild"/>
        }
    },
];


/**防火墙管理 防火墙状态**/
export const iptableStatus = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '主机名', dataIndex: 'hostname', sorter: (a, b) => tableSortFun(a, b, "hostname")},
    {title: 'IP', dataIndex: 'ip'},
    {title: '安全组', dataIndex: 'securitygroup_display'},
    {title: '防火墙规则状态', dataIndex: 'gruop'},
    {title: 'Ipset状态', dataIndex: 'iptables_display'},
    {
        title: '最近更新时间', dataIndex: 'date_created', render: (text, record, index) => {
            return moment(text).format('LLL');
        }
    },
    {title: '备注', dataIndex: 'comment'},
];
export const subIptableStatus = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '主机名', dataIndex: 'hostname'},
    {title: 'IP', dataIndex: 'ip'},
    {title: '端口', dataIndex: 'port'},
];
/**防火墙管理 安全组模板**/
export const templateHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '资产', dataIndex: 'assets_num'},
    {title: '模板', dataIndex: 'templates'},
    {title: '创建者', dataIndex: 'creator'},
    {title: '备注', dataIndex: 'comment'},
];
/**防火墙管理 安全组**/
export const iptableSecurityGroupHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '资产', dataIndex: 'assets_num'},
    {title: '模板', dataIndex: 'template_name'},
    {title: '创建者', dataIndex: 'creator'},
    {title: '备注', dataIndex: 'comment'},
];
/**防火墙管理 入站规则**/
export const entryrulesHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    // {title: '排序', dataIndex: 'sort'},
    {title: '协议', dataIndex: 'protocol', sorter: (a, b) => tableSortFun(a, b, "protocol")},
    {title: '端口', dataIndex: 'port'},
    {title: '授权对象', dataIndex: 'match_set'},
    {title: '授权策略', dataIndex: 'target'},
    {title: '规则备注', dataIndex: 'comment'},
    {title: '创建者', dataIndex: 'creator'},
];
/**防火墙管理 出站规则**/
export const outboundulesHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    // {title: '排序', dataIndex: 'sort'},
    {title: '协议', dataIndex: 'protocol', sorter: (a, b) => tableSortFun(a, b, "protocol")},
    {title: '端口', dataIndex: 'port'},
    {title: '授权对象', dataIndex: 'match_set'},
    {title: '授权策略', dataIndex: 'target'},
    {title: '创建者', dataIndex: 'creator'},
];
/**防火墙管理 ipsets**/
export const ipsetsHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '源IP', dataIndex: 'srcip'},
    {title: '备注', dataIndex: 'comment'},
    {title: '创建者', dataIndex: 'creator'},
    {title: '创建时间', dataIndex: 'created_at'},
    {title: '最近更新者', dataIndex: 'last_updator'},
    {title: '更新时间', dataIndex: 'updated_at'},
];


/**作业中心 taskList**/
export const taskListHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {
        title: '执行次数', dataIndex: 'run_times', render: (text, record, index) => {
            return `${text["total"]}/${text["total"]}/${text["total"]}`;
        }
    },
    {
        title: '成功', dataIndex: 'success', width: "60px", render: (text) => {
            return text
                ? <span className="point success"/>
                : <span className="point faild"/>
        }
    },
    {title: '时间', dataIndex: 'time', width: "60px"},
];
/**作业中心 任务个版本**/
export const taskVersionHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '版本', dataIndex: 'short_id'},
    {
        title: '主机', dataIndex: 'hosts', render: (text, record, index) => {
            return text.length
        }, sorter: (a, b) => tableSortFun(a, b, "short_id")
    },
    {title: '模式', dataIndex: 'pattern'},
    {
        title: '运行用户', dataIndex: 'run_as_admin',
        render: (text, record, index) => {
            return text ? "Admin" : null
        }
    },
    {title: 'Become', dataIndex: 'become'},
    {
        title: '日期', dataIndex: 'date_created', render: (text, record, index) => {
            return moment(text).format('LLL');
        }
    },
    {
        title: '详情', dataIndex: 'tasks', render: (text, record, index) => {
            return `${text[0].name}`
        }
    },
];

/**作业中心 执行历史*/
export const taskHistoryHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '开始日期', dataIndex: 'date_created', sorter: (a, b) => tableSortFun(a, b, "date_created")},
    {
        title: '失败/成功/总', dataIndex: 'run_times', render: (text, record, index) => {
            // return text
            return `${record.run_times.failed}/${record.run_times.success}/${record.run_times.total}`
        }
    },
    {
        title: '比例', dataIndex: 'hosts', render: (text) => {
            return `${text}%`
        }
    },
    {
        title: '是否完成', dataIndex: 'is_finished', render: (text) => {
            return text
                ? <span className="point success"/>
                : <span className="point faild"/>
        }
    },
    {
        title: '是否成功', dataIndex: 'success', render: (text) => {
            return text
                ? <span className="point success"/>
                : <span className="point faild"/>
        }
    },
    {title: '用时', dataIndex: 'time'},
    {title: '版本', dataIndex: 'latest_version'},
];


/**日志审计 登陆日志**/
export const loginLogHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '用户名', dataIndex: 'username', sorter: (a, b) => tableSortFun(a, b, "username")},
    {title: '类型', dataIndex: 'type'},
    {title: 'IP', dataIndex: 'ip'},
    {title: '城市', dataIndex: 'city'},
    {
        title: 'MFA', dataIndex: 'mfa', render: (text) => {
            if (text === 0) {
                return "禁用"
            } else if (text === 1) {
                return "启用"
            } else {
                return "-"
            }
        }
    },
    {title: '原因', dataIndex: 'reason'},
    {
        title: '状态', dataIndex: 'status', render: (text) => {
            return text ? <Icon type="check"/> : <Icon type="close"/>
        }
    },
];
/**日志审计 PTP日志**/
export const FTPHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '用户', dataIndex: 'user', sorter: (a, b) => tableSortFun(a, b, "user")},
    {title: '资产', dataIndex: 'asset'},
    {title: '系统用户', dataIndex: 'system_user'},
    {title: '远端地址', dataIndex: 'remote_addr'},
    {title: '操作', dataIndex: 'operate'},
    {title: '文件名', dataIndex: 'filename'},
    {
        title: '成功', dataIndex: 'is_success', render: (text) => {
            return text
                ? <span className="point success"/>
                : <span className="point faild"/>
        }
    },
    {
        title: '开始日期', dataIndex: 'date_start', render: (text, record) => {
            return moment(text).format('LLL');
        }
    }
];
/**日志审计 操作日志**/
export const opearHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '用户', dataIndex: 'user', sorter: (a, b) => tableSortFun(a, b, "user")},
    {title: '动作', dataIndex: 'action'},
    {title: '资源', dataIndex: 'resource'},
    {title: '资源类型', dataIndex: 'resource_type'},
    {title: '远端地址', dataIndex: 'remote_addr'},
];
/**日志审计 改密审计**/
export const passwordHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '用户', dataIndex: 'user', sorter: (a, b) => tableSortFun(a, b, "user")},
    {title: '修改者', dataIndex: 'change_by'},
    {title: '远端地址', dataIndex: 'remote_addr'},
];
/**日志审计 防火墙变更记录**/
export const firewallHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '任务类型', dataIndex: 'task_type'},
    {title: '资产', dataIndex: 'assets_dispaly'},
    {title: '防火墙规则', dataIndex: 'iptables'},
    {title: 'Ipset', dataIndex: 'ipsets_dispaly'},
    {title: 'IP', dataIndex: 'iptables_dispaly'},
];
/**日志审计 批量任务记录**/
export const taskRecordHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '任务类型', dataIndex: 'task_type', sorter: (a, b) => tableSortFun(a, b, "task_type")},
    {title: '资产', dataIndex: 'assets_dispaly'},
    {title: '命令记录', dataIndex: 'commands'},
    {title: '系统用户', dataIndex: 'system_users_dispaly'},
    {title: '脚本', dataIndex: 'scripts'},
    {title: '文件路径', dataIndex: 'file_path'},
];


/**菜单管理 仪表盘**/
export const navDashboardHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    // {title: 'HTML ID', dataIndex: 'html_id'},
    {
        title: '启用', dataIndex: 'enabled', render: (text) => {
            return text
                ? <span className="point success"/>
                : <span className="point faild"/>
        }
    },
    {title: '排序', dataIndex: 'sort'},
    // {title: '链接', dataIndex: 'href'},
    {title: '角色', dataIndex: 'roles_display'},
];
/**菜单管理 导航栏**/
export const navHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '名称', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '目录层级', dataIndex: 'level', sorter: (a, b) => tableSortFun(a, b, "level")},
    {title: '父目录ID', dataIndex: 'parent', sorter: (a, b) => tableSortFun(a, b, "parent")},
    {title: 'ID', dataIndex: 'id', sorter: (a, b) => tableSortFun(a, b, "id")},
    {
        title: '启用', dataIndex: 'enabled', render: (text) => {
            return text
                ? <span className="point success"/>
                : <span className="point faild"/>
        }
    },
    {title: '链接', dataIndex: 'href'},
    {title: '导航图标样式', dataIndex: 'i_css', width: "120px"},
    {title: '角色', dataIndex: 'roles_display'},
];

/**我的资产**/
export const myAssetHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '主机名', dataIndex: 'hostname', sorter: (a, b) => tableSortFun(a, b, "hostname")},
    {title: 'IP1(默认为内网IP)', dataIndex: 'ip'},
    {
        title: '激活中', dataIndex: 'is_active', render: (text) => {
            return text
                ? <span className="point success"/>
                : <span className="point faild"/>
        }
    },
    {title: '端口', dataIndex: 'port'},
    {title: '系统用户', dataIndex: 'system_users_join'},
    {title: '备注', dataIndex: 'comment', width: "180px"},
];


export const operationRecordsHeader = [
    {
        title: '#', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return (index + 1)
        }
    },
    {title: '任务类型', dataIndex: 'name', sorter: (a, b) => tableSortFun(a, b, "name")},
    {title: '白名单', dataIndex: 'username',},
    {title: 'IP', dataIndex: 'role_display'},
    {title: '资产', dataIndex: 'groups_display'},
    {title: '命令', dataIndex: 'get_source_display'},
    // {title: '创建者', dataIndex: '',},
    // {title: '备注', dataIndex: '',},
    // {title: '日期', dataIndex: '',},
];