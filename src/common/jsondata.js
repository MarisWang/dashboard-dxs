/**menuManagement**/
export const userStatistics = [
    {id: 1, key: "users_count", title: "用户总数", img: require("../images/icon-userz.svg"), total: 0},
    {id: 2, key: "assets_count", title: "主机总数", img: require("../images/icon-TotHost.svg"), total: 0},
    {id: 3, key: "online_user_count", title: "在线用户", img: require("../images/icon-onlineuser.svg"), total: 0},
    {
        id: 4,
        key: "online_asset_count",
        title: "在线会话",
        img: require("../images/icon-OnlineConvo.svg"),
        total: 0
    }
];
/**menuManagement**/
export const visiterStatistics = [
    {
        id: 1,
        title: "活跃用户",
        key: "user_visit_count_top_five",
        img: require("../images/user.png"),
        top: "Top 5",
        desc: "过去一周登录次数及最近一次登录记录.",
        type: "timeline",
        visitors: []
    },
    {
        id: 2,
        title: "资产",
        key: "week_asset_hot_ten",
        img: require("../images/top_10_asset.png"),
        top: "Top 10",
        desc: "一周登录次数及最后一次登录记录",
        type: "timeline",
        visitors: []
    },
    {
        id: 3,
        title: "登录",
        key: "last_login_ten",
        img: require("../images/top_10_login.png"),
        top: "Top 10",
        desc: "最近十次登录记录.",
        type: "list",
        visitors: []
    },
    {
        id: 4,
        title: "用户",
        key: "week_user_hot_ten",
        img: require("../images/top_10_user.png"),
        top: "Top 10",
        desc: "一周内用户登录次数及最近一次登录记录.",
        type: "timeline",
        visitors: []
    },

];

/**修改用户多选框**/
export const dashboard = [
    "用户总数",
    "主机总数",
    "在线用户",
    "在线会话",
    "活跃用户",
    "活跃用户资产占比",
    "一周Top10资产",
    "最近十次登录",
    "一周Top10用户",
];

/**终端设置--资产列表排序**/
export const listSortBy = [
    {name: "主机名", id: "hostname"},
    {name: "IP", id: "ip"},
];
/**终端设置--资产分页每页数量**/
export const listPageSize = [
    {name: "全部", id: "all"},
    {name: "自动", id: "auto"},
    {name: "10", id: "10"},
    {name: "15", id: "15"},
    {name: "25", id: "25"},
    {name: "50", id: "50"},
];
/**用户添加中的导航栏数据**/
export const navList = [
    {label: '仪表盘', value: '1', checked: false,},
    {
        label: '用户管理', value: '2', checked: false, children: [
            {label: '用户', value: '8', checked: false,},
            {label: '用户组', value: '44', checked: false,},
        ],
    },
    {
        label: '资产管理', value: '3', checked: false, children: [
            {label: '资产', value: '10', checked: false,},
            {label: '网域', value: '50', checked: false,},
            {label: '系统用户', value: '40', checked: false,},
            {label: '服务用户', value: '72', checked: false,},
            {label: '管理用户', value: '13', checked: false,},
            {label: '标签管理', value: '45', checked: false,},
            {label: '命令过滤', value: '63', checked: false,},
            {label: '批量任务', value: '53', checked: false,},
        ],
    },
    {
        label: '权限管理', value: '4', checked: false, children: [
            {label: '资产授权', value: '15', checked: false,},
            {label: '审批', value: '16', checked: false,},
        ],
    },
    {
        label: '防火墙管理', value: '5', checked: false, children: [
            {label: '防火墙状态', value: '62', checked: false,},
            {label: '安全组模板', value: '76', checked: false,},
            {label: '安全组', value: '75', checked: false,},
            {label: '推送', value: '59', checked: false,},
        ],
    },
    {
        label: '作业中心', value: '6', checked: false, children: [
            {label: '任务列表', value: '18', checked: false,},
            {label: '命令执行', value: '73', checked: false,},
        ],
    },
    {
        label: '会话管理', value: '38', checked: false, children: [
            {label: '在线会话', value: '39', checked: false,},
            {label: '历史会话', value: '40', checked: false,},
            {label: '命令记录', value: '41', checked: false,},
            {label: '终端管理', value: '43', checked: false,},
        ],
    },
    {
        label: '日志审计', value: '66', checked: false, children: [
            {label: '登录日志', value: '67', checked: false,},
            {label: 'FTP日志', value: '68', checked: false,},
            {label: '操作日志', value: '69', checked: false,},
            {label: '改密日志', value: '70', checked: false,},
            {label: '防火墙变更记录', value: '60', checked: false,},
            {label: '批量任务记录', value: '55', checked: false,},
        ],
    },
    {label: 'Web终端', value: '48', checked: false,},
    {label: '命令执行', value: '77', checked: false,},


    {label: '申请授权', value: '24', checked: false,},
    {
        label: '菜单管理', value: '28', checked: false, children: [
            {label: '导航栏', value: '88', checked: false,},
            {label: '仪表盘', value: '29', checked: false,},
        ],
    },
    {label: '文件管理', value: '65', checked: false,},
    {label: '设置', value: '49', checked: false,},
    {label: '个人信息', value: '47', checked: false,},
    {label: '我的资产', value: '46', checked: false,},
];
/**用户添加中的仪表盘数据**/
export const dashboardList = [
    {label: '用户总数', value: '1',},
    {label: '主机总数', value: '2',},
    {label: '在线用户', value: '3',},
    {label: '在线会话', value: '4',},
    {label: '活跃用户', value: '5',},
    {label: '活跃用户资产占比', value: '6',},
    {label: '一周Top10资产', value: '7',},
    {label: '最近十次登录', value: '8',},
    {label: '一周Top10用户', value: '9',},
];