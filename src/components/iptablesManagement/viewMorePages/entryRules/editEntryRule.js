import React from 'react';
import {fetchDatas, patchDatas} from "../../../../common/apiManager";
import {createOptions} from "../../../../common/common";
import {Input, message, Select, Spin} from "antd";

const authorizedOptions = [
    {id: "ping", name: "ping"},
    {id: "ssh", name: "ssh"},
    {id: "zabbix", name: "zabbix"},
    {id: "web", name: "web"},
];

const strategyOptions = [
    {id: "ACCEPT", name: "接受"},
    {id: "REFUSE", name: "拒接"},
];

const protocolOptions = [
    {id: "icmp", name: "icmp"},
    {id: "tcp", name: "tcp"},
];
export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            asset: "",
            asset_id: "",
            securitygroup_id: "",
            chain: "INPUT",
            comment: "",
            match_set: "ssh", //授权对象
            need_push: "1",
            port: "",
            sort: "7",
            target: "ACCEPT", //授权策略
            protocol: "tcp",//协议,
            pageloading: true,
        };
    }

    componentWillMount() {
        this.setDefaultVaules();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }

    /**获取默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/applications/v1/iptables/${record.id}`, result => {
            this.setState(result);
        });
    };
    /**监控复选框事件**/
    handleSelectChange = (value, role) => {
        this.setState({
            [role]: value
        });
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {record} = this.props;
        let {comment, port} = this.state;
        let data = {comment, port};
        patchDatas(`/applications/v1/iptables/${record.id}/`, data).then((result => {
            if (result) {
                this.props.reloadData();
                message.success("编辑成功!");
                this.props.onCancel();
            }
        }))
    };

    render() {
        let {comment, match_set, protocol, port, target} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>基本</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">协议</span>
                            <Select value={protocol}
                                    disabled={true}
                                    onChange={(value) => this.handleSelectChange(value, "protocol")}>
                                {createOptions(protocolOptions)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">端口</span>
                            <Input name="port" type="number" value={port} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">授权对象</span>
                            <Select value={match_set}
                                    disabled={true}
                                    onChange={(value) => this.handleSelectChange(value, "match_set")}>
                                {createOptions(authorizedOptions)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">授权策略</span>
                            <Select value={target}
                                    disabled={true}
                                    onChange={(value) => this.handleSelectChange(value, "target")}>
                                {createOptions(strategyOptions)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">规则备注</span>
                            <Input name="comment" value={comment} onChange={this.onInputChange}/>
                        </div>
                        {/*<div className="displayflexstart">*/}
                        {/*    <span className="form_text">创建者</span>*/}
                        {/*    <Input name="name" value={name} onChange={this.onInputChange}/>*/}
                        {/*</div>*/}
                    </div>
                    <div className="form-btns displayflexend">
                        <button onClick={this.props.onCancel}>取消</button>
                        <button onClick={(e) => this.submitForm(e)}>提交</button>
                    </div>
                </div>
            </Spin>
        );
    }
}