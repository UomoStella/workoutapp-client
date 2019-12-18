import React, { Component } from 'react';
import { Button, Row, Col, Select} from 'antd';
import {TrainingService} from '../../../service/TrainingService';

const { Option } = Select;

class TPViewElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeTrainingId: null,
            subtypeTrainingId: null,
            mgId: null,

            muscleGroupsResponseList : [],
            typeTrainingResponseList : [],
            subtypeTrainingList: [],

            isLoading: false
        }

        this.handleProvinceChange = this.handleProvinceChange.bind(this);
        this.getTypeTrainingALL = this.getTypeTrainingALL.bind(this);
        this.getMuscleGroupsALL = this.getMuscleGroupsALL.bind(this);
        
        this.handleSubtypeTrainingChange = this.handleSubtypeTrainingChange.bind(this);
        this.handleMuscleGroupsChange = this.handleMuscleGroupsChange.bind(this);

        this.goFilter = this.goFilter.bind(this);
        

        this.trainingService = new TrainingService();
    }

    goFilter(){
        this.props.setFilter(this.state.typeTrainingId, this.state.subtypeTrainingId, this.state.mgId);
    }

    handleMuscleGroupsChange = value => {
        this.setState({
            mgId: value
        })
    }

    handleSubtypeTrainingChange = value => {
        this.setState({
            subtypeTrainingId: value
        })
    }

    handleProvinceChange = value => {
        if(value == undefined || value == null)
            return;

        this.setState({
            typeTrainingId: value,
            subtypeTrainingId: null
        })

        this.trainingService.getSubtypeTrainingById(value)
        .then(response => {
            if(response.data.containerList)
                this.setState({
                    subtypeTrainingList : response.data.containerList
                })  
            else
                this.setState({
                    subtypeTrainingList :[]
                })
        }).catch(error => {
            this.setState({
                subtypeTrainingList : []
            })  
        });    
      };


      getMuscleGroupsALL() {
        this.trainingService.getMuscleGroupsALL()
        .then(response => {
            if(response.data.containerList)
                this.setState({
                    muscleGroupsResponseList : response.data.containerList
                })  
            else
                this.setState({
                    muscleGroupsResponseList :[]
                })
        }).catch(error => {
            this.setState({
                muscleGroupsResponseList : []
            })  
        });    
      };

      getTypeTrainingALL() {
        this.trainingService.getTypeTrainingALL()
        .then(response => {
            if(response.data.containerList)
                this.setState({
                    typeTrainingResponseList : response.data.containerList
                })  
            else
                this.setState({
                    typeTrainingResponseList :[]
                })
        }).catch(error => {
            this.setState({
                typeTrainingResponseList : []
            })  
        });    
      };
      

    componentDidMount() {
        this.getTypeTrainingALL();
        this.getMuscleGroupsALL();
    }

    render() {   
        var textAlignEnd = {
            textAlign: 'right'
        };


        const typeTrainingResponseViews = [];
        this.state.typeTrainingResponseList.forEach((type, typeIndex) => {
            typeTrainingResponseViews.push(<Option  key={type.id}>{type.name}</Option>);
          });

        const muscleGroupsResponseViews = [];
        this.state.muscleGroupsResponseList.forEach((type, typeIndex) => {
            muscleGroupsResponseViews.push(<Option key={type.id}>{type.name}</Option>);
        });

        return (
            <div>
                <Row>
                    <Col span={24}>    
                        <Select placeholder="Выберите тип тренировки" 
                            style={{width: '100%'}}
                            onChange={this.handleProvinceChange}>
                        {!this.state.typeTrainingResponseList.length == 0 ? 
                            typeTrainingResponseViews 
                            : 
                            null}
                        </Select>
                    </Col>
                    <Col span={24} style={{marginTop: '10px'}}>    
                        <Select placeholder="Выберите подтип тренировки" 
                            style={{width: '100%'}}
                            onChange={this.handleSubtypeTrainingChange}>
                        {!this.state.subtypeTrainingList.length == 0 ? 
                            this.state.subtypeTrainingList.map(st => (<Option key={st.id}>{st.name}</Option>)
                        ): null}
                        </Select>
                    </Col>
                    <Col span={24} style={{marginTop: '10px'}}>
                        <Select style={{width: '100%'}}
                            placeholder="Выберите группу мышц"
                            onChange={this.handleMuscleGroupsChange}>
                            {!this.state.muscleGroupsResponseList.length == 0 ? 
                            muscleGroupsResponseViews 
                            : 
                            null}
                        </Select>
                    </Col>
                    <Button  style={{marginTop: '10px'}} onClick={this.goFilter}>Поиск</Button>
                </Row>
            </div>
        );
    }
}


export default TPViewElement;
