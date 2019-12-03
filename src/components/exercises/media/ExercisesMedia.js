import React, { Component } from 'react';
import { TrainingService } from '../../../service/TrainingService';
import { FileService } from '../../../service/FileService';
import {withRouter, Link } from 'react-router-dom';
import { notification, Button, Row, Col, Tabs, Icon } from 'antd';
import './ExercisesMedia.css';
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import { ACCESS_TOKEN } from '../../../constants';
import ExcersicesLogo from '../../../resources/excersices.png';
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
            // image: [],
            videoFile: [],
            linkVideoInput: '',
            linkVideo: '',
            imageBase64: '',
            videoFileLink: '',
            hasVideoFile: false,

            isLoading: true,
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
        let file = event.target.files[0];
    
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

        }).catch(function (error) {
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

        let file = event.target.files[0];
    
        const data = new FormData();
            data.append('file', file);
            data.append('id', this.state.id);
        
        this.fileService.uploadExercisesFileVideo(data).then((response) => {
            if(response.data == null || response.data.length == 0)
                return;

            this.setState({
                linkVideo:  response.data,
                hasVideoFile: true,
                isLoadingFile: false
                
            })
            notification.success({
                message: 'Сообщение',
                description: "Файл успешно загружен.",
              });
        }).catch(function (error) {
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
        }).catch(function (error) {
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
        }).catch(function (error) {
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
        const data = new FormData();
            data.append('id', this.state.id); 
            data.append('linkvideo', this.state.linkVideoInput); 

        this.fileService.updateVideoLink(data).then((response) => {
            this.setState({
                linkVideo:  this.state.linkVideoInput,
            });
        
            notification.success({
                message: 'Сообщение',
                description: "Ссылка успешно изменена.",
              });
        }).catch(function (error) {
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
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return (<ServerError />);
        }

        var styleSpan = {
            fontWeight: '700'
        }
        const imageBase64 = "data:image/png;base64, "+ this.state.imageBase64;
    

        var myStyle = {
            width: 300
        };

        var textAlignEnd = {
            textAlign: 'right'
        };

        const linkButton = "/exercises/edit/" + this.state.id;

        const linkVideoFile = "http://localhost:5000/api/fields/video/" + this.state.videoFileLink;
        const linkVideo = this.state.linkVideo;
        const imageAccept=".jpg,.jpeg,.png";
        const videoAccept=".mp4";

        return (
                <Row>
                    <Col span={24}>
                    <Row>
                        <Col span={20}>
                            <p style={styleSpan}>Упражнение: {this.state.name}</p>
                            <p style={styleSpan}>Описание: {this.state.description}</p>
                            <p style={styleSpan}>Подтип тренировки: {this.state.subtypeTrainingName}</p>
                            <p>
                                Воздействие на группу мышц:
                                {!this.state.muscleGroupsNameSet.length == 0 ? 
                                    this.state.muscleGroupsNameSet.map(muscleGroup => (<span> <span style={styleSpan}> {muscleGroup} </span><br /> </span>))
                                    : null
                                }
                            </p>
                        </Col>
                        <Col span={4}>
                            {this.state.id != null ?
                                <div style={textAlignEnd}>
                                    <Button><Link to={linkButton}>Редактировать</Link></Button> 
                                </div>
                            : null
                            }
                        </Col>
                    </Row>

                    <Row gutter={[0, 40]}>
                        <Col span={24}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<span><Icon type="file-image"/>Загрузить изображение</span>} key="1">
                                    {!this.state.imageBase64.length == 0 ?
                                        <img src={imageBase64} style={myStyle} alt="Red dot" />
                                        :
                                        <img src={ExcersicesLogo} style={myStyle} alt="Red dot" />
                                    }
                                    <br/>
                                    <br/>
                                    <input type="file" name="image" accept={imageAccept}
                                        onChange={this.handleUploadImageFile}/>
                                    <button type="button" onClick={this.handleDeleteImageFile}>Удалить файл</button>
                                </TabPane>
                            
                                <TabPane tab={<span><Icon type="video-camera" /> Загрузить видео </span>} key="2">
                                    <div style={myStyle}>
                                        {this.state.isLoadingFile ?
                                            <LoadingIndicator/>
                                            :
                                            <div>
                                                {this.state.hasVideoFile ?
                                                <VideoPlayer
                                                    url={linkVideoFile} 
                                                    playing={false} />
                                                :
                                                null}
                                            </div>
                                        }
                                        <input type="file" name="videoFile" accept={videoAccept}
                                            onChange={this.handleUploadVideoFile}/>
                                                <button type="button" onClick={this.handleDeleteVideoFile}>Удалить файл</button>
                                    </div>
                                </TabPane>
                                
                                <TabPane tab={<span><Icon type="youtube" /> Ссылка на видео</span>} key="3" >
                                    {this.state.linkVideo != null && this.state.linkVideo.length != 0 ?
                                        <VideoPlayer url={linkVideo} playing={false} />
                                            :
                                        null
                                    }
                                    <input value={this.state.linkVideoInput} onChange={this.handleChangeLinkVideo}/>
                                    <button type="button" onClick={this.handleSaveVideoFile}>Сохранить ссылку</button>
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                    </Col>
                </Row>
        );
    }
}



export default withRouter(ExercisesMedia);
