import React from 'react';
import Result from "antd/lib/result";
import {Button} from "antd";
import history from "../js/history";

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <div className="wrapper displayflexcenter">
                <Result status="404"
                        title=""
                        subTitle="对不起,您访问的页面不存在，请返回首页。"
                        extra={<Button type="primary" onClick={()=>history.push("/")}>返回首页</Button>}
                />
            </div>
        );
    }
}
