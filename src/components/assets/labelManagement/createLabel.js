import React, {Component} from 'react';
import {Input, message, Select, Spin} from "antd";
import {checkEmptyInput, createOptions} from "../../../common/common";
import {
    fetchDatas,
    getAssetsSelectOptions,
    patchDatas,
    postDatas
} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            value: "",
            assets: [],
            assetLists: [],
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
        fetchDatas(`/assets/v1/labels/${record}`, result => {
            this.setState({
                name: result["name"],
                value: result["value"],
                assets: result["assets"],
            });
        });
    };
    /**获取下拉选项的值**/
    getSelectOptions = () => {
        /**网域**/
        getAssetsSelectOptions(assetLists =>
            this.setState({
                assetLists,
            }),
        );
    };
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name, value, assets} = this.state;
        let requiredObject = {name, value};
        let data = {name, value, assets};
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                patchDatas(`/assets/v1/labels/${record}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas("/assets/v1/labels/", data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
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

    render() {
        let {assetLists, name, value, assets} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <div className="displayflexstart">
                            <span className="form_text required">名称</span>
                            <Input name="name" value={name} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text required">值</span>
                            <Input name="value" value={value} onChange={this.onInputChange}/>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text">资产</span>
                            <Select mode="tags"
                                    size="default"
                                    value={assets}
                                    onChange={(value) => this.handleSelectChange(value, "assets")}>
                                {createOptions(assetLists)}
                            </Select>
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