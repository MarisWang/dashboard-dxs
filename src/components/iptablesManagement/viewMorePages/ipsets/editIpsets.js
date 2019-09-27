import React from 'react';
import {fetchDatas, patchDatas} from "../../../../common/apiManager";
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

    componentWillMount() {
        this.setDefaultVaules();
    }

    /**获取默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/applications/v1/ipsets/${record.id}`, result => {
            this.setState(result);
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
        let {comment, srcip} = this.state;
        let data = {comment, srcip};
        patchDatas(`/applications/v1/ipsets/${record.id}/`, data).then((result => {
            if (result && result instanceof Object) {
                this.props.reloadData();
                message.success("编辑成功!");
                this.props.onCancel();
            }
        }))
    };

    render() {
        let {name, srcip, comment} = this.state;
        return (
            <div className="create_form">
                <div className="from_container">
                    <h4>基本</h4>
                    <div className="displayflexstart">
                        <span className="form_text required">名称</span>
                        <Input name="name" value={name} disabled={true}/>
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