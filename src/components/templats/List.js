import React, { Component } from 'react';
import { Row, Col} from 'antd';
// import './ExercisesList.css';
import LoadingIndicator from '../../LoadingIndicator';
// import ExcersicesLogo from '../../../resources/excersices.png';
// import ExercisesElement from './ExercisesElement'

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content : [],
            isLoading: false,
            noDataInContent: false
        };

        this.getContentMedia = this.getContentMedia.bind(this);
    }

    getContentMedia(content){
        this.setState({
            isLoading: true,
        });

        if(content != null && content.length != 0)
            this.setState({
                content : content,
                noDataInContent: false,
                isLoading: false,
            })
        else
            this.setState({
                content : [],
                noDataInContent: true,
                isLoading: false,
            })  
    }


    componentDidMount() {
        const content = this.props.Content;
        this.getContentMedia(content);
    }


    render() {   
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }

        const valueList = [];
    
        this.state.content.forEach((value) => { 
            valueList.push(
                <Col md={6} gutter={[16, 16]} >
                    <ListElement id={value.id}
                        imageBase64={value.imageBase64}
                        handleEdit={this.props.handleEdit}
                        handleDelete={this.props.handleDelete}
                        additionInfo={this.props.additionInfo}
                        />
                </Col>
            );
        });
        
        return (
                <div>
                    {!this.state.noDataInContent ?
                        <Row gutter={16}>
                            {valueList}
                        </Row>
                    :
                        <p>Нет данных!!</p>
                    }
                
                </div>
        );
    }
}

export default List;