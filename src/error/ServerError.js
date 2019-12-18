import React, { Component } from 'react';
import './ServerError.css';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

class ServerError extends Component {
    render() {
        return (
            <Result status="500" title="500"
                subTitle="Извините, произошла ошибка сервера."
                extra={<Link to={'/'}><Button type="primary">Домой</Button></Link>}
            />
        );
    }
}

export default ServerError;