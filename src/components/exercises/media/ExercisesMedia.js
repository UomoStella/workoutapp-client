import React, { Component } from 'react';
import { TrainingService } from '../../../service/TrainingService';
import { notification } from 'antd';
import './ExercisesMedia.css';
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import { ACCESS_TOKEN } from '../../../constants';

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
            linkVideo: '',
            imageBase64: '',
            videoFileBase64: '',

            isLoading: true,
            serverError: false,
            notFound: false,
        }

        this.getExercisesMedia = this.getExercisesMedia.bind(this);        
        this.trainingService = new TrainingService();
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
                image: exercisesRespons.image,
                videoFile: exercisesRespons.videoFile,
                linkVideo: exercisesRespons.linkVideo,
                imageBase64: exercisesRespons.imageBase64,
                videoFileBase64: exercisesRespons.videoFileBase64,
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
    fontWeight: '500'
}
        const imageBase64 = "data:image/png;base64, "+ this.state.imageBase64;
        console.log(this.state.imageBase64);
        console.log(imageBase64);
        return (
                <div className="col24">
                    <p>Упражнение: {this.state.name}</p>
                    <p>Описание: {this.state.description}</p>
                    <p>Подтип тренировки: {this.state.subtypeTrainingName}</p>
                    <p>Воздействие на группу мышц:
                        {!this.state.muscleGroupsNameSet.length == 0 ? 
                            this.state.muscleGroupsNameSet.map(muscleGroup => (<span style={styleSpan}> {muscleGroup} </span>))
                            : null
                        }
                    </p>

                    <img src={imageBase64} alt="Red dot" />
                </div>
        );
    }
}



export default ExercisesMedia;
