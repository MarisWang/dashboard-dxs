import React from 'react';
import {Icon, message, Row, Col} from 'antd';
import Profile from "./profile";
import PublicKey from "./publicKey";
import MFA from "./mfa";
import Finish from "./finish";
import history from "../../js/history";

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            userProfile: {}
        };
    }

    next = () => {
        const current = this.state.current + 1;
        this.setState({current});
    };

    prev = () => {
        const current = this.state.current - 1;
        this.setState({current});
    };

    done = () => {
        message.success('验证完成，请继续您的操作!');
        setTimeout(() => {
            history.push(`/index`);
        }, 1000)
    };

    jumpToStep = (step) => {
        this.setState({current: step});
    };

    render() {
        const {current, userProfile} = this.state;
        const steps = [
            {content: <Profile userProfile={userProfile} next={this.next}/>,},
            {content: <PublicKey userProfile={userProfile} next={this.next} prev={this.prev}/>,},
            {content: <MFA next={this.next} prev={this.prev}/>,},
            {content: <Finish done={this.done} prev={this.prev}/>,},
        ];
        return (
            <div className="wrapper">
                <Row type="flex" align="middle" justify="center">
                    <Col span={2} className={current === 0 ? "selected-step" : null} onClick={() => this.jumpToStep(0)}>
                        <Icon type={current === 0 ? "loading" : "user"}/>用户信息
                    </Col>
                    <Col span={5}>
                        <div className="progress-line"/>
                    </Col>
                    <Col span={2} className={current === 1 ? "selected-step" : null} onClick={() => this.jumpToStep(1)}>
                        <Icon type={current === 1 ? "loading" : "key"}/>公钥
                    </Col>
                    <Col span={5}>
                        <div className="progress-line"/>
                    </Col>
                    <Col span={2} className={current === 2 ? "selected-step" : null} onClick={() => this.jumpToStep(2)}>
                        <Icon type={current === 2 ? "loading" : "customer-service"}/>MFA
                    </Col>
                    <Col span={5}>
                        <div className="progress-line"/>
                    </Col>
                    <Col span={2} className={current === 3 ? "selected-step" : null} onClick={() => this.jumpToStep(3)}>
                        <Icon type={current === 3 ? "loading" : "security-scan"}/>协议
                    </Col>
                </Row>
                <br/>
                <br/>
                <br/>
                <Row type="flex" align="middle" justify="center">
                    <Col span={20}>
                        {steps[current].content}
                    </Col>
                </Row>
            </div>
        )
    }
}
