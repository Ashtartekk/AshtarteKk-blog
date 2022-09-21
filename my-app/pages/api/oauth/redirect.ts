import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity/index';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils/index';
import { ISession } from 'pages/api/index';
import request from 'service/fetch';

export default withIronSessionApiRoute(redirect, ironOptions);

//client-id:4dd020c6824aa6b2b454
//client-secret:b78606cd20d5d4dc8f554fa315abeef1690705e2

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  //localhost:3000/api/oauth/redirect?code=xxxxx
  const { code } = req?.query || {};
  console.log('code=>>', code);
  const githubClientID = '4dd020c6824aa6b2b454';
  const githubSecrect = 'b78606cd20d5d4dc8f554fa315abeef1690705e2';
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecrect}&code=${code}`;
  const result = await request.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    }
  );

  console.log(22222)
  console.log(result)

  const { access_token } = result as any;

  console.log(33333)
  console.log(access_token)

  const githubUserInfo = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`
    }
  })
  
  console.log(44444)
  console.log(githubUserInfo)

  const cookies = Cookie.fromApiRoute(req, res);
  const db = await prepareConnection();
  const userAuth = await db.getRepository(UserAuth).findOne({
    identity_type: 'github',
    identifier: githubClientID
  }, {
    relations: ['user']
  });

  console.log(55555)
  console.log(userAuth)

  if (userAuth) {
    // 之前登录过的用户，直接从 user 里面获取用户信息，并且更新 credential
    const user = userAuth.user;
    const { id, nickname, avatar } = user;

    console.log(6666666)
    console.log(user)

    userAuth.credential = access_token;

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    res.writeHead(302, {
      Location: '/'
    });
  } else {
    // 创建一个新用户，包括 user 和 user_auth
    const { login = '', avatar_url = '' } = githubUserInfo as any;
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;

    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = githubClientID;
    userAuth.credential = access_token;
    userAuth.user = user;

    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);

    console.log(77777)
    console.log(resUserAuth)

    const { id, nickname, avatar } = resUserAuth?.user || {};
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    res.writeHead(302, {
      Location: '/'
    });
  }
}
