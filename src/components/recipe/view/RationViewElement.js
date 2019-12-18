import React, { Component } from 'react';
import { Icon, Tag, Tabs, Typography, Row, Col } from 'antd';
import { API_BASE_URL } from '../../../constants';
import FOOD from '../../../resources/FOOD.jpg';
import VideoPlayer from '../../player/VideoPlayer';

const { TabPane } = Tabs;
const { Title } = Typography;

class RationViewElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            mealNumber: '',
            name: '',
            description: '',
            base64image: '',
            videoFileName: '',
            videoLink: '',
            username: '',

            isLoading: true,
        }
        this.mapRationDayElement = this.mapRationDayElement.bind(this);

    }

    componentDidMount() {
        const rationResponses = this.props.rationResponses;

        this.mapRationDayElement(rationResponses);
    }

    mapRationDayElement(rationResponses) {
        const recipe = rationResponses.recipeResponse;
        this.setState({
            mealNumber: '',
            name: recipe != null ? recipe.name : null,
            description: recipe != null ? recipe.description : null,
            base64image: recipe != null ? recipe.base64image : null,
            videoFileName: recipe != null ? recipe.videoFileName : null,
            videoLink: recipe != null ? recipe.videoLink : null,
            username: recipe != null ? recipe.username : null,

            isLoading: true,
        });
        
    }



    render() {   
       
        const linkVideoFile = API_BASE_URL + "/fields/video/" + this.state.videoFileName;
        const imageBase64 = "data:image/png;base64, "+ this.state.base64image;

        return (
            <div className="ration-element">
                <Row gutter={[0, 5]}>
                    <Col md={24}>
                        <Title className="title-ration" level={4}>{this.state.name}</Title>
                        <p className="title-description">{this.state.description}</p>
                    </Col>

                    <Col span={24}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span><Icon type="file-image"/>Изображение</span>} key="1">
                                <Row className="col-imageupload-ration">
                                    <Col md={18}>
                                    {!this.state.base64image.length == 0 ?
                                        <img style={{maxHeight: '400px'}} src={imageBase64} alt="Red dot" />
                                        :
                                        <img style={{maxHeight: '400px'}} src={FOOD} alt="Red dot" />
                                    }
                                    </Col>
                                </Row>
                            </TabPane>
                        
                            {this.state.videoFileName != null && this.state.videoFileName.length != 0 ?
                                <TabPane tab={<span><Icon type="video-camera" /> Видео загруженное</span>} key="2">
                                    <VideoPlayer url={linkVideoFile} playing={true} />
                                </TabPane>
                                : null
                            }
                            {this.state.videoLink != null && this.state.videoLink.length != 0 ?
                                <TabPane tab={<span><Icon type="youtube" /> Видео</span>} key="3" >                                    
                                    <VideoPlayer url={this.state.videoLink} playing={true} />
                                </TabPane>
                                :
                                null
                            }
                        </Tabs>
                    </Col>
                    <Col md={24}>
                        {this.state.username ?
                            <Tag >{this.state.username}</Tag>
                        : null}
                    </Col>
                </Row>
            </div>
        );
    }
}



export default RationViewElement;
