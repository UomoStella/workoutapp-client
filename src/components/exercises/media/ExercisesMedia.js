import React, { Component } from 'react';
import { TrainingService } from '../../../service/TrainingService';
import { FileService } from '../../../service/FileService';
import {withRouter, Link } from 'react-router-dom';
import { notification, Button, Row, Col, Tabs, Icon, Upload, Input, Breadcrumb } from 'antd';
import './ExercisesMedia.css';
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import { ACCESS_TOKEN, API_BASE_URL } from '../../../constants';
import ExcersicesLogo from '../../../resources/excersices.jpg';
import VideoPlayer from '../../player/VideoPlayer';

const { TabPane } = Tabs;


class ExercisesMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : '',
            name: '',
            description: '',
            isPrivate: false,
            subtypeTrainingName: '',
            muscleGroupsValue: '',
            image: [],
            videoFile: [],
            linkVideoInput: '',
            linkVideo: '',
            imageBase64: '',
            videoFileLink: '',
            hasVideoFile: false,

            isLoading: true,
            isLoadingLinkVideo: false,
            isLoadingFile: false,
            serverError: false,
            notFound: false,
        }

        this.getExercisesMedia = this.getExercisesMedia.bind(this);        
        this.handleUploadImageFile = this.handleUploadImageFile.bind(this);
        this.handleUploadVideoFile = this.handleUploadVideoFile.bind(this);
        this.handleDeleteImageFile = this.handleDeleteImageFile.bind(this);
        this.handleDeleteVideoFile = this.handleDeleteVideoFile.bind(this);
        this.handleChangeLinkVideo = this.handleChangeLinkVideo.bind(this);
        this.handleSaveVideoFile = this.handleSaveVideoFile.bind(this);
        
        
        this.trainingService = new TrainingService();
        this.fileService = new FileService();
    }

    handleUploadImageFile = (event) => {
        // let file = event.target.files[0];
        let file = event;
        const data = new FormData();
            data.append('file', file);
            data.append('id', this.state.id);
        
        this.fileService.uploadExercisesImage(data).then((response) => {
            if(response.data == null || response.data.length == 0)
                return;

            this.setState({
                imageBase64:  response.data,
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


    handleUploadVideoFile = (event) => {
        this.setState({
            isLoadingFile: true
        })

        let file = event;
    
        const data = new FormData();
            data.append('file', file);
            data.append('id', this.state.id);
        
        this.fileService.uploadExercisesFileVideo(data).then((response) => {
            if(response.data == null || response.data.length == 0)
                return;

            this.setState({
                videoFileLink:  response.data,
                hasVideoFile: true,
                isLoadingFile: false
                
            })
            notification.success({
                message: 'Сообщение',
                description: "Файл успешно загружен.",
              });
        }).catch((error) => {
            this.setState({
                isLoadingFile: false
            });
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить файл!'
            });
        });
    };


    handleDeleteImageFile = (event) => {    
        const data = new FormData();
            data.append('id', this.state.id);
        
        this.fileService.deleteExercisesImage(data).then((response) => {
            this.setState({
                imageBase64:  ''
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

    handleDeleteVideoFile = (event) => {      
        const data = new FormData();
            data.append('id', this.state.id);  

        this.fileService.deleteExercisesFileVideo(data).then((response) => {
            this.setState({
                linkVideo:  '',
                hasVideoFile: false
            });
        
            notification.success({
                message: 'Сообщение',
                description: "Файл успешно удалён.",
              });
        }).catch((error) => {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить файл!'
            });
        });
    };
    
    handleChangeLinkVideo = (event) =>{
        this.setState({
            linkVideoInput :event.target.value
        })
    }


    handleSaveVideoFile = (event) => {
        this.setState({
            isLoadingLinkVideo: true,
        });


        const data = new FormData();
            data.append('id', this.state.id); 
            data.append('linkvideo', this.state.linkVideoInput); 

        this.fileService.updateVideoLink(data).then((response) => {
            this.setState({
                linkVideo:  this.state.linkVideoInput,
                isLoadingLinkVideo: false,
            });
        
            notification.success({
                message: 'Сообщение',
                description: "Ссылка успешно изменена.",
              });
        }).catch((error) => {
            this.setState({
                isLoadingLinkVideo: false,
            });
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось изменить ссылку!'
            });
        });
    }


    getExercisesMedia(exercisesId){
        this.setState({
            isLoading: true,
        });

        this.trainingService.getExercisesMediaById(exercisesId)
        .then(response => {
            const exercisesRespons  = response.data;
            console.log(exercisesRespons);
            this.setState({
                id : exercisesId,
                name: exercisesRespons.name,
                description: exercisesRespons.description,
                isPrivate: exercisesRespons.isPrivate,
                subtypeTrainingName: exercisesRespons.subtypeTrainingName,
                muscleGroupsNameSet: exercisesRespons.muscleGroupsNameSet,
                                
                linkVideo: (exercisesRespons.linkVideo == null ? '':exercisesRespons.linkVideo),
                linkVideoInput: (exercisesRespons.linkVideo == null ? '':exercisesRespons.linkVideo),
                imageBase64: exercisesRespons.imageBase64,
                hasVideoFile: exercisesRespons.hasVideoFile,
                videoFileLink: exercisesRespons.videoFileLink,
                hasVideoFile: exercisesRespons.hasVideoFile,

                isLoading: false,
            });   
            
            
        }).catch(error => {
            notification.error({
                message: 'Polling App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
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
        const exercisesid = this.props.match.params.exercisesid; 
        
        this.getExercisesMedia(exercisesid);
    }


    render() {
        if(this.state.notFound) {
            return <NotFound />;
        }
        if(this.state.serverError) {
            return (<ServerError />);
        }

        const imageBase64 = "data:image/png;base64, "+ this.state.imageBase64;

        const thisPrev = this;
        const propsUploadImage = {
            beforeUpload: file => {
                thisPrev.handleUploadImageFile(file);
              return false;
            },
          };
          const propsUploadVideoFile = {
            beforeUpload: file => {
                thisPrev.handleUploadVideoFile(file);
              return false;
            },
          };

        const linkButton = "/exercises/edit/" + this.state.id;

        const linkVideoFile = API_BASE_URL + "/fields/video/" + this.state.videoFileLink;
        const linkVideo = this.state.linkVideo;
        const imageAccept=".jpg,.jpeg,.png";
        const videoAccept=".mp4";

        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/exercises/all'}>Список упражнений</Link></Breadcrumb.Item>
                        {this.state.id ?
                            <Breadcrumb.Item><Link to={'/exercises/media/'+this.state.id}>Упражнение</Link></Breadcrumb.Item>
                        : null}
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    {this.state.isLoading ?
                        <LoadingIndicator/>
                    :
                    <div className="col-exercises_media">        
                        <Row  style={{overflow: 'auto'}}>
                            <Col md={20} style={{overflow: 'hidden'}}>
                                <p className="text-main-exercises_media">Упражнение: <span>{this.state.name}</span></p>
                                <p className="text-exercises_media">Описание: <span className="whiteSpace">{this.state.description}</span></p>
                                <p className="text-exercises_media">Подтип тренировки: <span>{this.state.subtypeTrainingName}</span></p>
                                {!this.state.muscleGroupsNameSet.length == 0 ? 
                                    <div className="list-muscle_groups-exercises_media">
                                        <span>Воздействие на группу мышц:</span>
                                        <ul>
                                            {this.state.muscleGroupsNameSet.map(muscleGroup => (<li> {muscleGroup} </li>))}
                                        </ul>
                                    </div>
                                : null}
                                
                            </Col>
                            <Col md={4}>
                                {this.state.id != null ?
                                    <div>
                                        <div className="col-btn-right">
                                        <Link to={linkButton}><Button type="primary" icon="edit">Редактировать</Button> </Link>
                                        </div>
                                    </div>
                                : null}
                            </Col>
                        </Row>
                        <Row gutter={[0, 40]}>
                            <Col span={24}>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab={<span><Icon type="file-image"/>Загрузить изображение</span>} key="1">
                                        <Row className="col-imageupload-exercises_media">
                                            <Col md={18}>
                                            {!this.state.imageBase64.length == 0 ?
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
                                    </TabPane>
                                
                                    <TabPane tab={<span><Icon type="video-camera" /> Загрузить видео </span>} key="2">
                                        <Row className="col-videofile-exercises_media">
                                            <Col md={18}>
                                                {this.state.isLoadingFile ?
                                                    <LoadingIndicator/>
                                                    :
                                                    <div>
                                                        {this.state.hasVideoFile ?
                                                        <VideoPlayer
                                                            url={linkVideoFile} 
                                                            playing={false} />
                                                        :
                                                        <p className="noFile">Видео не загружено</p>}
                                                    </div>
                                                }
                                            </Col>
                                            <Col md={6}>
                                                <div  className="col-btn-right">
                                                    <Upload accept={videoAccept} showUploadList={false} {...propsUploadVideoFile}>
                                                        <Button className="btn-upload" type="primary"><Icon type="upload" /> Загрузить файл</Button>
                                                    </Upload>
                                                    <br/>
                                                    <Button className="btn-delete" icon="delete" onClick={this.handleDeleteVideoFile}>Удалить файл</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    
                                    <TabPane tab={<span><Icon type="youtube" /> Ссылка на видео</span>} key="3" >
                                        <div className="link-input-field">
                                            <Input value={this.state.linkVideoInput} onChange={this.handleChangeLinkVideo}/>
                                            <Button icon="link" onClick={this.handleSaveVideoFile}>Сохранить ссылку</Button>
                                        </div>
                                        
                                        {this.state.isLoadingLinkVideo ?
                                            <LoadingIndicator/>
                                        :
                                            <div>
                                                {this.state.linkVideo != null && this.state.linkVideo.length != 0 ?
                                                <VideoPlayer url={linkVideo} playing={false} />
                                                    :
                                                null
                                                }
                                            </div>
                                        }          
                                    </TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                    </div>
                    }
                </div>
            </div>
        );
    }
}



export default withRouter(ExercisesMedia);
