import User from "../model/User.js";
import Memory from "../model/Memory.js";

export const detail = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    const findUser = await User.findById(id);
    const memories = await Memory.find({ creator: findUser }).populate(
      "creator"
    );
    res.render("userdetail", { user: findUser, memories });
  } catch (error) {
    next(error);
  }
};
