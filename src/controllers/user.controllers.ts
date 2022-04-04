import { DynamoDB } from "aws-sdk";
const db = new DynamoDB();
import { UserModel } from "../models";

async function decrementBookCount(id: any) {
  const BOOK_TABLE_PARAMS: DynamoDB.UpdateItemInput = {
    TableName: "BookTable",
    Key: {
      id,
    },
    UpdateExpression: "SET available = available + :incr",
    ExpressionAttributeValues: { ":incr": { N: "1" } },
  };

  const res = await db.updateItem(BOOK_TABLE_PARAMS).promise();

  return res;
}

async function checkoutABook(req, res) {
  // 1. decrement "available" counter in book table
  await decrementBookCount(req.params.id);

  // 2. add book to list of ids in "checkedoutBooks" in user table
  const USER_TABLE_PARAMS: DynamoDB.UpdateItemInput = {
    TableName: "UserTable",
    Key: {
      id: req.params.id,
    },
    UpdateExpression: "SET checkedoutBooks = :book",
    ExpressionAttributeValues: { ":book": { S: req.body.book } },
  };

  try {
    await UserModel.update(
      { id: req.params.id },
      // @ts-ignore
      { $ADD: { checkedoutBooks: req.body.book } }
    );

    let result = {};

    await db.updateItem(USER_TABLE_PARAMS, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res["USER_TABLE_PARAMS"] = data;
      }
    });

    return res.json(result);
  } catch (e) {
    console.log(e);
  }
}

async function returnABook(req, res) {
  // 1. increase "available" counter in book table
  const BOOK_TABLE_PARAMS: DynamoDB.UpdateItemInput = {
    TableName: "BookTable",
    Key: {
      id: req.params.id,
    },
    UpdateExpression: "SET available = available - :decr",
    ExpressionAttributeValues: { ":decr": { N: "1" } },
  };

  // 2. remove book id from list of ids in "checkedoutBooks" in user table
  const USER_TABLE_PARAMS: DynamoDB.UpdateItemInput = {
    TableName: "UserTable",
    Key: {
      id: req.params.id,
    },
    UpdateExpression: "DELETE checkedoutBooks = :book",
    ExpressionAttributeValues: { ":book": { S: req.body.book } },
  };

  try {
    let result = {};

    await db.updateItem(BOOK_TABLE_PARAMS, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res["BOOK_TABLE_PARAMS"] = data;
      }
    });

    await db.updateItem(USER_TABLE_PARAMS, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res["USER_TABLE_PARAMS"] = data;
      }
    });

    return res.json(result);
  } catch (e) {
    console.log(e);
  }
}

async function listAllBooksByUser(req, res) {
  // get all book ids from "checkedoutBooks" ids in user table
  const USER_TABLE_PARAMS: DynamoDB.GetItemInput = {
    TableName: "UserTable",
    Key: {
      id: req.params.id,
    },
  };

  // batch get books by id from book table
  try {
    const user: UserModel = await (
      await db.getItem(USER_TABLE_PARAMS).promise()
    ).Item;

    if (user) {
      const BOOK_TABLE_PARAMS: DynamoDB.BatchGetItemInput = {
        RequestItems: {
          BookTable: {
            Keys: user.checkedoutBooks.map((id) => ({
              id: { S: id },
            })),
          },
        },
      };

      const books = await db.batchGetItem(BOOK_TABLE_PARAMS);

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
