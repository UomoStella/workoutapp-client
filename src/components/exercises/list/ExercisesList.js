import React, { Component } from 'react';
import { Row, Col} from 'antd';
// import './ExercisesList.css';
import LoadingIndicator from '../../LoadingIndicator';
import AlertTable from '../../../error/AlertTable';

// import ExcersicesLogo from '../../../resources/excersices.jpg';
import ExercisesElement from './ExercisesElement'

class ExercisesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content : [],
            isLoading: false,
            noDataInContent: false
        };

        this.getExercisesMedia = this.getExercisesMedia.bind(this);
    }

    getExercisesMedia(content){
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
        const content = this.props.excersicesContent;
        this.getExercisesMedia(content);
    }


    render() {   
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }

        const excersicesList = [];
    
        
        this.state.content.forEach((excersice, index) => { 
            excersicesList.push(
                <Col md={6} style={{minWidth: '285px'}} gutter={[16, 16]} >
                    <ExercisesElement id={excersice.id}
                        name={excersice.name}
                        exercisesDelete={this.props.exercisesDelete}
                        subtypeTrainingName={excersice.subtypeTrainingName}
                        muscleGroupsNameSet={excersice.muscleGroupsNameSet}
                        imageBase64={excersice.imageBase64}/>
                </Col>
            );
        });
        
        return (
                <div>
                    {!this.state.noDataInContent ?
                        <Row gutter={16}>
                            {excersicesList}
                        </Row>
                    :
                        <AlertTable/>
                    }
                
                </div>
        );
    }
}

export default ExercisesList;
