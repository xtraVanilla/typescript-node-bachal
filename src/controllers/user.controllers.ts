import { DynamoDB } from "aws-sdk";
const db = new DynamoDB();
import { UserModel, BookModel } from "../models";

async function checkoutABook(req, res) {
  try {
    // 1. decrement "available" counter in book table
    const bookRes = await db
      .updateItem({
        TableName: "BookTable",
        Key: {
          id: req.params.id,
        },
        UpdateExpression: "SET available = available + :incr",
        ExpressionAttributeValues: { ":incr": { N: "1" } },
      })
      .promise();

    // 2. add book to list of ids in "checkedoutBooks" in user table
    const userRes = await UserModel.update(
      { id: req.params.id },
      // @ts-ignore
      { $ADD: { checkedoutBooks: req.body.book } }
    );

    return res.json({
      bookRes,
      userRes,
    });
  } catch (e) {
    console.log(e);
  }
}

async function returnABook(req, res) {
  try {
    // 1. increase "available" counter in book table
    const bookRes = await BookModel.update(
      { id: req.params.id },
      // @ts-ignore
      { $ADD: { available: 1 } }
    );

    // 2. remove book id from list of ids in "checkedoutBooks" in user table
    const userRes = await db
      .updateItem({
        TableName: "UserTable",
        Key: {
          id: req.params.id,
        },
        UpdateExpression: "DELETE checkedoutBooks = :book",
        ExpressionAttributeValues: { ":book": { S: req.body.book } },
      })
      .promise();

    return res.json({
      bookRes,
      userRes,
    });
  } catch (e) {
    console.log(e);
  }
}

async function listAllBooksByUser(req, res) {
  try {
    // get all book ids from "checkedoutBooks" ids in user table
    const user = await UserModel.get({ id: req.params.id });

    if (user.checkedoutBooks) {
      // batch get books by id from book table
      const books = BookModel.batchGet(user.checkedoutBooks);
      return res.json(books);
    }
  } catch (e) {
    console.log(e);
  }
}

export default {
  checkoutABook,
  returnABook,
  listAllBooksByUser,
};
