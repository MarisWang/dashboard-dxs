import React, {Component} from 'react';
import echarts from "echarts/lib/echarts";
import {fetchDatas} from "../../common/apiManager";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month_str: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            month_total_visit_count: [0, 0, 0, 0, 0, 0, 0],
            month_user: [0, 0, 0, 0, 0, 0, 0],
            mouth_asset: [0, 0, 0, 0, 0, 0, 0],
        };
        this.width = "100%"
    }

    componentDidMount() {
        fetchDatas(`/dashboards/v1/dashboards/data`, result => {
            this.setState({
                month_str: result["month_str"],
                month_total_visit_count: result["month_total_visit_count"],
                month_user: result["month_user"],
                mouth_asset: result["mouth_asset"],
            });
            let query = window.location.pathname;
            let router = query.split("/")[1];
            if(router==="maindashboard"){
                this.createBarCharts();
            }
        });
    }

    /**生成柱图**/
    createBarCharts = () => {
        let {month_str, month_total_visit_count, month_user, mouth_asset} = this.state;
        let myChart = echarts.init(document.getElementById("container"));
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    //  改变x轴字体颜色和大小
                    axisLabel: {
                        textStyle: {
                            color: '#c3c3c3',
                            fontSize: '12'
                        },
                    },
                    // 控制网格线是否显示
                    splitLine: {
                        show: false,
                        //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['red']
                        }
                    },
                    //  改变x轴颜色
                    axisLine: {
                        lineStyle: {
                            color: '#c3c3c3',
                        }
                    },
                    boundaryGap: false,
                    data: month_str
                }
            ],
            yAxis: [
                {
                    type: `value`,
                    //  改变y轴字体颜色和大小
                    axisLabel: {
                        textStyle: {
                            color: '#c3c3c3',
                            fontSize: '12'
                        },
                    },
                    // 控制网格线是否显示
                    splitLine: {
                        show: true,
                        //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: '#c3c3c3',
                        }
                    },
                    //  改变y轴颜色
                    axisLine: {
                        lineStyle: {
                            color: '#c3c3c3',
                        }
                    },
                }
            ],
            series: [
                {
                    name: '当月用户',
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    areaStyle: {},
                    data: month_user,
                    color: "#fa94d6"
                },
                {
                    name: '当月资产',
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    areaStyle: {},
                    data: mouth_asset,
                    color: "#00cad9"
                },
                {
                    name: '总访问量',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    areaStyle: {},
                    data: month_total_visit_count,
                    color: "#fdcd21"
                },
            ]
        });
        window.onresize = function () {
            myChart.resize();
        }
    };

    render() {
        let {} = this.props;
        return (
            <div className="charts-wrapper">
                <h4 className="charts_title">月数据总览</h4>
                <div id="container" style={{width: this.width, height: "400px"}}/>
                <ul className="displayflexcenter legend">
                    <li><span> </span>总访问量</li>
                    <li><span> </span>当月用户</li>
                    <li><span> </span>当月资产</li>
                </ul>
                <br/>
            </div>
        );
    }
}
