import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import requset from 'service/fetch';
import { ISession } from 'pages/api/index';
import { ironOptions } from 'config/index';

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { to = '', templateId = '1' } = req.body;
  const AppId = '8a216da882d55db10182df0a835d02a9';
  const AccountId = '8a216da882d55db10182df0a826802a2';
  const AuthToken = 'd28ffbddc3574918b737f99c203bbeb4';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SingParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expirMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SingParameter}`;
  const response = await requset.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expirMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );
  const { statusCode, templateSMS ,statusMsg } = response as any;
  if (statusCode === '000000') {
    console.log(statusMsg)
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
        code: 0,
        msg: statusMsg,
        data:{
            name:'AshtarteKk',
            templateSMS
        }
      });
  }else{
    res.status(200).json({
        code: statusCode,
        msg: statusMsg,
      });
  }

  console.log(response);
  console.log(to);
  console.log(templateId);
  console.log(NowDate);
  console.log(SingParameter);
  console.log(Authorization);
  console.log(verifyCode);
 
}
