import { DeleteCommand, DynamoDBDocument, GetCommand, GetCommandInput, PutCommand, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { IDynamoDBFactory, Recordable, TableKeys, ProjectedResult, ProjectionFields, QueryResponse, ScanResponse } from "./dynamodb.types";

export class DynamoDBFactory<T extends Recordable, K extends TableKeys> implements IDynamoDBFactory<T, K> {
  public readonly client: DynamoDBDocument
  private readonly tableName: string

  constructor(
    client: DynamoDBDocument,
    tableName: string
  ) {
    this.client = client
    this.tableName = tableName
  }

  async put(item: T): Promise<T> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    })

    await this.client.send(command)

    return item
  }

  async delete(keys: K) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: keys,
    })

    await this.client.send(command)
  }

  async get<Fields extends ProjectionFields<T> | undefined = undefined>(
    keys: K,
    projection?: Fields
  ): Promise<ProjectedResult<T, Fields> | undefined> {
    const params: GetCommandInput = {
      TableName: this.tableName,
      Key: keys,
    }

    const hasProjectionFields = projection && projection.length > 0
    if (hasProjectionFields) {
      const expressionParts: string[] = []
      const attributeNames: Record<string, string> = {}

      for (const field of projection) {
        const placeholder = `#${field}`
        expressionParts.push(placeholder)
        attributeNames[placeholder] = field
      }

      params.ProjectionExpression = expressionParts.join(", ")
      params.ExpressionAttributeNames = attributeNames
    }

    const command = new GetCommand(params)

    const { Item } = await this.client.send(command)

    return Item as ProjectedResult<T, Fields>
  }

  async query(params: Omit<QueryCommandInput, 'TableName'>): Promise<QueryResponse<T>> {
    const command = new QueryCommand({
      TableName: this.tableName,
      ...params,
    })

    const { Items, LastEvaluatedKey, Count } = await this.client.send(command)

    return {
      items: Items as T[],
      lastKey: LastEvaluatedKey,
      count: Count,
    }
  }

  async scan(params: Omit<ScanCommandInput, 'TableName'>): Promise<ScanResponse<T>> {
    const command = new ScanCommand({
      TableName: this.tableName,
      ...params,
    })

    const { Items, LastEvaluatedKey } = await this.client.send(command)

    return {
      items: Items as T[],
      lastKey: LastEvaluatedKey,
    }
  }
}
