import React, {Component} from 'react';
import {Icon, message, notification} from 'antd';
import history from "../js/history";

message.config({
    top: 20,
    duration: 3,
    maxCount: 1,
});


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    /**图标**/
    fontAwesomeIcon = (params) => {
        if (params) {
            let icon = params.split(" ");
            return icon[1]
        } else {
            return "fa-files-o"
        }
    };
    /**通知**/
    openNotification = () => {
        const content = <h4>您的个人信息还不完整,请点击此对话框来完善，或者点击右上角关闭提示。</h4>;
        notification.open({
            message: '通知',
            duration: null,
            description: content,
            placement: "bottomRight",
            onClick: () => {
                history.push(`/firstlogin`);
            },
        });
    };
    render() {
        let {collapsed, sidebarwidth,navBarsList,current} = this.props;
        return (
            <div className="sidebar" style={{width: sidebarwidth}}>
                <div className="logoContent displayflexbetween">
                    {collapsed ? null :
                        <img src={require("../images/logo-shineAnimation.gif")} alt="YUNA" style={{width: "120px"}}/>}
                    <Icon type="bars" onClick={this.props.onCllapsed}/>
                </div>
                <ul>
                    {
                        navBarsList.map((item, index) =>
                            item.submenu.length > 0 ?
                                <li className={item.name === current ? "actived-nav menulist" : "menulist"} key={index}>
                                    <span className={`fa ${this.fontAwesomeIcon(item.type)}`}/>
                                    {collapsed ? null : item.name}
                                    {collapsed ? null : <Icon type="right"/>}
                                    <div className="submenu">
                                        {item.submenu.map((obj, i) =>
                                            <a key={`sub${i}`}
                                               onClick={() => this.props.handleClick(obj)}>{obj.name}</a>
                                        )}
                                    </div>
                                </li>
                                :
                                <li key={index} onClick={() => this.props.handleClick(item)} className={item.name === current ? "actived-nav" : null}>
                                    <span className={`fa ${this.fontAwesomeIcon(item.type)}`}/>{collapsed ? "" : item.name}
                                </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}
