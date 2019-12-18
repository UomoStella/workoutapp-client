import React, { Component } from 'react';
import { Row, Col, Button, Comment, List, Input} from 'antd';

const { TextArea } = Input;

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentsList: [],
            comments: '',
            
        };

        this.loadComments = this.loadComments.bind(this);
        this.saveComments = this.saveComments.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteComments = this.deleteComments.bind(this);        
    }

    saveComments(){
        this.props.saveComments(this.state.comments)
    }

    loadComments(){
        this.setState({
            commentsList: this.props.commentsList,
        });
    }
    deleteComments(id){
        this.props.deleteComments(id);
    }


    componentDidMount() {
        this.loadComments();
    }

    handleChange = e => {
        this.setState({
            comments: e.target.value,
        });
      };

    render() {   
        return (
            <Row  gutter={[16, 16]}>
                <Col span={24}>
                    <List
                        className="comment-list"
                        header="Комментарии"
                        itemLayout="horizontal"
                        dataSource={this.state.commentsList}
                        renderItem={item => (
                        <li>
                            <Comment
                                actions={item.username == this.props.username ?
                                    [<span key="comment-nested-reply-to" onClick={this.deleteComments.bind(this, item.id)}>Удалить</span>]
                                    : null}
                                author={item.name}
                                content={item.comments}
                                datetime={item.datetime}
                                />
                        </li>
                        )}
                    />
                </Col>
                
                <Col span={24}>
                    <div>
                        <TextArea rows={4} onChange={this.handleChange} value={this.state.comments} />
                        <br/>
                        <Button style={{marginTop: '10px'}} onClick={this.saveComments} type="primary">
                            Добавить коментарий
                        </Button>
                    </div>
                </Col>
            </Row>
    );
    }
}

export default Comments;











