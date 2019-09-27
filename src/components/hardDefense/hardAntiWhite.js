import React from 'react';
import {message, Select, Spin} from 'antd';
import {postDatas,} from "../../common/apiManager";
import Config from "../../config/config";
import {checkEmptyInput, createOptions,} from "../../common/common";

export default class BulkTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task_type: "switch_network", //switch_network
            pageloading: true,
        }
    }

    componentWillMount() {
        this.getSelectOptions();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }

    /**获取下拉框选项**/
    getSelectOptions = () => {

    };

    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**提交表单**/
    submitForm = (e) => {
        e.preventDefault();
        let {task_type, assets, comment,} = this.state;
        let requiredObject = {task_type, assets, comment};
        if (checkEmptyInput(requiredObject)) {
            postDatas(``, this.state).then((result => {
                if (task_type === "switch_network" && result.msg === "成功") {
                    this.setDefault();
                    message.success("网路切换成功!");
                } else {
                    this.setDefault();
                    window.open(`${Config.api}/ops/celery/task/${result["task_id"]}/log/`, '测试可链接性', 'height=500, width=800');
                }
            }))
        }
    };


    /**设置默认值**/
    setDefault = () => {
        this.setState({
            task_type: "switch_network", //switch_network
        })
    };

    render() {
        let {
            task_type,
        } = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="wrapper">
                    <div className="create_form">
                        <div className="from_container">
                            <h4>硬防管理</h4>
                            <div className="displayflexstart">
                                <span className="form_text required">Task type</span>
                                <Select size="default"
                                        value={task_type}
                                        onChange={(value) => this.handleSelectChange(value, "task_type")}>
                                    {createOptions([])}
                                </Select>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">白名单名</span>
                                <Select mode="tags"
                                        size="default"
                                        value={""}
                                        onChange={(value) => this.handleSelectChange(value, "assets")}>
                                    {createOptions([])}
                                </Select>
                            </div>
                            <p>语法：目标机器内网IP-端口，例如：192.168.1.1-22</p>
                            <div className="displayflexstart">
                                <span className="form_text">Ip</span>
                                <textarea/>
                            </div>
                            <p>用逗号或换行隔开</p>
                            <div className="displayflexstart">
                                <span className="form_text">资产</span>
                                <Select mode="tags"
                                        size="default"
                                        value={""}
                                        onChange={(value) => this.handleSelectChange(value, "labels")}>
                                    {createOptions([])}
                                </Select>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">备注</span>
                                <textarea name="comment"
                                          value={""}
                                          onChange={this.onInputChange}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text required">执行结果</span>
                                <textarea name="comment"
                                          value={""}
                                          onChange={this.onInputChange}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.setDefault}>重置</button>
                    <button onClick={this.submitForm}>提交</button>
                </div>
            </Spin>
        );
    }
}