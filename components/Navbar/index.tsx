import type { NextPage } from 'next';
import { navs } from './config';
import Link from 'next/link';
import styles from './index.module.scss';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Login from 'components/Login';

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  //定义isShowLogin变量，setIsShowLogin是修改变量的方法
  const [isShowLogin, setIsShowLogin] = useState(false);
  //跳转到写文章页面
  const handleGotoEditorPage = () => {};
  //打开登录弹窗
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  //登录弹窗关闭
  const handleClose = () => {
    setIsShowLogin(false);
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
        <Button type="primary" onClick={handleLogin}>
          登录
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose}></Login>
    </div>
  );
};

export default Navbar;
