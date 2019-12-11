import React, { Component } from 'react';
import { Row, Col,  Button, Tag} from 'antd';

class ButtonNext extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showResults: this.props.visibleTab
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.setState({ showResults: true });
        this.props.chandeActiveKey();
    }   

    render () {
        return (
            <Row>
                <Col md={12} >
                    { this.state.showResults ? 
                    <Tag color="#87d068">ВЫПОЛНЕНО</Tag>
                    : null }
                </Col> 
                <Col md={12}>
                    <div className="textRight">
                        <Button type="primary" onClick={this.onClick}>Далее</Button>
                    </div>
                </Col>
            </Row>
        );
    }

}

export default ButtonNext;