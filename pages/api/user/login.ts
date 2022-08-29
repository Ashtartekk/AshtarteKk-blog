import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { prepareConnection } from 'db/index';
import { User } from 'db/entity/index';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verify = '' } = req.body;
  const db = await prepareConnection();
  const userRepo = db.getRepository(User);
  const users = await userRepo.find();
  console.log(phone);
  console.log(users);
  console.log(verify);
  console.log(userRepo.find());
  res?.status(200).json({ phone, verify, code: 0 });
}
