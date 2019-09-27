import React from 'react';
import {Button, DatePicker, Dropdown, Icon, Menu, Table, Tooltip,} from 'antd';
import {commandsHeader, tableConfig} from "../../../common/tableHeader";
import {fetchDatas,postDatas} from "../../../common/apiManager";
import ViewMore from "../../../common/viewMore";
import Config from "../../../config/config";
import {SearchInput} from "hermes-react";
import moment from "moment";
import {getTimeForNow,getTimeForFiveDaysBefore} from "../../../common/common";

export default class ManageLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableDatas: [],
            isLoading: false,
            date_start: getTimeForFiveDaysBefore(),
            date_expired: getTimeForNow(),
            selectedRowKeys: [],
        };
    }

    componentDidMount() {
        this.pushOperationControl();
        this.getTableDatas();
    }

    getTableDatas = () => {
        this.setState({isLoading: true});
        setTimeout(() => {
            fetchDatas(`/terminal/v1/command/`, result => {
                this.setState({
                    isLoading: false,
                    tableDatas: result
                });
            });
        }, 500)
    };

    pushOperationControl = () => {
        const operation = {
            title: '操作', width: "120px", dataIndex: 'operation',
            render: (text, record) => {
                return (
                    <div className="displayflexcenter">
                        <Tooltip title="回放" onClick={() => this.replay(record.session)}>
                            <Icon type="play-circle"/>
                        </Tooltip>
                        &nbsp;&nbsp;&nbsp;
                        <ViewMore reloadData={this.getTableDatas}
                                  keyWord={"viewMoreSessionCommand"}
                                  record={record}/>
                    </div>
                );
            }
        };
        let result = commandsHeader.find(item => item.dataIndex === "operation");
        if (!result) commandsHeader.push(operation);
    };
    /**回放**/
    replay = (session) => {
        this.setState({isLoading: true});
        setTimeout(() => {
            this.setState({isLoading: false});
            window.open(`${Config.api}/luna/replay/${session}/`, '测试可链接性', 'height=500, width=800');
        }, 500);
    };
    /**不可选开始日期**/
    disabledStartDate = date_start => {
        const date_expired = this.state.date_expired;
        if (!date_start || !date_expired) {
            return false;
        }
        return date_start.valueOf() > date_expired.valueOf();
    };
    /**不可选开始日期**/
    disabledEndDate = date_expired => {
        const date_start = this.state.date_start;
        if (!date_expired || !date_start) {
            return false;
        }
        return date_expired.valueOf() <= date_start.valueOf();
    };
    /**开始时间**/
    onStartChange = (value, dataString) => {
        this.setState({
            date_start: `${dataString} +0800`
        })
    };
    /**结束时间**/
    onEndChange = (value, dataString) => {
        this.setState({
            date_expired: `${dataString} +0800`
        })
    };
    handleStartOpenChange = open => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };
    handleEndOpenChange = open => {
        this.setState({endOpen: open});
    };
    /**搜索**/
    onSearchTables = (value) => {
        this.setState({isLoading: true});
        fetchDatas(`/terminal/v1/command/?search=${value}`, result => {
            this.setState({
                isLoading: false,
                tableDatas: result,
            });
        });
    };

    /**导出表格数据**/
    downloadExcel = () => {
        let data = {
            'resources': this.state.selectedRowKeys
        };
        let {date_start,date_expired}=this.state;
        postDatas("/common/v1/resources/cache/", data).then((result) => {
            window.open(`${Config.api}/api/terminal/v1/commands/export/?date_from=${Date.parse(date_start)}&date_to=${Date.parse(date_expired)}`);
        })
    };
    /**表格多选**/
    onSelectChange = selectedRowKeys => {
        this.setState({selectedRowKeys});
    };
    render() {
        const {tableDatas, isLoading,selectedRowKeys,date_start,date_expired,endOpen} = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <div onClick={this.downloadExcel}>导出Excel</div>
                </Menu.Item>
            </Menu>
        );
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="wrapper">
                <div className="displayflexend">
                    <SearchInput onSearch={this.onSearchTables} placeholder="请输入..."/>
                    <div className="displayflexstart">
                        <div className="displayflexstart" style={{flexFlow: "nowrap", margin: 0}}>
                            &nbsp; &nbsp; &nbsp;
                            <DatePicker
                                disabledDate={this.disabledStartDate}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                value={moment(date_start, 'YYYY-MM-DD HH:mm:ss')}
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                            />
                            &nbsp; &nbsp; &nbsp;
                            <DatePicker
                                disabledDate={this.disabledEndDate}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                value={moment(date_expired, 'YYYY-MM-DD HH:mm:ss')}
                                onChange={this.onEndChange}
                                open={endOpen}
                                onOpenChange={this.handleEndOpenChange}
                            />

                        </div>
                    </div>
                    <Dropdown overlay={menu} placement="bottomCenter">
                        <Button type="primary">表格CVS</Button>
                    </Dropdown>
                </div>
                <Table rowKey="id"
                       size={tableConfig.size}
                       scroll={tableConfig.scroll}
                       pagination={tableConfig.pagination}
                       bordered={tableConfig.bordered}
                       loading={isLoading}
                       dataSource={tableDatas}
                       rowSelection={rowSelection}
                       columns={commandsHeader}
                />
            </div>
        );
    }
}
