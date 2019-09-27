import React, {Component} from "react";
import {Input, Select, message, Spin} from "antd";
import {createOptions} from "../../common/common";
import {postDatas} from "../../common/apiManager";

const suffixList = [
    {name: "core.chinacloudapi.cn", id: "core.chinacloudapi.cn"},
    {name: "core.windows.net", id: "core.windows.net"},
];

const typeList = [
    {id: "server", name: "server"},
    {id: "s3", name: "s3"},
    {id: "oss", name: "oss"},
    {id: "azure", name: "azure"},
];

class TerminalSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TYPE: "server",
            NAME: "",
            BUCKET: "",
            ACCESS_KEY: "",
            SECRET_KEY: "",
            ENDPOINT: "",
            ACCOUNT_NAME: "",
            ACCOUNT_KEY: "",
            ENDPOINT_SUFFIX: "",
            CONTAINER_NAME: "",
            pageloading: true,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }

    /**提交**/
    submitForm = (e) => {
        e.preventDefault();
        let {TYPE, NAME, BUCKET, ACCESS_KEY, SECRET_KEY, ENDPOINT, CONTAINER_NAME, ACCOUNT_NAME, ACCOUNT_KEY, ENDPOINT_SUFFIX} = this.state;
        let data = {};
        if (TYPE === "server") {
            data = {TYPE, NAME}
        } else if (TYPE === "azure") {
            data = {TYPE, NAME, CONTAINER_NAME, ACCOUNT_NAME, ACCOUNT_KEY, ENDPOINT_SUFFIX};
        } else {
            data = {TYPE, NAME, BUCKET, ACCESS_KEY, SECRET_KEY, ENDPOINT};
        }
        postDatas("/settings/v1/terminal/replay-storage/create/", data).then((result => {
            if (result) {
                this.props.reloadData();
                message.success("创建成功!");
                this.props.onCancel();
            }
        }))
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

    render() {
        let {TYPE, NAME, BUCKET, ACCESS_KEY, SECRET_KEY, ENDPOINT, ACCOUNT_NAME, ACCOUNT_KEY, ENDPOINT_SUFFIX, CONTAINER_NAME} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4>创建录像存储</h4>
                        <div className="displayflexstart">
                            <span className="form_text">类型</span>&nbsp;&nbsp;&nbsp;
                            <Select size="default"
                                    value={TYPE}
                                    onChange={(value) => this.handleSelectChange(value, "TYPE")}>
                                {createOptions(typeList)}
                            </Select>
                        </div>
                        <div className="displayflexstart">
                            <span className="form_text"> 名称</span>&nbsp;&nbsp;&nbsp;
                            <Input name="NAME"
                                   value={NAME}
                                   onChange={this.onInputChange}/>
                        </div>
                        {
                            TYPE !== "azure" ?
                                <div>
                                    {
                                        TYPE !== "server" ?
                                            <div>
                                                <div className="displayflexstart">
                                                    <span className="form_text"> 桶名称</span>&nbsp;&nbsp;&nbsp;
                                                    <Input name="BUCKET"
                                                           value={BUCKET}
                                                           onChange={this.onInputChange}/>
                                                </div>
                                                <div className="displayflexstart">
                                                    <span className="form_text"> Access key</span>&nbsp;&nbsp;&nbsp;
                                                    <Input name="ACCESS_KEY"
                                                           value={ACCESS_KEY}
                                                           onChange={this.onInputChange}/>
                                                </div>
                                                <div className="displayflexstart">
                                                    <span className="form_text"> Secret key</span>&nbsp;&nbsp;&nbsp;
                                                    <Input name="SECRET_KEY"
                                                           value={SECRET_KEY}
                                                           onChange={this.onInputChange}/>
                                                </div>
                                                <div className="displayflexstart">
                                                    <span className="form_text"> 端点</span>&nbsp;&nbsp;&nbsp;
                                                    <Input name="ENDPOINT"
                                                           value={ENDPOINT}
                                                           onChange={this.onInputChange}/>
                                                </div>
                                                {
                                                    TYPE !== "oss" ?
                                                        <div>
                                                            <p>S3: http://s3.{"REGION_NAME"}.amazonaws.com</p>
                                                            <p>S3(中国): http://s3.{"REGION_NAME"}.amazonaws.com.cn</p>
                                                            <p>如: http://s3.cn-north-1.amazonaws.com.cn</p>
                                                        </div>
                                                        :
                                                        <div>
                                                            <p>OSS: http://{"REGION_NAME"}.aliyuncs.com </p>
                                                            <p>如: http://oss-cn-hangzhou.aliyuncs.com</p>
                                                        </div>
                                                }
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                                :
                                <div>
                                    <div className="displayflexstart">
                                        <span className="form_text"> 容器名称</span>&nbsp;&nbsp;&nbsp;
                                        <Input name="CONTAINER_NAME"
                                               value={CONTAINER_NAME}
                                               onChange={this.onInputChange}/>
                                    </div>
                                    <div className="displayflexstart">
                                        <span className="form_text"> 账户名称</span>&nbsp;&nbsp;&nbsp;
                                        <Input name="ACCOUNT_NAME"
                                               value={ACCOUNT_NAME}
                                               onChange={this.onInputChange}/>
                                    </div>
                                    <div className="displayflexstart">
                                        <span className="form_text"> 账户密钥</span>&nbsp;&nbsp;&nbsp;
                                        <Input name="ACCOUNT_KEY"
                                               value={ACCOUNT_KEY}
                                               onChange={this.onInputChange}/>
                                    </div>
                                    <div className="displayflexstart">
                                        <span className="form_text"> 端点后缀</span>&nbsp;&nbsp;&nbsp;
                                        <Select size="default"
                                                value={ENDPOINT_SUFFIX}
                                                onChange={(value) => this.handleSelectChange(value, "ENDPOINT_SUFFIX")}>
                                            {createOptions(suffixList)}
                                        </Select>
                                    </div>
                                </div>
                        }
                        <br/>
                        <div className="form-btns displayflexend">
                            <button onClick={this.props.onCancel}>取消</button>
                            <button onClick={(e) => this.submitForm(e)}>提交</button>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}

export default TerminalSetting;
