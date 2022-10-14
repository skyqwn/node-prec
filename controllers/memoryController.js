import Memory from "../model/Memory.js";

export const memory = async (req, res, next) => {
  try {
    const memories = await Memory.find();
    console.log(memories);
    res.render("memory", { memories });
  } catch (error) {
    next(error);
  }
};

export const memoryUpload = (req, res) => {
  res.render("memoryUpload");
};

export const memoryUploadPost = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  const {
    file: { path },
    body: { title, desc },
  } = req;

  try {
    const memory = new Memory({
      file: path,
      title,
      desc,
    });
    console.log(memory);
    await memory.save();
    return res.redirect("/memory");
  } catch (error) {
    next(error);
  }
};
