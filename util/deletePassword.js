export default (user) => {
  const userInfo = { ...user._doc };

  const { password, ...otherInfo } = userInfo;

  return otherInfo;
};
