
import React, { Component } from 'react';
import { Alert } from 'antd';

class AlertTable extends Component {
    render() {
        return (
            <div style={{marginTop: 15}}>
                <Alert message="Сообщение"
                    description="Нет доступных данных, измените параметры поиска или перезагрузите страницу."
                    type="info" />
            </div>
        );
    }
}

export default AlertTable;