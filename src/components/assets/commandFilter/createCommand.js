import React, {Component} from 'react';
import {Input, message, Spin} from "antd";
import {checkEmptyInput,} from "../../../common/common";
import {
    fetchDatas,
    getDomainSelectOptions,
    patchDatas,
    postDatas
} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            comment: "",
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

    /**获取默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/assets/v1/cmd-filter/${record}`, result => {
            this.setState({
                name: result["name"],
                comment: result["comment"],
            });
        });
    };
    /**获取下拉列表选项**/
    getSelectOptions = () => {
        /**网域**/
        getDomainSelectOptions(domainLists =>
            this.setState({
                domainLists,
            }),
        );
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name} = this.state;
        let requiredObject = {name};
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                patchDatas(`/assets/v1/cmd-filter/${record}/`, this.state).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("修改成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/assets/v1/cmd-filter/", this.state).then((result => {
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
        let {name, comment} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>Labels</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name" value={name} onChange={this.onInputChange} minLength={1}
                                   maxLength={128}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">Comment</span>
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