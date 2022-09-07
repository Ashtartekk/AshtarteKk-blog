import type { NextPage } from 'next';
import { navs } from './config';
import Link from 'next/link';
import styles from './index.module.scss';
import { Button, Avatar, Dropdown, Menu, message } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import { useStore } from 'store/index';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Login from 'components/Login';
import request from 'service/fetch';

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;
  const { pathname, push } = useRouter();
  //定义isShowLogin变量，setIsShowLogin是修改变量的方法
  const [isShowLogin, setIsShowLogin] = useState(false);
  //跳转到写文章页面
  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };
  //打开登录弹窗
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  //登录弹窗关闭
  const handleClose = () => {
    setIsShowLogin(false);
  };
  //进入个人主页
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  };
  //退出登录
  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}>
          <HomeOutlined />
          &nbsp; 个人主页
        </Menu.Item>
        <Menu.Item onClick={handleLogout}>
          <LoginOutlined />
          &nbsp; 退出系统
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>Blog</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <a className={pathname === nav?.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={32}></Avatar>
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose}></Login>
    </div>
  );
};

export default observer(Navbar);
