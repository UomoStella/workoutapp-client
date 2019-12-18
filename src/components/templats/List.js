import React, { Component } from 'react';
import { Row, Col} from 'antd';
// import './ExercisesList.css';
import LoadingIndicator from '../LoadingIndicator';
import './List.css';
// import ExcersicesLogo from '../../../resources/excersices.jpg';
import ListElement from './ListElement'

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

        
        return (
                <div>
                    {!this.state.noDataInContent ?
                        <Row gutter={16}>
                            {this.state.content}
                        </Row>
                    :
                        <p>Нет данных!!</p>
                    }
                
                </div>
        );
    }
}

export default List;