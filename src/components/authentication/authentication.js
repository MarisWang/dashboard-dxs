import React, {Component} from 'react';
import LoginComponent from './login';
import RegisteComponent from './register';
import MfaAuth from "./mfaAuth";
import history from "../../js/history";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "login",
        }
    }
    componentWillMount() {
        if(localStorage.getItem("Auth")){
            history.push("/index")
        }
    }

    autoChange = (type) => {
        this.setState({type})
    };

    matchPages = (type) => {
        let pages = {
            login: <LoginComponent autoChange={this.autoChange}/>,
            register: <RegisteComponent autoChange={this.autoChange}/>,
            mfaAuth: <MfaAuth autoChange={this.autoChange}/>
        };
        return pages[type];
    };

    render() {
        let {type} = this.state;
        return (
            <div className="login displayflexcenter">
                <div className="loginContent">
                    <div className="brandLogo">
                        <img src={require('../../images/logo-shineAnimation.gif')} alt="logo" style={{width: "120px"}}/>
                    </div>
                    <br/>
                    {this.matchPages(type)}
                </div>
            </div>
        );
    }
}

export default Login;
