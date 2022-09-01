export type IUserInfo = {
  userId?: number | null,
  nickname?: string,
  avatar?: string,
};

//相当于vuex
export interface IUserStore {
  userInfo: IUserInfo;
  serUserInfo: (value: IUserInfo) => void;
}

const userStore = (): IUserStore => {
  return {
    userInfo: {},
    setUserInfo: function (value) {
      this.userInfo = value;
    },
  };
};

export default userStore;
