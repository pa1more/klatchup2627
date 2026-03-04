import config from "config";
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceNotFoundException,
} from "@aws-sdk/client-dynamodb";

export const createTableIfDoesNotExist = async (client: DynamoDBClient) => {

  try {
    await client.send(
      new DescribeTableCommand({
        TableName: config.get("dbTables.klatchup.name"),
      }),
    );
  } catch (e) {
    if (!(e instanceof ResourceNotFoundException)) {
      throw e;
    }

    await client.send(
      new CreateTableCommand({
        TableName: config.get("dbTables.klatchup.name"),
        AttributeDefinitions: [
          {
            AttributeName: "ProfileID",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            AttributeName: "ProfileID",
            KeyType: "HASH",
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      }),
    );
  }
};
