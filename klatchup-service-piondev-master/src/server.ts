import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import config from "config";
import { app } from "./app";
import { createTableIfDoesNotExist } from "./util/createTableIfDoesNotExist";

const port = config.get("server.port");

setImmediate(async () => {
  await createTableIfDoesNotExist(new DynamoDBClient(config.get("dynamodb")));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
