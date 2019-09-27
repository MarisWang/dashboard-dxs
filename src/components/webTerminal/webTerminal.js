import React from 'react';
import Config from "../../config/config";

export default class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const w=window.open('about:blank');
        w.location.href=`${Config.api}/luna/`
    }

    render() {
        return (
            <div className="wrapper" />
        );
    }
}




