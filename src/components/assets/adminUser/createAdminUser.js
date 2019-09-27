import React, {Component} from 'react';
import {Input, message, Spin, Upload, Icon, Button} from "antd";
import {checkEmptyInput, deleteNullObject,readFile} from "../../../common/common";
import {fetchDatas, patchDatas, postDatas} from "../../../common/apiManager";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            password: "",
            ssh_key: [],
            comment: "",
            pageloading: true,
        }
    }

    componentWillMount() {
        if (this.props.edit) {
            this.setDefaultVaules();
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({pageloading: false})
        }, 500);
    }

    /**设置默认值**/
    setDefaultVaules = () => {
        let {record} = this.props;
        fetchDatas(`/assets/v1/admin-user/${record}`, result => {
            this.setState({
                name: result["name"],
                username: result["username"],
                comment: result["comment"],
            });
        });
    };
    /**提交表单**/
    submitForm = (e) => {
        e.preventDefault();
        let {edit, record} = this.props;
        let {name,username,password,ssh_key,comment} = this.state;
        let private_key = ssh_key[0];
        let requiredObject = {name};
        let data = deleteNullObject({name,username,password,private_key,comment});
        if (checkEmptyInput(requiredObject)) {
            if (edit) {
                patchDatas(`/assets/v1/admin-user/${record}/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            } else {
                postDatas(`/assets/v1/admin-user/`, data).then((result => {
                    if (result) {
                        this.props.reloadData();
                        message.success("创建成功!");
                        this.props.onCancel();
                    }
                }))
            }
        }
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        let {name, username, comment, password, ssh_key} = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.ssh_key.indexOf(file);
                    const newFileList = state.ssh_key.slice();
                    newFileList.splice(index, 1);
                    return {
                        ssh_key: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                readFile(file, ssh_key =>{
                    this.setState({
                        ssh_key:[ssh_key],
                    });
                    }
                );
                return false;
            },
        };

        return (
            <Spin spinning={this.state.pageloading}>
                <div className="create_form">
                    <form action="" onSubmit={(e) => this.submitForm(e)} name="fileinfo">
                        <div className="from_container">
                            <h4>基础</h4>
                            <div className="displayflexstart">
                                <span className="form_text required">名称</span>
                                <Input name="name" value={name} onChange={this.onInputChange}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">用户名</span>
                                <Input name="username" value={username} onChange={this.onInputChange}/>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">密码</span>
                                <Input name="password" type="password" autoComplete="new-password" value={password}
                                       onChange={this.onInputChange}/>
                            </div>
                            <p>密码或密钥密码</p>
                            <div className="displayflexstart">
                                <span className="form_text">ssh私钥 </span> &nbsp;&nbsp;
                                <Upload {...props}>
                                    {ssh_key.length > 0 ? ssh_key.name : <Button><Icon type="upload"/> 选择文件</Button>}
                                </Upload>
                            </div>
                            <div className="displayflexstart">
                                <span className="form_text">备注</span>
                                <textarea name="comment" value={comment} onChange={this.onInputChange}/>
                            </div>
                        </div>
                    </form>
                    <div className="form-btns displayflexend">
                        <button onClick={this.props.onCancel}>取消</button>
                        <button onClick={this.submitForm}>提交</button>
                    </div>
                </div>
            </Spin>
        );
    }
}