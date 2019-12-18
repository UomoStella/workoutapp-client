import React, { Component } from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

class NotFound extends Component {
    render() {
        return (
            <Result status="404" title="404"
                subTitle="Извините, страница, которую вы ищите, не существует."
                extra={<Link to={'/'}><Button type="primary">Домой</Button></Link>}
            />
        );
    }
}

export default NotFound;