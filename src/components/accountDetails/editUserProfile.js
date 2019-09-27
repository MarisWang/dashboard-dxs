import React, {Component} from 'react';
import {Button, Modal, Tabs} from 'antd';
import Profile from "./persionalInfo";
import Password from "./password";
import SshPublicKey from "./sshpublickey";

const {TabPane} = Tabs;

export default class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {visible, openTab} = this.props;
        return (
            <div>
                <div className="displayflexend">
                    <Button type="primary" onClick={() => this.props.showDrawer("1")} htmlType={"button"}>修改</Button>
                </div>
                <br/>
                <Modal wrapClassName="wrap_for_create"
                       style={{top: 20}}
                       width="80vw"
                       visible={visible}
                       destroyOnClose={true}
                       footer={null}
                       onOk={this.handleOk}
                       onCancel={this.props.closeDrawer}>
                    <Tabs defaultActiveKey={openTab}>
                        <TabPane tab="个人信息" key="1">
                            <Profile onCancel={this.props.closeDrawer}/>
                        </TabPane>
                        <TabPane tab="密码" key="2">
                            <Password onCancel={this.props.closeDrawer}/>
                        </TabPane>
                        <TabPane tab="SSH 公钥" key="3">
                            <SshPublicKey onCancel={this.props.closeDrawer}/>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}

