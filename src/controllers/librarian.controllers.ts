import { BookModel, BookSchema } from "../models";

async function getAllBooks(_, res) {
  try {
    const books = await (
      await (await BookModel.scan().exec()).populate()
    ).toJSON();
    return res.json(books) as BookSchema;
  } catch (e) {
    console.log(e);
  }
}

async function removeBookById(req, res): Promise<{ success: boolean }> {
  try {
    await BookModel.delete({ id: req.params.id });
    return res.json({ success: true });
  } catch (e) {
    console.log(e);
    return res.json({ success: false });
  }
}

async function addAbook(req) {
  try {
    const res = await BookModel.batchPut([
      {
        id: req.params.id,
        title: req.body.title,
        author: req.body.author,
        quantity: req.body.quantity,
        available: req.body.avaialable,
      },
    ]);

    // @ts-ignore
    return res as BookSchema;
  } catch (e) {
    console.log(e);
  }
}

export default {
  getAllBooks,
  removeBookById,
  addAbook,
};
