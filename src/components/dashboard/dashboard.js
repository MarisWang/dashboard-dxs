import React, {Component} from 'react';
import {List, Avatar} from 'antd';
import history from "../../js/history";
import {userStatistics, visiterStatistics} from "../../common/jsondata";
import PieCharts from "./pieCharts";
import BarCharts from "./barCharts";
import {fetchDatas} from "../../common/apiManager";
import moment from "moment";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userStatistics: userStatistics,
            visiterStatistics: visiterStatistics,
        };
    }

    componentWillMount() {
        this.getTableDatas();
        if (JSON.parse(localStorage.getItem('Auth')).user.role !== 1) {
            history.push("index")
        }
    }

    getTableDatas = () => {
        fetchDatas(`/dashboards/v1/dashboards/data`, result => {
            let {userStatistics, visiterStatistics} = this.state;
            for (let item in userStatistics) {
                let key = userStatistics[item]["key"];
                userStatistics[item].total = result[key];
            }
            for (let item in visiterStatistics) {
                let key = visiterStatistics[item]["key"];
                visiterStatistics[item].visitors = result[key];
            }
            this.setState({
                userStatistics: userStatistics,
                visiterStatistics: visiterStatistics,
            });
        });
    };
    renderList = (item) => {
        switch (item.key) {
            case "week_asset_hot_ten":
                return (
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={item.visitors}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar style={{backgroundColor: '#0074a6'}} icon="user"/>
                                    }
                                    title={`最近一次登录用户`}
                                    description={`IP: ${item["asset"]?item["asset"]:item["last"]["asset"]}`}
                                />
                                <div>{`于${moment(item["date_start"]?item["date_start"]:item["last"]["date_start"], "YYYYMMDD").fromNow()}`}</div>
                            </List.Item>
                        )}
                    />
                );
                break;
            case "last_login_ten":
                return (
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={item.visitors}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar style={{backgroundColor: '#0074a6'}} icon="user"/>
                                    }
                                    title={`最近一次登录用户`}
                                    description={`IP:${item["asset"]} `}
                                />
                                <div>{`于${moment(item["date_start"]?item["date_start"]:item["last"]["date_start"], "YYYYMMDD").fromNow()}`}</div>
                            </List.Item>
                        )}
                    />
                );
                break;
            case "week_user_hot_ten":
                return (
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={item.visitors}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar style={{backgroundColor: '#0074a6'}} icon="user"/>
                                    }
                                    title={`最近一次登录用户 `}
                                    description={`IP: ${item["last"].asset} `}
                                />
                                <div>{`于${moment(item["last"]["date_start"], "YYYYMMDD").fromNow()}`}</div>
                            </List.Item>
                        )}
                    />
                );
                break;
            default:
                return (
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={item.visitors}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar style={{backgroundColor: '#0074a6'}} icon="user"/>
                                    }
                                    title={`最近一次登录用户 `}
                                    description={`${item["user"]}`}
                                />
                                <div>{`${item["total"]} times/week`}</div>
                            </List.Item>
                        )}
                    />
                )
        }
    };

    render() {
        let {userStatistics, visiterStatistics} = this.state;
        return (
            <div className="wrapper dashboard">
                <div className="displayflexbetween dxs-wrapper-outer">
                    <ul className="displayflexbetween visiters-wrapper">
                        {
                            userStatistics.map((item) =>
                                <li key={item.id}>
                                    <h4 className="charts_title">{item.title}</h4>
                                    <div className="displayflexbetween">
                                        <img src={item.img} alt={item.title}/>
                                        <h1>{item.total}</h1>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                    {/*饼图*/}
                    <PieCharts/>
                </div>
                {/*柱状图*/}
                <BarCharts/>
                {/*浏览记录*/}
                <ul className="displayflexbetween visiters">
                    {
                        visiterStatistics.map((item) =>
                            <li key={item.id}>
                                <div className="displayflexaround">
                                    <img src={item.img} alt={item.title}/>
                                    <div className="dxs-text-wrapper">
                                        <h4>{item.top} {item.title}</h4>
                                        <h5>{item.desc}</h5>
                                    </div>
                                </div>
                                {this.renderList(item)}
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}
