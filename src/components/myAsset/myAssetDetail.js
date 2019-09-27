import React from 'react';
import {Tabs, message} from 'antd';
import {patchDatas} from "../../common/apiManager";
import Config from "../../config/config";

const TabPane = Tabs.TabPane;

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.record["comment"] || ""
        };
    }
    /**测试**/
    testPort = (id) => {
        this.setState({isLoading: true});
        setTimeout(() => {
            this.setState({isLoading: false});
            window.open(`${Config.api}/ops/celery/task/${id}/log/`, '测试可链接性', 'height=500, width=800');
        }, 500);
    };
    /**监控input改变**/
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    /**保存备注**/
    saveCommon = () => {
        let {comment} = this.state;
        if (comment !== "") {
            let data = {comment};
            patchDatas(`/assets/v1/assets/${this.props.record.id}/`, data).then((result => {
                if (result && result instanceof Object) {
                    this.props.reloadData();
                    message.success("保存成功！");
                }
            }));
        }else{
            this.setState({comment: this.props.record["comment"] || ""})
        }
    };

    render() {
        let {record} = this.props;
        let {comment} = this.state;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="详情" key="1">
                    <ul className="displayflexbetween detailList">
                        <li><span>协议:</span>{record.protocol}</li>
                        <li><span>节点:</span>{record.nodes_display}</li>
                        <li><span>系统平台:</span>{record["platform"]}</li>
                        <li><span>操作系统:</span>{record["os"]}</li>
                        <li><span>操作用户:</span>{record["system_users_join"]}</li>
                        <li><span>网域:</span>{record.domain}</li>
                        <li><span>测试端口:</span>
                            <button className="small-button" onClick={() => this.testPort(record["id"])}>连接</button>
                        </li>
                        <li><span>备注:</span><input type="text" name="comment" value={comment}
                                                   onChange={this.onInputChange} onBlur={this.saveCommon}/></li>
                    </ul>
                    <br/>
                </TabPane>
            </Tabs>
        );
    }
}

export default EditableTable