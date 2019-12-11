import React, { Component } from 'react';
import { Icon, Tag, Tabs, Typography, Row, Col } from 'antd';
import { API_BASE_URL } from '../../../constants';
import ExcersicesLogo from '../../../resources/excersices.png';
import VideoPlayer from '../../player/VideoPlayer';
import './TrainingDescriptionView.css';


const { TabPane } = Tabs;
const { Title } = Typography;

class TrainingDescriptionElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            numberRepetitions: 'Количество повторений',
            leadTime: 'Время выполнения',
            extraWeight: 'Дополнительный вес',
            exercises: {},

            exerciseName: 'Наименование упражнения',
            exerciseDescription: 'Описание упражнения',
            subtypeTrainingName: 'Наименование подтипа тренировки',
            muscleGroupsNameSet: [] , // группа мышц

            linkVideo: '',

            imageBase64: '', // картинка
            hasVideoFile: false, // проверка есть ли видео файл
            videoFileLink: '',
            username: 'Имя пользователя',
            
            isLoading: true,
        }
        this.mapTrainingDescriptionElement = this.mapTrainingDescriptionElement.bind(this);

    }

    componentDidMount() {
        // const dailyid = this.props.dailyid;
        const trainingDescriptions = this.props.trainingDescriptions;
        
        console.log(trainingDescriptions);
        this.mapTrainingDescriptionElement(trainingDescriptions);
    }

    mapTrainingDescriptionElement(trainingDescriptions) {
        const exercise = trainingDescriptions.exercises;
        this.setState({
            isLoading: true,
            numberRepetitions: trainingDescriptions.numberRepetitions,
            leadTime: trainingDescriptions.leadTime,
            extraWeight: trainingDescriptions.extraWeight,
            exercises: exercise,

            exerciseName: exercise.name,
            exerciseDescription: exercise.description,
            subtypeTrainingName: exercise.subtypeTrainingName,
            muscleGroupsNameSet: exercise.muscleGroupsNameSet, // группа мышц

            linkVideo: exercise.linkVideo,

            imageBase64: exercise.imageBase64, // картинка
            hasVideoFile:  exercise.hasVideoFile, // проверка есть ли видео файл
            videoFileLink: exercise.videoFileLink,
            username: exercise.username,
        });
        
    }



    render() {   
       
        const linkVideoFile = API_BASE_URL + "/fields/video/" + this.state.videoFileLink;
        const imageBase64 = "data:image/png;base64, "+ this.state.imageBase64;
        return (
            <div className="exercises-element">
                <Row gutter={[0, 5]}>
                    <Col md={24}>
                        <Title className="title-exercises" level={4}>{this.state.exerciseName}</Title>
                        <p className="title-description">{this.state.exerciseDescription}</p>
                        {/* <p>Наименование: <span>{this.state.exerciseName}</span></p>
                        <p>Описание: <span>{this.state.exerciseDescription}</span></p> */}
                    </Col>

                    <Col span={24}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={<span><Icon type="file-image"/>Изображение</span>} key="1">
                            <Row className="col-imageupload-exercises_media">
                                <Col md={18}>
                                {!this.state.imageBase64.length == 0 ?
                                    <img style={{maxHeight: '400px'}} src={imageBase64} alt="Red dot" />
                                    :
                                    <img style={{maxHeight: '400px'}} src={ExcersicesLogo} alt="Red dot" />
                                }
                                </Col>
                            </Row>
                        </TabPane>
                    
                        {this.state.hasVideoFile ?
                            <TabPane tab={<span><Icon type="video-camera" /> Видео загруженное</span>} key="2">
                                <Row className="col-videofile-exercises_media">
                                    <Col md={24}>
                                        <div style={{maxHeight: '400px'}}>
                                            
                                            <VideoPlayer
                                                url={linkVideoFile} 
                                                playing={false} />
                                            :
                                            <p className="noFile">Видео не загружено</p>}
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                            : null
                        }
                        {this.state.linkVideo != null && this.state.linkVideo.length != 0 ?
                            <TabPane tab={<span><Icon type="youtube" /> Видео</span>} key="3" >                                    
                                        <VideoPlayer url={this.state.linkVideo} playing={true} />
                            </TabPane>
                            :
                            null
                        }
                    </Tabs>
                    </Col>
                    {this.state.numberRepetitions 
                        || this.state.leadTime 
                        || this.state.extraWeight ?
                    <Col md={24} className="exercises-addition">    
                        <table>
                            <thead>
                                <tr>
                                    <th>повторений</th>
                                    <th>время, сек.</th>
                                    <th>вес, кг.</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.numberRepetitions}</td>
                                    <td>{this.state.leadTime}</td>
                                    <td>{this.state.extraWeight}</td>
                                </tr>
                            </tbody>
                        </table>                       
                    </Col>
                    : null}
                    <Col md={24}>
                            {this.state.subtypeTrainingName ?
                                <Tag color="purple">{this.state.subtypeTrainingName}</Tag>
                                :
                                null
                            }
                            {this.state.muscleGroupsNameSet.map(item =>
                                (<Tag >{item}</Tag>))}
                            
                        </Col>
                </Row>
            </div>
        );
    }
}



export default TrainingDescriptionElement;
