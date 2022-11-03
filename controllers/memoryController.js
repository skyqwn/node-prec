import Memory from "../model/Memory.js";
import createError from "../util/createError.js";

export const memory = async (req, res, next) => {
  try {
    const memories = await Memory.find().populate("creator");
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
  try {
    const memory = new Memory({
      file: path,
      title,
      desc,
      creator: user._id,
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
    const memory = await Memory.findById(id).populate("creator");
    // const memory = await Memory.find({ _id: id });
    res.render("detail", { titleName: memory.title, memory });
  } catch (error) {
    next(error);
  }
};

export const memoryUpdate = (req, res, next) => {
  const {
    params: { id },
    memory, // 여기서 어케 한번에 메모리를 들고 올수 있지?
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
    const updateMemory = await Memory.findByIdAndUpdate(
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
    console.log(updateMemory);
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

export const search = async (req, res, next) => {
  const {
    query: { term },
  } = req;
  try {
    if (!term) {
      console.log(1);
      req.flash("error", "일치하는 검색이 없습니다.");
      return res.redirect("/");
    }

    const searchedMemory = await Memory.find({
      title: { $regex: term },
    }).populate("creator");
    res.render("home", { memories: searchedMemory, term });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
