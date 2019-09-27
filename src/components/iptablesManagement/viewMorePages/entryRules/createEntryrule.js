import React from 'react';
import { postDatas} from "../../../../common/apiManager";
import {checkEmptyInput, createOptions} from "../../../../common/common";
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
            asset_id: this.props.record.id.toString(),
            chain: "INPUT",
            comment: "",
            match_set: "ssh",
            need_push: "1",
            port: "111",
            sort: "7",
            target: "ACCEPT",
            securitygroup_id: this.props.record.id.toString(),
            pageloading: true,
        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }
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
        let {asset_id, chain, match_set, need_push, port, securitygroup_id, sort, target, comment} = this.state;
        let requiredObject = {};
        let data = {};
        let query = window.location.pathname;
        let pathname = query.split("/")[1];
        if (pathname === "iptablesstatus") {
            requiredObject = {port, target, match_set};
            data = {
                "asset_id": asset_id,
                "chain": chain,
                "comment": comment,
                "match_set": match_set,
                "need_push": need_push,
                "port": port,
                "sort": sort,
                "target": target
            };
        }
        if (pathname === "securitygroupstemplate") {
            requiredObject = {match_set, port, target,};
            data = {
                "chain": chain,
                "comment": comment,
                "match_set": match_set,
                "port": port,
                "securitygroup_id": securitygroup_id,
                "sort": sort,
                "target": target
            };
        }
        if (pathname === "securitygroups") {
            requiredObject = {};
            data = {
                "chain": chain,
                "comment": comment,
                "match_set": match_set,
                "port": port,
                "securitygroup_id": securitygroup_id,
                "sort": sort,
                "target": target
            }
        }
        if (checkEmptyInput(requiredObject)) {
            postDatas("/applications/v1/iptables/", data).then((result => {
                if (result) {
                    this.props.reloadData();
                    message.success("创建成功!");
                    this.props.onCancel();
                }
            }))
        }
    };

    render() {
        let {match_set,port,target, comment} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>基本</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">协议</span>
                            <Select value={match_set}
                                    onChange={(value) => this.handleSelectChange(value, "match_set")}>
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
                                    onChange={(value) => this.handleSelectChange(value, "match_set")}>
                                {createOptions(authorizedOptions)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">授权策略</span>
                            <Select value={target}
                                    onChange={(value) => this.handleSelectChange(value, "target")}>
                                {createOptions(strategyOptions)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">规则备注</span>
                            <Input name="comment" value={comment} onChange={this.onInputChange}/>
                        </div>
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