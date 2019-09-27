import React, {Component} from 'react';
import {Input, message, Select, Spin} from "antd";
import {checkEmptyInput, createOptions, deleteNullObject} from "../../../common/common";
import {
    fetchDatas,
    postDatas,
    patchDatas,
    getAssetsSelectOptions,
} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            assets: [],
            comment: "",
            assetList: [],
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

    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/assets/v1/domain/${record}/`, result => {
            this.setState({
                name: result["name"],
                assets: result["assets"],
                comment: result["comment"],
            });
        });
    };

    getSelectOptions = () => {
        /**资产**/
        getAssetsSelectOptions(assetList =>
            this.setState({
                assetList,
            }),
        );
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
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name, assets, comment} = this.state;
        let requiredObject = {name};
        if (checkEmptyInput(requiredObject)) {
            let data = deleteNullObject({name, assets, comment});
            if (edit) {
                patchDatas(`/assets/v1/domain/${record}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/assets/v1/domain/", data).then((result => {
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
        let {comment, name, assets, assetList} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>域名</h4>
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name" value={name} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">资产</span>
                            <Select mode="tags"
                                    size="default"
                                    value={assets}
                                    onChange={(value) => this.handleSelectChange(value, "assets")}>
                                {createOptions(assetList)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">备注</span>
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