import React, { Component } from 'react';
import { Row, Col, notification, Tabs, Button, Drawer, Icon} from 'antd';
import { PerformanceService } from '../../../service/PerformanceService';
import { ACCESS_TOKEN } from '../../../constants';
import TrainingDescriptionElement from '../../../components/core/trainingprogram/TrainingDescriptionElement';
import ButtonNext from './ButtonNext';
import Timer from '../../Timer';

import ARNIEND from '../../../resources/ARNIEND.png';
import Arni from '../../../resources/arni.jpg';
import LoadingIndicator from '../../LoadingIndicator';
import ServerError  from '../../../error/ServerError';
import NotFound from '../../../error/NotFound';

const { TabPane } = Tabs;

class DWUPerformance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            dwId: '',
            dwName: '',
            dwDescription: '',
            dwDay: '',
            tpDurationDays: '',
            tpId: '',
            tpName: '',
            isDone: '',
            prevId:'',
            activeKey: "0",
            timerTimeLeft: null,
            tdList: [],

            isLoading: true,
            serverError: false,
            notFound: false,
            visible: false,
        };

        this.performanceService = new PerformanceService();
        this.getContentVIEW = this.getContentVIEW.bind(this);
        this.chandeActiveKey = this.chandeActiveKey.bind(this);
        this.dwuDone = this.dwuDone.bind(this);
        this.dwuDoneAndSave = this.dwuDoneAndSave.bind(this);
        this.goPrev = this.goPrev.bind(this);
    
        this.showDrawer = this.showDrawer.bind(this);
    
    }

    goPrev = () => {
        if(this.state.prevId)
            this.getContentVIEW(this.state.prevId); 
            this.props.handleMessage('/performance/dwu/'+this.state.prevId, '');
      };


    showDrawer = (timeLeft) => {
        this.setState({
          visible: true,
          timerTimeLeft : timeLeft
        });
      };
    
      onClose = () => {
        this.setState({
          visible: false,
        });
      };

    chandeActiveKey(){
        const tabIndex = 1 + Number.parseInt(this.state.activeKey);
        this.setState({
            activeKey: tabIndex.toString(),
            timerTimeLeft : null
        })
    }

    dwuDone(){
        const data = new FormData();
            data.append('dwuid', this.state.id);
        this.performanceService.postDWUdone(data).then(response => {

            this.props.handleMessage('/performance/tp', 'success', 'Данные успешно сохранены');
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        });
    }

    dwuDoneAndSave(){
        const data = new FormData();
            data.append('dwuid', this.state.id);
        this.performanceService.postDWUdoneAndSave(data).then(response => {

            this.props.handleMessage('/performance/tp', 'success', 'Данные успешно сохранены');
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        });
    }

    

    getContentVIEW(dwuID){
        this.setState({
            isLoading: true,
        });

        this.performanceService.getAllDWUbyID(dwuID)
        .then(response => {
            this.setState({
                id: response.data.id,
                dwId: response.data.dwId,
                dwName: response.data.dwName,
                dwDescription: response.data.dwDescription,
                tpId:  response.data.tpId,
                dwDay: response.data.dwDay,
                tpDurationDays: response.data.tpDurationDays,
                tpName: response.data.tpName,
                isDone: response.data.isDone,
                prevId: response.data.prevId,
            
                tdList: response.data.tdList,

                isLoading: false,
            });
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false,
                    serverError: false
                });
            } else {
                this.setState({
                    serverError: true,
                    notFound: false,
                    isLoading: false
                });        
            }
        });
    }

    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }

        const dwuID = this.props.match.params.dwuid; 
        this.getContentVIEW(dwuID);
    }

    changeTab = (activeKey) => {
        this.setState({
            activeKey: activeKey
        });
      };

    render() {   
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }
        if(this.state.notFound) {
            return <NotFound />;
        }
        if(this.state.serverError) {
            return (<ServerError />);
        }
        const activeKey = this.state.activeKey;

        const valueList = [];
        this.state.tdList.forEach((value, index) => { 
            valueList.push(
                <TabPane tab={value.exercises.name} key={index}>
                    <div style={{paddingTop: '10px'}}>
                    {this.state.isDone ?
                        <ButtonNext visibleTab={true} chandeActiveKey={this.chandeActiveKey}/>
                        :
                        <ButtonNext visibleTab={false} chandeActiveKey={this.chandeActiveKey}/>}
                    </div>
                    {value.leadTime != null && value.leadTime > 0 ?
                        <Button type="primary" onClick={this.showDrawer.bind(this, value.leadTime)}>Запустить таймер</Button>
                    : null}
                    <TrainingDescriptionElement trainingDescriptions={value} />
                </TabPane>
            );
        });
        
        return (
        <div>
            <Row  gutter={[16, 16]}>
                <Col span={24}>
                    {!this.state.isLoading ?
                    <div>
                        {this.state.tdList.length != 0 ?
                        <div>
                            {this.state.prevId ? 
                                <div className="btn-row-div">
                                    <Button onClick={this.goPrev}><Icon type="left" />Предыдущая тренировка</Button>
                                </div>
                                : null}
                            <Tabs activeKey={this.state.activeKey} tabPosition="left" onChange={this.changeTab}>
                                {valueList}
                                {this.state.isDone ?
                                null 
                                :
                                <TabPane tab="Закончить тренировку" key={this.state.tdList.length}>
                                    <Row gutter={[0],[10]}>
                                        {this.state.dwDay >= this.state.tpDurationDays ?
                                        <div>
                                            <Col md={12}>
                                                <img src={ARNIEND} style={{height: '400px', width: '100%'}}/>
                                            </Col>
                                            <Col md={12}>
                                                <h2>Последняя тренировка! </h2>
                                                <p>Внимание это последняя тренировка, если вы ходите проёти эту программу снова - нажмите на кнопку "Закончить и продолжить", если не хотите больше заниматься по ней нажмите "Закончить программу". И помни тяжелый труд вознаграждается.</p>
                                                <Button type="primary" style={{marginRight: '5px'}} onClick={this.dwuDoneAndSave}>ЗАКОНЧИТЬ И ПРОДОЛЖИТЬ</Button>
                                                <Button type="danger" onClick={this.dwuDone}>ЗАКОНЧИТЬ ТРЕНИРОВКУ</Button>
                                            </Col>
                                        </div>
                                        :
                                        <div>
                                            <Col md={12}>
                                                <img src={Arni} style={{height: '400px', width: '100%'}}/>
                                            </Col>
                                            <Col md={12}>
                                                <h2>Треноровка закончена! </h2>
                                                <p>Помни, что каждая тренировка приближает тебя к цели, не пропускай её ведь это будет означать поражение.</p>
                                                <Button type="danger" onClick={this.dwuDone}>ЗАКОНЧИТЬ ТРЕНИРОВКУ</Button>
                                            </Col>
                                        </div>
                                        }
                                    </Row>
                                </TabPane>
                                }
                            </Tabs>
                        </div>
                        :
                        <p>Нет данных!!</p>
                        }
                    </div>
                    :
                    <LoadingIndicator/>
                }
                </Col>
            </Row>
            <Drawer
                title="Таймер"
                placement="right"
                onClose={this.onClose}
                visible={this.state.visible}
                >
                {this.state.timerTimeLeft ?
                <Timer timeLeft={this.state.timerTimeLeft}/>
                : null}
            </Drawer>
        </div>
    );
    }
}

export default DWUPerformance;