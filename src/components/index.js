import React, {Component} from 'react';
import {Dropdown, message, Icon, Menu, Breadcrumb} from 'antd';
import Login from "./authentication/authentication";
import SideBar from "../common/sidebar";
import Router from "../common/router";
import history from "../js/history";
import 'moment/locale/zh-cn';
import {fetchDatas} from "../common/apiManager";


message.config({
    top: 20,
    duration: 3,
    maxCount: 1,
});

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logined: localStorage.getItem('Auth') ? true : null,
            collapsed: false,
            sidebarwidth: "220px",
            layoutwidth: "calc(100vw - 230px)",
            current: "",
            router: "",
            breadcrumb: [],
            navBarsList: []
        };
    }

    componentWillMount() {
        if (localStorage.getItem("Auth")) {
            this.getNavBars();
        } else {
            history.push("login")
        }
    }

    componentDidMount() {
        this.interval();
        window.addEventListener('resize', this.handleResize.bind(this));
        this.firstTimeLoad();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this))
    }

    /**获得导航数据**/
    getNavBars = () => {
        fetchDatas("/users/v1/users/navbars", result => {
            result.map((item) => {
                if (item.router === "Dashboard") result[0].router = "Main Dashboard";
            });
            this.setState({navBarsList: result});
            let fromLogin = localStorage.getItem('fromLogin');
            let query = window.location.pathname;
            let router = "";
            if (fromLogin === "true" || query === "/") {
                router = result[0].router.replace(/\s+/g, "").toLocaleLowerCase();
            } else {
                router = query.split("/")[1];
            }
            localStorage.setItem('nav', JSON.stringify(router));
            localStorage.setItem('fromLogin', "false");
            this.matchBreadcrumb(router);
            history.push(`/${router}`);
        })
    };
    /**第一次页面加载获得屏幕宽**/
    firstTimeLoad = () => {
        let width = document.querySelector('body').offsetWidth;
        this.compareWidth(width);
    };
    /**监听窗口大小改变**/
    handleResize = e => {
        let width = e.target.outerWidth;
        this.compareWidth(width);
    };
    /**改变屏幕宽度**/
    compareWidth = (Width) => {
        if (Width < 1201) {
            this.setState({
                collapsed: true,
                sidebarwidth: "60px",
                layoutwidth: `calc(100vw - 70px)`,
            })
        } else {
            this.setState({
                collapsed: false,
                sidebarwidth: "220px",
                layoutwidth: "calc(100vw - 230px)",
            })
        }
    };
    /**token过期**/
    interval = () => {
        setInterval(() => {
            if (JSON.parse(localStorage.getItem("Auth"))) {
                let expired = JSON.parse(localStorage.getItem("Auth")).user.expired_at;
                let datenow = new Date().getTime();
                if (expired < datenow) {
                    console.clear();
                    localStorage.clear();
                    history.push("/login")
                }
            } else {
                history.push("/login")
            }
        }, 60000);
    };
    /**匹配面包削导航**/
    matchBreadcrumb = (keyword) => {
        let {navBarsList} = this.state;
        let breadcrumb = [];
        navBarsList.map(item => {
            let Route = item.router.replace(/\s+/g, "").toLocaleLowerCase();
            if (keyword === Route) {
                breadcrumb.push(item.name);
                this.setState({current: item.name, breadcrumb});
                return true
            } else {
                item["submenu"].map(key => {
                    let Route = key.router.replace(/\s+/g, "").toLocaleLowerCase();
                    if (Route === keyword) {
                        breadcrumb.push(item.name);
                        breadcrumb.push(key.name);
                        this.setState({current: item.name, breadcrumb});
                        return true
                    }
                });
            }
        });
    };

    /**导航点击事件**/
    handleClick = (item) => {
        let router = item.router.replace(/\s+/g, "").toLocaleLowerCase();
        this.matchBreadcrumb(router);
        history.push(`/${router}`);
    };
    /**展开与关闭侧边栏**/
    onCllapsed = () => {
        let {collapsed, sidebarwidth} = this.state;
        collapsed ? sidebarwidth = "220px" : sidebarwidth = "60px";
        this.setState({
            collapsed: !collapsed,
            sidebarwidth: sidebarwidth,
            layoutwidth: `calc(100vw - ${sidebarwidth} - 10px)`,
        })
    };
    /**登出**/
    headerLogout = () => {
        fetchDatas("/authentication/v1/logout/", res => {
            if (res.success) {
                localStorage.clear();
                console.clear();
                clearInterval(this.interval);
                history.push('/login');
            }
        });
    };
    /**页面跳转**/
    goToPage = (item) => {
        history.push(`/${item}`);
    };

    render() {
        let {collapsed, sidebarwidth, layoutwidth, breadcrumb, navBarsList, current} = this.state;
        const langMenu = (
            <Menu className="headerDropdownMenu">
                <Menu.Item><h6>English</h6></Menu.Item>
                <Menu.Item><h6>Chinese</h6></Menu.Item>
            </Menu>
        );
        const profileMenu = (
            <Menu className="headerDropdownMenu">
                <Menu.Item onClick={() => this.goToPage('account_details')}><h6>用户中心</h6></Menu.Item>
                <Menu.Item onClick={this.headerLogout}><h6>登出</h6></Menu.Item>
            </Menu>
        );
        let logined = !!JSON.parse(localStorage.getItem('Auth'));
        let authUser = logined ? JSON.parse(localStorage.getItem('Auth')).user.username : null;
        let query = window.location.pathname;
        let pathname = query.split("/")[1];
        return (
            <div>
                {
                    logined ?
                        <div className="mainContent displayflexbetween">
                            <SideBar collapsed={collapsed}
                                     current={current}
                                     sidebarwidth={sidebarwidth}
                                     navBarsList={navBarsList}
                                     getNavBars={this.getNavBars}
                                     onCllapsed={this.onCllapsed}
                                     handleClick={this.handleClick}/>
                            <div className="layout" style={{width: layoutwidth}}>
                                <header className="layout-header displayflexend">
                                    <Dropdown trigger={['click']} className="headerDropdown" overlay={langMenu}>
                                        <div className="dropdownLang">
                                            <span><Icon type="global"/><h6>EN</h6><Icon type="down"/></span>
                                        </div>
                                    </Dropdown>
                                    <Dropdown trigger={['click']} className="headerDropdown" overlay={profileMenu}>
                                        <div className="dropdownLang">
                                          <span>
                                            <Icon type="user"/>
                                            <h6>{authUser}</h6>
                                            <Icon type="down"/>
                                          </span>
                                        </div>
                                    </Dropdown>
                                </header>
                                <section className="layout-content">
                                    <h3 className="breadcrumb-text">
                                        <Breadcrumb>
                                            {
                                                breadcrumb.map((item, index) =>
                                                    <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                                                )
                                            }
                                        </Breadcrumb>
                                    </h3>
                                    <Router keyWord={pathname}/>
                                </section>
                                <footer className="layout-footer">Copyright TECHDOG © 2014-2019</footer>
                            </div>
                        </div>
                        :
                        <Login/>

                }
            </div>
        );
    }
}
