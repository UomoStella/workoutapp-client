import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';

import { Drawer, notification, Button, Row, Col, Tabs, Icon, Typography, Breadcrumb, List, Modal } from 'antd';
import RationEdit from './RationEdit';
import { RecipeService } from '../../../service/RecipeService';

import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';

import { ACCESS_TOKEN } from '../../../constants';


const {confirm} = Modal;
const { TabPane } = Tabs;
const { Title } = Typography;

class RationMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            
            rationList: [],
            isLoadRationList: false,

            selectedRationId: '',
            visible: false,

            serverError: false,
            notFound: false,
            isLoading: false
        };

        this.getContentValue = this.getContentValue.bind(this);
        this.getShortListView = this.getShortListView.bind(this);
        this.deleteRation = this.deleteRation.bind(this);
        

        this.recipeService = new RecipeService();


        this.showDrawerVal = this.showDrawerVal.bind(this);    
    }


    getContentValue(rationDayId){
        this.setState({
            isLoading: true,
        });

        this.recipeService.getRationMediaByRID(rationDayId).then(response => {
            const rationDayResp  = response.data;

            this.setState({
                id: rationDayId,
                name: rationDayResp.name,
                description: rationDayResp.description,

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

    getShortListView(rationDayId){
        rationDayId = rationDayId != null ? rationDayId : this.state.id;
        this.setState({
            isLoadRationList: true
        });

        this.recipeService.getRationShortListByRID(rationDayId).then(response => {
            this.setState({
                rationList: response.data.containerList,
                visible: false,
                isLoadRationList: false
            });   
        }).catch(error => {
            this.setState({
                rationList: [],
                visible: false,
                isLoadRationList: false
            });   
        }); 
    }


    showDrawer = () => {
        this.setState({
            selectedRationId: '',
            visible: true,
        });
      };

    showDrawerVal = (value) => {
        this.setState({
            selectedRationId: value,
            visible: true,
        });
       };
    
      onClose = () => {
        this.setState({
            visible: false,
        });
      };

      deleteRation(id){

        const thisPrev = this;

        confirm({
            title: 'Вы уверены что хотите удалить?',
            content: 'Данные невозможно будет восстановить.',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                const data = new FormData();
                    data.append('id', id);
                thisPrev.recipeService.postRationDelete(data).then(response => {
                    notification.success({
                        message: 'Собщение',
                        description: 'Рацион успешно удалён!'
                    });
                    thisPrev.getShortListView();
                    
                }).catch(error => {
                    notification.error({
                        message: 'Ошибка',
                        description: 'Извините! Что-то пошло не так. Попытайтесь снова!'
                    });
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });    
    }


    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        
        const rationDayId = this.props.match.params.rationDayId;    
        this.getContentValue(rationDayId);
        this.getShortListView(rationDayId);
    }
    
    render() {   
        if(this.state.isLoading) {
            return <div className="content-div"><LoadingIndicator/></div>
        }
        if(this.state.notFound) {
            return <NotFound />;
        }
        if(this.state.serverError) {
            return (<ServerError />);
        }

        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/ration/all'}>Список дневных рационов</Link></Breadcrumb.Item>
                        {this.state.id ? 
                            <Breadcrumb.Item><Link to={'/ration/media/'+this.state.id}>Дневной рацион</Link></Breadcrumb.Item>
                        : null}
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <Row  gutter={[16, 16]}>
                        <Col md={18}>
                            <h2>Дневной рацион</h2>
                            <p>Наименование: <span>{this.state.name}</span></p>
                            <p className="whiteSpace">Описание: <span>{this.state.description}</span></p>
                        </Col>
                        <Col md={6}>
                            <div style={{textAlign: 'right'}}>
                                <Link to={ '/ration/details/'+ this.state.id }>
                                    <Button type="primary"><Icon type="edit" /> Редактировать</Button>
                                </Link>
                                <br/>
                                <Link to={'/ration/view/'+this.state.id }>
                                    <Button className="margintop10" icon="eye"> Просмотреть</Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[0, 40]}>
                        <Col span={24}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<span><Icon type="schedule"/>Список блюд</span>} key="1">
                                    <div style={{textAlign: 'right'}}>
                                        <Button type="primary" onClick={this.showDrawer}><Icon type="plus" /> Добавить</Button>
                                    </div>
                                    {this.state.isLoadRationList ?
                                        <LoadingIndicator/>
                                    :
                                        <div>
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={this.state.rationList}
                                                renderItem={item => (
                                                <List.Item actions={[
                                                <Link to={'/ration/view/'+this.state.id +'/'+ item.id}>Вид</Link>, 
                                                <a onClick={this.showDrawerVal.bind(this, item.id)} key="list-loadmore-more">Изменить</a>,
                                                <a onClick={this.deleteRation.bind(this, item.id)} key="list-loadmore-more">Удалить</a>
                                                ]}>
                                                    <List.Item.Meta
                                                    title={<span>{item.recipeResponse != null ? item.recipeResponse.name : null}</span>}
                                                    description={<span>{item.recipeResponse != null ? item.recipeResponse.description : null}</span>}
                                                    />
                                                </List.Item>
                                                )}
                                            />
                                        </div>
                                    }
                                    
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                    
                    <Drawer title="Редактирование рецепта"
                        width={720}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        bodyStyle={{ paddingBottom: 80 }}>
                        {this.state.visible ?
                            <RationEdit getShortListView={this.getShortListView} 
                                rationDayId={this.state.id}
                                rationId={this.state.selectedRationId}/>
                            :  null}
                    </Drawer>
                </div>
            </div>
        
        );
    }
}

export default withRouter(RationMedia);