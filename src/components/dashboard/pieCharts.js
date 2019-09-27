import React, {Component} from 'react';
import echarts from "echarts/lib/echarts";
import {fetchDatas} from "../../common/apiManager";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userPie: [
                {value: 0, name: 'Active', role: 'User'},
                {value: 0, name: 'Inactive', role: 'User'},
                {value: 0, name: 'Disabled', role: 'User'},
            ],
            hostPie: [
                {value: 0, name: 'Active', role: 'Host'},
                {value: 0, name: 'Inactive', role: 'Host'},
                {value: 0, name: 'Disabled', role: 'Host'},
            ],
        };
    }

    componentDidMount() {
        fetchDatas(`/dashboards/v1/dashboards/data`, result => {
            this.setState({
                userPie: [
                    {value: result["month_user_active"], name: '激活', role: 'User'},
                    {value: result["month_user_inactive"], name: '未激活', role: 'User'},
                    {value: result["month_user_disabled"], name: '禁用', role: 'User'},
                ],
                hostPie: [
                    {value: result["month_asset_active"], name: '激活', role: 'Host'},
                    {value: result["month_asset_inactive"], name: '未激活', role: 'Host'},
                    {value: result["month_asset_disabled"], name: '禁用', role: 'Host'},
                ],
            });
            let query = window.location.pathname;
            let router = query.split("/")[1];
            if (router === "maindashboard") {
                let {userPie, hostPie} = this.state;
                this.createPieCharts("userPie", userPie);
                this.createPieCharts("hostPie", hostPie);
            }
        });
    }

    /**生成柱图**/
    createPieCharts = (id, data) => {
        let myChart = echarts.init(document.getElementById(id));
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    return `当月 ${params.data.role} ${params.name}:${params.value}(${params.percent}%) `
                }
            },
            color: ['#fa94d6', '#00cad9', '#fdcd21'],
            legend: {
                bottom: 10,
                left: 'center',
                data: ['激活', '未激活', '禁用'],
                itemWidth: 10,//图例的宽度
                itemHeight: 10,//图例的高度
                textStyle: {//图例文字的样式
                    color: '#ccc',
                    fontSize: 12
                }
            },
            series: [
                {
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    itemStyle: {
                        normal: {
                            label: {
                                show: false   //隐藏标示文字
                            },
                            labelLine: {
                                show: false   //隐藏标示线
                            }
                        }
                    },
                    data: data,
                }
            ],
        });
    };

    render() {
        return (
            <div className="piecharts-wrapper">
                <h4 className="charts_title">活跃用户资产占比</h4>
                <p style={{textAlign: "left", marginLeft: "15px"}}>以下图形分别描述一个月活跃用户和资产占所有用户主机的百分比.</p>
                <div className="displayflexaround">
                    <div>
                        <div id="userPie" style={{width: "300px", height: "220px"}}/>
                        <h3 style={{textAlign: "center"}}>用户</h3>
                    </div>
                    <div>
                        <div id="hostPie" style={{width: "300px", height: "220px"}}/>
                        <h3 style={{textAlign: "center"}}>主机</h3>
                    </div>
                </div>
            </div>
        );
    }
};
