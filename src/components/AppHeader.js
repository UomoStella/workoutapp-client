import React, { Component } from 'react';
import {withRouter, Link} from 'react-router-dom';
import { Layout, Menu, Dropdown, Icon } from 'antd';
const Header = Layout.Header;

const { SubMenu } = Menu;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(this.props.currentUser) {
          menuItems = [
              <Menu.Item key="home">
                <Link to="/">
                  <Icon type="home"/>
                </Link>
              </Menu.Item>,
              <SubMenu title={<span className="submenu-title-wrapper">Тренеровки</span>}>
              <Menu.Item key="/performance/tp">
                <Link to={'/performance/tp'}>
                <Icon type="exclamation" className="nav-icon" /><span>Дневное задание</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/exercises/all">
                <Link to="/exercises/all">
                  <Icon type="heart" className="nav-icon" /> <span>Упражнения</span>
                </Link>
              </Menu.Item>
              <Menu.ItemGroup title={<span className="submenu-title-wrapper">Программа тренировок</span>}>
                <Menu.Item key="/trainingprogram/all">
                  <Link to="/trainingprogram/all">
                    <Icon type="rise"/> <span>Редактирование</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/trainingprogram/viewall">
                  <Link to="/trainingprogram/viewall">
                    <Icon type="skin" /> <span>Просмотр</span>
                  </Link>
                </Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>,
            
            <SubMenu title={<span className="submenu-title-wrapper">Рацион</span>}>
              <Menu.Item key="/recipe/all">
                <Link to="/recipe/all">
                  <span>Рецепты</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/ration/all">
                <Link to="/ration/all">
                  <span>Дневной рацион</span>
                </Link>
              </Menu.Item>
            </SubMenu>,
          
            <Menu.Item key="calculator">
              <Link to="/calc"><Icon type="calculator" /></Link>
            </Menu.Item>,

              <SubMenu title={<span className="submenu-title-wrapper"><Icon type="user"/></span>} onClick={this.handleMenuClick}>
                <Menu.Item key="/users/test">
                  <Link to={'/users/' +this.props.currentUser.username}>
                      <span>Профиль</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="logout">
                    <span>Выйти</span>
                </Menu.Item>
            </SubMenu>,
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="home">
            <Link to="/">
              <Icon type="home"/>
            </Link>
          </Menu.Item>,
            <Menu.Item key="/login">
              <Link to="/login">Войти</Link>
            </Menu.Item>,
            <Menu.Item key="/signup">
              <Link to="/signup">Зарегестрироваться</Link>
            </Menu.Item>                  
          ];
        }

        return (
          <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ lineHeight: '64px' }}>
              {menuItems}
            </Menu>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.username}`}>Профиль</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Выйти
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);