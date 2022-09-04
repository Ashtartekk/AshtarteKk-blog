import styles from './index.module.scss';
import { ChangeEvent, useState } from 'react';
import CountDown from 'components/CountDown';
import { message } from 'antd';
import request from 'service/fetch';
import { useStore } from 'store/index';
import { observer } from 'mobx-react-lite';

interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const store = useStore();
  const { isShow = false, onClose } = props;
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: '', //手机号
    verify: '', //验证码
  });
  //弹窗关闭
  const handleClose = () => {
    onClose && onClose(); //相当于执行了Navbar的handleClose
  };
  //获取验证码
  const handleGetVerifyCode = () => {
    // setIsShowVerifyCode(true);
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }
    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  //登录按钮
  const handleLogin = () => {
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          // 登录成功
          store.user.setUserInfo(res?.data);
          console.log('store=>', store);
          onClose && onClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  //第三方Github登录
  const handleAuthGithub = () => {};
  //监听表单事件
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  //结束通知用户的方法
  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            ×
          </div>
        </div>
        <input
          type="text"
          name="phone"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            type="text"
            name="verify"
            placeholder="请输入6位验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountDownEnd} />
            ) : (
              '获取验证码'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleAuthGithub}>
          使用 Github 登录
        </div>
        <div className={styles.loginPrivaacy}>
          注册登录即表示同意
          <a href="www.baidu.com" target="_blank" rel="noreferrer">
            隐私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default Login;
