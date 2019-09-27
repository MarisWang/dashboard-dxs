import React from 'react';
import Config from "../../config/config";
export default class Asset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // message.warning("还不能正常使用，敬请期待！")
    componentDidMount() {
        const w=window.open('about:blank');
        w.location.href=`${Config.api}/coco/elfinder/sftp/?`
    }
    render() {
        return (
            <div className="wrapper">

            </div>
        );
    }
}




