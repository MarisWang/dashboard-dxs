import React, {Component} from "react";
import {Input, message, Select, Spin} from "antd";
import {checkEmptyInput, createOptions} from "../../common/common";
import {fetchDatas, postDatas} from "../../common/apiManager";

const typeList = [
    {id: "server", name: "server"},
    {id: "es", name: "es (elasticsearch)"},
];

class TerminalSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TYPE: "server",
            NAME: "",
            HOSTS: "", /**格式为数组**/
            INDEX: "",
            DOC_TYPE: "",
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
        let {TYPE, NAME, HOSTS, INDEX, DOC_TYPE} = this.state;
        let requiredObject = {TYPE};
        let data = TYPE === "server" ? {TYPE, NAME} : {TYPE, NAME, HOSTS, INDEX, DOC_TYPE};
        if (checkEmptyInput(requiredObject)) {
            postDatas("/settings/v1/terminal/command-storage/create/", data).then((result => {
                if (result) {
                    this.props.reloadData();
                    message.success("创建成功!");
                    this.props.onCancel();
                }
            }))
        }
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
        let {TYPE, HOSTS, INDEX, DOC_TYPE} = this.state;
        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <div className="from_container">
                        <h4> 创建命令存储 </h4>
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
                                   onChange={this.onInputChange}/>
                        </div>
                        {
                            TYPE === "es" ?
                                <div>
                                    <div className="displayflexstart">
                                        <span className="form_text"> 主机</span>&nbsp;&nbsp;&nbsp;
                                        <Input name="HOSTS"
                                               value={HOSTS}
                                               onChange={this.onInputChange}/>
                                    </div>
                                    <p>提示: 如果有多台主机，请使用逗号 ( , ) 进行分割</p>
                                    <p>eg: http://www.jumpserver.a.com, http://www.jumpserver.b.com</p>
                                    <div className="displayflexstart">
                                        <span className="form_text"> 索引</span>&nbsp;&nbsp;&nbsp;
                                        <Input name="INDEX"
                                               value={INDEX}
                                               onChange={this.onInputChange}/>
                                    </div>
                                    <div className="displayflexstart">
                                        <span className="form_text"> 文档类型</span>&nbsp;&nbsp;&nbsp;
                                        <Input name="DOC_TYPE"
                                               value={DOC_TYPE}
                                               onChange={this.onInputChange}/>
                                    </div>
                                </div>
                                : null
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
