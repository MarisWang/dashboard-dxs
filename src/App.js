import React, { Component } from 'react';
import {Router} from 'react-router-dom';
import history from "./js/history";
import DashboardIndex from "./components";
import 'xterm/dist/xterm.css';
import "font-awesome/css/font-awesome.css";
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'antd/dist/antd.css';
import "./css/common.css";
import "./css/dashboard.css";

export default class App extends Component {
    render() {
        return (
            <Router history={history}>
                <DashboardIndex />
            </Router>
        );
    }
}

