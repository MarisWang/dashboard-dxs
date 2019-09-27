import React, {Component} from 'react';
import {Input, message, Select, Spin} from "antd";
import {checkEmptyInput, createOptions,} from "../../../common/common";
import {getCmdFilterSelectOptions, fetchDatas, patchDatas, postDatas} from "../../../common/apiManager";

const typeOptions = [
    {name: "命令", id: "command"},
    {name: "正则表达式", id: "regex"},
];
const actionOptions = [
    {name: "允许", id: 1},
    {name: "拒绝", id: 0},
];

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "command",
            priority: 50,
            content: "",
            action: 1,
            comment: "",
            filter: this.props.record.id,
            name: this.props.record.name,
            filterList: [],
            pageloading: true
        }
    }

    componentWillMount() {
        this.getSelectOptions();
        if (this.props.edit) {
            this.setDefaultVaules();
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }
    getSelectOptions=()=>{
        getCmdFilterSelectOptions(filterList=>{
            this.setState({filterList});
        })
    };
    /**获取默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/assets/v1/cmd-filter/${record.filter}/rules/${record.id}/`, result => {
            this.setState({
                filter: result.filter,
                type: result.type.value,
                priority: result.priority,
                content: result.content,
                action: result.action.value,
                comment: result.comment,
            });
        });
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**监控select**/
    handleSelectChange = (value, name) => {
        this.setState({
            [name]: value
        });
    };
    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {type, filter, content, comment, priority, action,} = this.state;
        let requiredObject = {type, filter, content,  priority, action};
        let data = {type, action, filter, content, comment, priority,};
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                patchDatas(`/assets/v1/cmd-filter/${record.filter}/rules/${record.id}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("修改成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas(`/assets/v1/cmd-filter/${record.filter}/rules/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
    };

    render() {
        let {type,content, comment, priority, action, filter,filterList} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>命令过滤器规则</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">过滤器</span>
                            <Select size="default"
                                    value={filter}
                                    disabled={true}
                                    onChange={(value) => this.handleSelectChange(value, "filter")}>
                                {createOptions(filterList)}
                            </Select>
                            {/*<Input name="name" disabled={true} value={filter}/>*/}
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">类型</span>
                            <Select size="default"
                                    value={type}
                                    onChange={(value) => this.handleSelectChange(value, "type")}>
                                {createOptions(typeOptions)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">内容</span>
                            <textarea name="content" value={content} onChange={this.onInputChange}/>
                        </div>
                        <p>每行一个命令</p>
                        <div className="displayflexstart">
                            <span className="form_text required">优先级</span>
                            <Input name="priority" type="number" value={priority} onChange={this.onInputChange}/>
                        </div>
                        <p>优先级可选范围为1-100，1最低优先级，100最高优先级</p>
                        <div className="displayflexstart">
                            <span className="form_text required">动作</span>
                            <Select size="default"
                                    value={action}
                                    onChange={(value) => this.handleSelectChange(value, "action")}>
                                {createOptions(actionOptions)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">Comment：</span>
                            <textarea name="comment" value={comment} onChange={this.onInputChange}/>
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