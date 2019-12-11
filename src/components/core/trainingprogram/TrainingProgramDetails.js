import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { notification, Button, Row, Col, Tabs, Icon, Upload, Input, List, Skeleton } from 'antd';

import { TrainingProgramService } from '../../../service/TrainingProgramService';
import { DailyWorkoutService } from '../../../service/DailyWorkoutService';



import { FileService } from '../../../service/FileService';

import UserSelectModal from './UserSelectModal';
import ExcersicesLogo from '../../../resources/excersices.png';

import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';

import { ACCESS_TOKEN } from '../../../constants';


const { TabPane } = Tabs;


class TrainingProgramDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            durationDays: 0,
            genderName: '',
            hasImage: false,
            base64Image: '',
            IsPrivate: false,
            dailyWorkoutResponseList: [],
            userDetails: [],
            isModelShow: false,
            UserSelectId: undefined,
            usersPrivate: [],

            serverError: false,
            notFound: false,
            isPrivateLoading: false,
            isLoading: false
        };


        this.getTrainingProgramDetails = this.getTrainingProgramDetails.bind(this);
        this.handleUploadImageFile = this.handleUploadImageFile.bind(this);
        this.handleUploadImageFile = this.handleUploadImageFile.bind(this);
        this.saveUserPrivate = this.saveUserPrivate.bind(this);
        this.deleteUserPrivate = this.deleteUserPrivate.bind(this);
        this.handleGetPrivateList = this.handleGetPrivateList.bind(this);
        this.deleteDailyWorkout = this.deleteDailyWorkout.bind(this);

        this.trainingProgramService = new TrainingProgramService();
        this.dailyWorkoutService = new DailyWorkoutService();
        
        this.fileService = new FileService()
    }


    deleteDailyWorkout(dwId){
        const data = new FormData();
            data.append('dwid', dwId);

        this.dailyWorkoutService.postDeleteDailyWorkout(data)
        .then((response) => {
            notification.success({
                message: 'Сообщение',
                description: "Запись удален.",
            });
            this.getTrainingProgramDetails(this.state.id)
        }).catch((error) => {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить!'
            });
        });  
    }

    saveUserPrivate = (username) => {
        const data = new FormData();
            data.append('username', username);
            data.append('id', this.state.id);
        const thisPrev = this;
        this.trainingProgramService.postEditDetailsPrivate(data)
        .then((response) => {
            notification.success({
                message: 'Сообщение',
                description: "Пользователь добавлен.",
              });
              this.handleGetPrivateList();
        }).catch((error) => {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось добавить пользоватея!'
            });
        });        
      }

      deleteUserPrivate = (username) => {
        const data = new FormData();
            data.append('username', username);
            data.append('id', this.state.id);
        const thisPrev = this;
        this.trainingProgramService.postEditdetailsPrivateDelete(data)
        .then((response) => {
            notification.success({
                message: 'Сообщение',
                description: "Пользователь удален.",
              });
              this.handleGetPrivateList();
        }).catch((error) => {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить пользоватея!'
            });
        });        
      }

      


    getTrainingProgramDetails(trainingProgramId){
        this.setState({
            isLoading: true,
        });

        this.trainingProgramService.getTrainingProgramEditDetailsById(trainingProgramId).then(response => {
            const exercisesResTrainingProgram  = response.data.trainingProgramResponse;
            const dailyWorkoutResponseList  = response.data.dailyWorkoutResponseList;

            console.log(exercisesResTrainingProgram);
            console.log(dailyWorkoutResponseList);
            this.setState({
                id: exercisesResTrainingProgram.id,
                name: exercisesResTrainingProgram.name,
                description: exercisesResTrainingProgram.description,
                durationDays: exercisesResTrainingProgram.durationDays,
                genderName: exercisesResTrainingProgram.genderName,
                hasImage: (exercisesResTrainingProgram.base64Image.length == 0 ? false : true),
                base64Image: exercisesResTrainingProgram.base64Image,
                IsPrivate: exercisesResTrainingProgram.isPrivate,
                userDetails: exercisesResTrainingProgram.userDetails,
                usersPrivate: exercisesResTrainingProgram.usersPrivate,

                dailyWorkoutResponseList: dailyWorkoutResponseList,
                
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

    handleUploadImageFile = (file) => {
        const data = new FormData();
            data.append('file', file);
            data.append('id', this.state.id);
        this.fileService.uploadTrainingProgramImage(data).then((response) => {
            if(response.data == null || response.data.length == 0)
                return;
            this.setState({
                base64Image:  response.data,
            });
            notification.success({
                message: 'Сообщение',
                description: "Файл успешно загружен.",
              });
        }).catch((error) => {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить файл!'
            });
        });
    };



    handleGetPrivateList = () =>{
        this.setState({
            isPrivateLoading: true
        })
        this.trainingProgramService.getTrainingprogramEditDetailsPrivate(this.state.id)
            .then((response) => {
                const privateList = response.data.containerList;
            if(privateList == null || privateList.length == 0)
                this.setState({
                    isPrivateLoading: false,
                    usersPrivate: []
                })
            else
                this.setState({
                    isPrivateLoading: false,
                    usersPrivate: privateList
                })
        }).catch((error) => {
            this.setState({
                isPrivateLoading: false
            })
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить информацию о приватности!'
            });
        });
    };

    handleDeleteImageFile = (event) => {    
        const data = new FormData();
            data.append('id', this.state.id);
        
        this.fileService.deleteTrainingProgramImage(data).then((response) => {
            this.setState({
                base64Image:  ''
            });
        
            notification.success({
                message: 'Сообщение',
                description: "Изображение успешно удалено.",
              });
        }).catch((error) => {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить файл!'
            });
        });
    };



    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        const trainingProgramId = this.props.match.params.trainingprogramId; 
    
        
        this.getTrainingProgramDetails(trainingProgramId);
    }

    
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

        const imageBase64 = "data:image/png;base64, "+ this.state.base64Image;

        const thisPrev = this;
        const propsUploadImage = {
            beforeUpload: file => {
                thisPrev.handleUploadImageFile(file);
              return false;
            },
          };

        const imageAccept=".jpg,.jpeg,.png";

        console.log(this.state.IsPrivate);
        return (
            <div>
                    <Row  gutter={[16, 16]}>
                        <Col md={18}>
                            <h2>Программа тренировок</h2>
                            <p>Программа тренировок: <span>{this.state.name}</span></p>
                            <p>Описание: <span>{this.state.description}</span></p>
                            <p>Количество дней: <span>{this.state.durationDays}</span></p>
                        </Col>
                        <Col md={6}>
                            <div style={{textAlign: 'right'}}>
                                <Link to={'/trainingprogram/edit/'+ this.state.id}><Button type="primary"><Icon type="edit" /> Редактировать</Button></Link>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[0, 40]}>
                        <Col span={24}>
                        <Tabs defaultActiveKey="2">
                            <TabPane tab={<span><Icon type="file-image"/>Загрузить изображение</span>} key="1">
                                <Row className="col-imageupload-exercises_media">
                                    <Col md={18}>
                                    {!this.state.base64Image.length == 0 ?
                                        <img src={imageBase64} alt="Red dot" />
                                        :
                                        <img src={ExcersicesLogo} alt="Red dot" />
                                    }
                                    </Col>
                                    <Col md={6}>
                                        <div className="col-btn-right">
                                            <Upload accept={imageAccept} showUploadList={false} {...propsUploadImage}>
                                                <Button className="btn-upload" type="primary"><Icon type="upload" /> Загрузить файл</Button>
                                            </Upload>
                                            <br/>
                                            <Button className="btn-delete" icon="delete" onClick={this.handleDeleteImageFile}>Удалить файл</Button>
                                        </div>
                                    </Col>
                                </Row>
                            
                                {/* <input type="file" name="image" accept={imageAccept}
                                    onChange={this.handleUploadImageFile}/> */}
                                
                            </TabPane>
                        
                            <TabPane tab={<span><Icon type="schedule"/> Программа тренировок по дням </span>} key="2">
                                <Row>
                                    {this.state.dailyWorkoutResponseList.length != 0 ?
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={this.state.dailyWorkoutResponseList}
                                            renderItem={item => (
                                            <List.Item actions={[<Link to={item.id != null ?
                                            '/workout/details/edit/'+ item.trainingProgramId+'/'+ item.day
                                            : 
                                            '/workout/edit/'+ item.trainingProgramId+'/'+ item.day}>Изменить</Link>, 
                                            <span>{item.id != null ?
                                                <a onClick={this.deleteDailyWorkout.bind(this, item.id)} key="list-loadmore-more">Очистить</a>
                                                :
                                                null}    
                                            </span>]}>
                                                <List.Item.Meta
                                                title={<span>{item.day} день ({item.id == null ? 'Нет данных' : item.name})</span>}
                                                description={<span>{item.description}</span>}
                                                />
                                            </List.Item>
                                            )}
                                        />
                                        : 
                                        <p>Не данных по дням.</p>
                                    }
                                </Row>                               
                            </TabPane>

                            <TabPane tab={<span><Icon type="user"/> Программу используют </span>} key="3">
                                <Row>
                                    {this.state.userDetails.length != 0 ?
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={this.state.userDetails}
                                            renderItem={item => (
                                            <List.Item actions={[<Link to={'/user/profile'}>Профиль</Link>, <a key="list-loadmore-more">Очистить</a>]}>
                                                <List.Item.Meta
                                                title={<span>{item.lastName} {item.firstName}  ({item.name})</span>}
                                                description={<span>{item.gender}</span>}
                                                />
                                            </List.Item>
                                            )}
                                        />
                                        : 
                                        <p>Не данных по дням.</p>
                                    }
                                </Row>                               
                            </TabPane>
                            

                            {this.state.IsPrivate ?
                                <TabPane tab={<span><Icon type="eye"/> Приватность </span>} key="4">
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab={<span>Список пользователей</span>} key="1">
                                            <Row>
                                                {this.state.isPrivateLoading ?
                                                    <LoadingIndicator/>
                                                    :
                                                    <div>
                                                        {this.state.usersPrivate.length != 0 ?
                                                            <List
                                                                itemLayout="horizontal"
                                                                dataSource={this.state.usersPrivate}
                                                                renderItem={item => (
                                                                <List.Item actions={[<a onClick={this.deleteUserPrivate.bind(this, item.username)} key="list-loadmore-more">Удалить</a>,]}>
                                                                    <List.Item.Meta
                                                                    title={<span>{item.lastName} {item.firstName}  ({item.name})</span>}
                                                                    description={<span>{item.gender}</span>}
                                                                    />
                                                                </List.Item>
                                                                )}
                                                            />
                                                            : 
                                                            <p>Не данных по дням.</p>
                                                        }
                                                    </div>
                                                }
                                            
                                            </Row>     
                                        </TabPane>
                                        <TabPane tab={<span>Добавить пользователя</span>} key="2">
                                            <Row>
                                                <UserSelectModal saveUser={this.saveUserPrivate} placeholder="Введите имя польователя" style={{ width: '100%' }} />
                                            </Row>     
                                        </TabPane>
                                    </Tabs>                   
                                </TabPane>
                                :
                                null
                            }
                    
                        </Tabs>
                        </Col>
                    </Row>
                    
            </div>
        
        );
    }
}

export default withRouter(TrainingProgramDetails);
