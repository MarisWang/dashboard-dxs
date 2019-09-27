import React from 'react';
import {postDatas} from "../../../../common/apiManager";
import {checkEmptyInput} from "../../../../common/common";
import {Input, message} from "antd";

export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            name: "",
            securitygroup_id:this.props.record.id.toString(),
            srcip: "",
            chain: "OUTPUT",
            match_set: "ping",
            port: "",
            sort: "",
            target: "ACCEPT",
            deleteable: true,
            need_push: true,
            expression: "",
            creator: "",
            last_updator: "",
            asset:this.props.record.id.toString()
        };
    }

    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {
            chain, comment, match_set, port, sort, target,
            securitygroup_id, name, srcip, deleteable, need_push, expression,
            creator, last_updator, asset
        } = this.state;
        let requiredObject = {};
        let data = {};
        let query = window.location.pathname;
        let pathname = query.split("/")[1];
        if (pathname === "iptablesstatus") {
            requiredObject = {name};
            data = {
                "comment": comment,
                "name": name,
                "securitygroup_id": securitygroup_id,
                "srcip": srcip
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
            requiredObject = {name};
            data = {
                "name": name,
                "srcip": srcip,
                "deleteable": deleteable,
                "need_push": need_push,
                "expression": expression,
                "comment": comment,
                "creator": creator,
                "last_updator": last_updator,
                "securitygroup_id": securitygroup_id,
                "asset": asset
            }
        }
        if (checkEmptyInput(requiredObject)) {
            postDatas("/applications/v1/ipsets/", data).then((result => {
                if (result) {
                    this.props.reloadData();
                    message.success("创建成功!");
                    this.props.onCancel();
                }
            }))
        }
    };

    render() {
        let {name, srcip, comment} = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>基本</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">名称</span>
                        <Input name="name" value={name} onChange={this.onInputChange}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">源IP</span>
                        <Input name="srcip" value={srcip} onChange={this.onInputChange}/>
                    </div>
                    <div className="displayflexstart">
                        <span className="form_text">备注</span>
                        <Input name="comment" value={comment} onChange={this.onInputChange}/>
                    </div>
                </div>
                <div className="form-btns displayflexend">
                    <button onClick={this.props.onCancel}>取消</button>
                    <button onClick={(e) => this.submitForm(e)}>提交</button>
                </div>
            </div>
        );
    }
}