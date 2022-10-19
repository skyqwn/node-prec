import Memory from "../model/Memory.js";
import createError from "../util/createError.js";

export const memory = async (req, res, next) => {
  try {
    const memories = await Memory.find().populate("creater");
    res.render("memory", { memories });
  } catch (error) {
    next(error);
  }
};

export const memoryUpload = (req, res) => {
  res.render("memoryUpload");
};

export const memoryUploadPost = async (req, res, next) => {
  const {
    file: { path },
    body: { title, desc },
    user,
  } = req;
  console.log(req.file);
  try {
    const memory = new Memory({
      file: path,
      title,
      desc,
      creater: user._id,
    });
    await memory.save();
    return res.redirect("/memory");
  } catch (error) {
    next(error);
  }
};

export const detail = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    const memory = await Memory.findById(id).populate("creater");
    // const memory = await Memory.find({ _id: id });
    res.render("detail", { titleName: memory.title, memory });
  } catch (error) {
    next(error);
  }
};

export const memoryUpdate = async (req, res, next) => {
  const {
    params: { id },
    memory,
  } = req;
  try {
    // const memory = await Memory.find({ _id: id });
    res.render("update", { titleName: memory.title, memory });
  } catch (error) {
    next(error);
  }
};

export const memoryUpdatePost = async (req, res, next) => {
  const {
    params: { id },
    body: { title, desc },
    file,
  } = req;
  try {
    const updatememory = await Memory.findByIdAndUpdate(
      id,
      {
        title,
        desc,
        file: file?.path,
      },
      {
        new: true,
      }
    );
    console.log(updatememory);
    return res.redirect(`/memory/${id}`);
  } catch (error) {
    next(error);
  }
};

export const memoryRemove = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    await Memory.findByIdAndDelete(id);
    res.redirect("/memory");
  } catch (error) {
    next(error);
  }
};
