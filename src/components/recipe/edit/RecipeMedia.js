import React, { Component } from 'react';
import { RecipeService } from '../../../service/RecipeService';
import { FileService } from '../../../service/FileService';
import {withRouter, Link } from 'react-router-dom';
import { notification, Button, Row, Col, Tabs, Icon, Upload, Input, Breadcrumb} from 'antd';
import './RecipeMedia.css';

import { ACCESS_TOKEN, API_BASE_URL } from '../../../constants';
import FOOD from '../../../resources/FOOD.jpg';
import VideoPlayer from '../../player/VideoPlayer';

import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';

const { TabPane } = Tabs;


class RecipeMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            base64image: '',
            videoFileName: '',
            videoLink: '',


            isLoadingLinkVideo: false,
            isLoadingFile: false,

            isLoading: true,
            serverError: false,
            notFound: false,
        }

        this.getRecipeMedia = this.getRecipeMedia.bind(this);        
        this.handleUploadImageFile = this.handleUploadImageFile.bind(this);
        this.handleUploadVideoFile = this.handleUploadVideoFile.bind(this);
        this.handleDeleteImageFile = this.handleDeleteImageFile.bind(this);
        this.handleDeleteVideoFile = this.handleDeleteVideoFile.bind(this);
        this.handleChangeLinkVideo = this.handleChangeLinkVideo.bind(this);
        this.handleSaveVideoFile = this.handleSaveVideoFile.bind(this);
        
        
        this.recipeService = new RecipeService();
        this.fileService = new FileService();
    }

    handleUploadImageFile = (event) => {

        let file = event;
        const data = new FormData();
            data.append('file', file);
            data.append('id', this.state.id);
        
        this.fileService.uploadRecipeImage(data).then((response) => {
            if(response.data == null || response.data.length == 0)
                return;

            this.setState({
                base64image:  response.data,
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


    handleDeleteImageFile = (event) => {    
        const data = new FormData();
            data.append('id', this.state.id);
        
        this.fileService.deleteRecipeImage(data).then((response) => {
            this.setState({
                base64image:  ''
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


    handleUploadVideoFile = (file) => {
        this.setState({
            isLoadingFile: true
        });
            
        const data = new FormData();
            data.append('file', file);
            data.append('id', this.state.id);
        
        this.fileService.uploadRecipeFileVideo(data).then((response) => {
            if(response.data == null || response.data.length == 0)
                return;

            this.setState({
                videoFileName:  response.data,
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

    handleDeleteVideoFile = (event) => {   
        const data = new FormData();
            data.append('id', this.state.id);  

        this.fileService.deleteRecipeFileVideo(data).then((response) => {
            this.setState({
                videoFileName:  '',
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
            videoLink :event.target.value
        })
    }
    handleSaveVideoFile = (event) => {
        this.setState({
            isLoadingLinkVideo: true,
        });

        const data = new FormData();
            data.append('id', this.state.id); 
            data.append('linkvideo', this.state.videoLink); 

        this.fileService.updateRecipeVideoLink(data).then((response) => {
            this.setState({
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


    getRecipeMedia(recipeId){
        this.setState({
            isLoading: true,
        });

        this.recipeService.getRecipeDetailsByRID(recipeId).then(response => {
            const recipeRespons  = response.data;

            this.setState({
                id: recipeId,
                name: recipeRespons.name,
                description: recipeRespons.description,
                base64image: recipeRespons.base64image,
                videoFileName: (recipeRespons.videoFileName == null ? '':recipeRespons.videoFileName),
                videoLink: (recipeRespons.videoLink == null ? '':recipeRespons.videoLink),

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
        const recipeId = this.props.match.params.recipeId; 
        
        this.getRecipeMedia(recipeId);
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

        const imageBase64 = "data:image/png;base64, "+ this.state.base64image;

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

        const linkVideoFile = API_BASE_URL + "/fields/video/" + this.state.videoFileName;

        const imageAccept=".jpg,.jpeg,.png";
        const videoAccept=".mp4";

        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/recipe/all'}>Список рецептов</Link></Breadcrumb.Item>
                        {this.state.id ?
                        <Breadcrumb.Item><Link to={'/recipe/media/'+this.state.id}>Рецепт</Link></Breadcrumb.Item>
                        : null}
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <div className="col-exercises_media">
                        <Row  style={{overflow: 'auto'}}>
                            <Col md={20} style={{overflow: 'hidden'}}>
                                <p className="text-main-exercises_media">Наименование: <span>{this.state.name}</span></p>
                                <p className="text-exercises_media">Описание: <span>{this.state.description}</span></p>
                                
                            </Col>
                            <Col md={4}>
                                {this.state.id != null ?
                                    <div>
                                        <div className="col-btn-right">
                                        <Link to={'/recipe/details/'+this.state.id}><Button type="primary" icon="edit">Редактировать</Button> </Link>
                                        </div>
                                    </div>
                                : null
                                }
                            </Col>
                        </Row>

                        <Row gutter={[0, 40]}>
                            <Col span={24}>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab={<span><Icon type="file-image"/>Загрузить изображение</span>} key="1">
                                        <Row className="col-imageupload-exercises_media">
                                            <Col md={18}>
                                            {!this.state.base64image.length == 0 ?
                                                <img src={imageBase64} alt="Red dot" />
                                                :
                                                <img src={FOOD} alt="Red dot" />
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
                                                        {this.state.videoFileName.length != 0 ?
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
                                        <div>
                                            
                                            
                                        </div>
                                    </TabPane>
                                    
                                    <TabPane tab={<span><Icon type="youtube" /> Ссылка на видео</span>} key="3" >
                                        <div className="link-input-field">
                                            <Input value={this.state.videoLink} onChange={this.handleChangeLinkVideo}/>
                                            <Button icon="link" onClick={this.handleSaveVideoFile}>Сохранить ссылку</Button>
                                        </div>
                                        
                                        {this.state.isLoadingLinkVideo ?
                                            <LoadingIndicator/>
                                            :
                                            <div>
                                                {this.state.videoLink != null && this.state.videoLink.length != 0 ?
                                                <VideoPlayer url={this.state.videoLink} playing={false} />
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
                </div>
            </div>
        );
    }
}



export default withRouter(RecipeMedia);
