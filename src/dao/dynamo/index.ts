import { isObject } from '../../object';
import dbClient from 'aws-dynamodb-factory-js';
import { error } from '../../error';

interface Params {
  TableName?: any,
  Key?: any,
  Limit?: number,
  ExclusiveStartKey?: object,
  ExpressionAttributeNames?: object,
}

interface ResponseBatch {
  UnprocessedItems: object,
}

export class DynamoDBGenericDao {
  static async get({
    params,
    fields = [],
  }: { params: Params, fields?: Array<string> }): Promise<object> {
    const { Item } = await dbClient.doc().get({
      ...params,
      ...this.mountProjectionExpression({ fields, options: params }),
    }).promise();

    return Item;
  }

  static async query({
    params, fields = [], _items = [], stopOnLimit = false,
  }: { params: Params, fields?: Array<string>, _items?: Array<object>, stopOnLimit?: boolean }): Promise<Array<object>> {
    const { Items, LastEvaluatedKey } = await dbClient.doc().query({
      ...params,
      ...this.mountProjectionExpression({ fields, options: params }),
    }).promise();

    const newItemsList = (Array.isArray(Items) && Items.length > 0)
      ? _items.concat(Items)
      : _items;

    if (stopOnLimit && params.Limit && newItemsList.length >= params.Limit) return newItemsList;

    if (LastEvaluatedKey) {
      return this.query({
        fields,
        params: {
          ...params,
          ExclusiveStartKey: LastEvaluatedKey,
        },
        _items: newItemsList,
      });
    }

    return newItemsList;
  }

  static async getAll({ params, list, fields = [] }: { params: Params, list: Array<object>, fields?: Array<string> }) {
    let idx = 0;

    // ? Pack 25 requests at a time (batchGet limit)

    const packs: any = list.reduce((acc, param) => {
      if (acc[idx] && acc[idx].length >= 25) idx++;

      if (!acc[idx]) acc[idx] = [];

      acc[idx].push({ ...param });

      return acc;
    }, []);

    const data = await Promise.all(packs.map(keys => {
      const opts = {
        RequestItems: {
          [params.TableName]: {
            Keys: keys,
            ...this.mountProjectionExpression({ fields }),
          },
        },
      };

      return dbClient.doc().batchGet(opts)
        .promise()
        .then(({ Responses }) => Responses[params.TableName]);
    }));

    return data.reduce((acc: any, i) => acc.concat(i), []);
  }

  static async put({ params = {} }: { params: Params }): Promise<object> {
    try {
      await dbClient.doc().put(params).promise();

      return {};
    } catch (err) {
      if (err && err.code === 'ConditionalCheckFailedException') return {};
      throw error(500, err.message);
    }
  }

  static async update({ params = {} }: { params: Params }): Promise<any> {
    try {
      await dbClient.doc().update(params).promise();
    } catch (err) {
      throw error(500, err.message);
    }
  }

  static async delete({ params = {} }: { params: Params }): Promise<object> {
    try {
      await dbClient.doc().delete(params).promise();

      return params.Key;
    } catch (err) {
      throw error(500, err.message);
    }
  }

  static async deleteBatch({ params, list }: { params: Params, list: Array<object> }): Promise<void> {
    let idx = 0;

    // ? Pack 25 requests at a time (batchWrite limit)

    const packs: any = list.reduce((acc, param) => {
      if (acc[idx] && acc[idx].RequestItems[params.TableName].length >= 25) idx++;

      if (!acc[idx]) {
        acc[idx] = {
          RequestItems: {
            [params.TableName]: [],
          },
        };
      }

      acc[idx].RequestItems[params.TableName].push({
        DeleteRequest: {
          Key: param,
        },
      });

      return acc;
    }, []);

    await this.executeBatch(packs);
  }

  static deleteAll(params: Array<Params> = []): Promise<Array<object>>{
    return Promise.all(
      params.map(param => this.delete({
        params: param,
      })),
    );
  }

  static async putBatch({ params, list }: { params: Params, list: Array<object> }): Promise<void> {
    let idx = 0;
    // ? Pack 25 requests at a time (batchWrite limit)
    const packs: any = list.reduce((acc, param) => {
      if (acc[idx] && acc[idx].RequestItems[params.TableName].length >= 25) idx++;

      if (!acc[idx]) {
        acc[idx] = {
          RequestItems: {
            [params.TableName]: [],
          },
        };
      }

      acc[idx].RequestItems[params.TableName].push({
        PutRequest: {
          Item: param,
        },
      });

      return acc;
    }, []);

    await this.executeBatch(packs);
  }

  /**
   *
   * @param {Array<{
   *  RequestItems: {
   *    [tableName]: {
   *      DeleteRequest: {
   *        Key: Object
   *      } |
   *      PutRequest: {
   *        Item: Object
   *      }
   *    }
   *  }
   * }>} packs
   */
  static async executeBatch(packs: Array<object> = []) {
    const results = await Promise.all(packs.map(pack => dbClient.doc().batchWrite(pack).promise()));

    const newPacks = this.getUnprocessedItems(results);

    if (Array.isArray(newPacks) && newPacks.length > 0)
      await this.executeBatch(newPacks);
  }

  static getUnprocessedItems(responseBatch: Array<ResponseBatch>): Promise<Array<object>> {
    let idx = 0;

    return responseBatch.reduce((acc: any, value) => {
      if (!isObject(value) || !isObject(value.UnprocessedItems)) return acc;

      // ? Our batches use only 1 table each time
      const tableName = Object.keys(value.UnprocessedItems)[0];

      // ? there is no unprocessed item
      if (!tableName) return acc;

      const processList = value.UnprocessedItems[tableName];

      processList.forEach(process => {
        if (acc[idx] && acc[idx].RequestItems[tableName].length >= 25) idx++;

        if (!acc[idx]) {
          acc[idx] = {
            RequestItems: {
              [tableName]: [],
            },
          };
        }

        acc[idx].RequestItems[tableName].push(process);
      });

      return acc;
    }, []);
  }

  static async dynamicUpdate({
    object,
    removeAttributes,
    params,
  }: { object: object, removeAttributes?: Array<string>, params: Params }): Promise<any> {
    try {
      const updateExpressionItems: Array<string> = [];
      const removeExpressionItems: Array<string> = [];
      const ExpressionAttributeValues = {};
      const ExpressionAttributeNames = {};

      Object.entries(object).forEach(([key, value]) => {
        const attributeName = `#${key}`;
        const attributeValue = `:${key}`;

        updateExpressionItems.push(`${attributeName} = ${attributeValue}`);
        ExpressionAttributeValues[attributeValue] = value;
        ExpressionAttributeNames[attributeName] = key;
      });

      if (Array.isArray(removeAttributes)) {
        removeAttributes.forEach(key => {
          const attributeName = `#${key}`;

          removeExpressionItems.push(attributeName);
          ExpressionAttributeNames[attributeName] = key;
        });
      }

      const UpdateExpression = `\
        ${updateExpressionItems.length ? `SET ${updateExpressionItems.join(', ')}` : ''}\
        ${removeExpressionItems.length ? `REMOVE ${removeExpressionItems.join(', ')}` : ''}\
      `;

      const updateParams = {
        ...params,
        UpdateExpression,
        ExpressionAttributeValues,
        ExpressionAttributeNames,
        ReturnValues: 'UPDATED_NEW',
      };

      return await dbClient.doc().update(updateParams).promise();
    } catch (err) {
      if (err && err.code === 'ConditionalCheckFailedException') return {};
      throw error(500, err.message);
    }
  }

  /**
   *
   * @param {import('aws-sdk/clients/dynamodb').QueryInput} options
   * @param {Array<{
   *  field: string;
   *  value: string;
   *  operator: !string;
   * }>} filters
   */
  static dynamicFilters({
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  }: { ExpressionAttributeNames?: object, ExpressionAttributeValues?: object }, filters: Array<object>): object {
    const newExpressionAttributeNames = { ...(ExpressionAttributeNames || {}) };
    const newExpressionAttributeValues = { ...(ExpressionAttributeValues || {}) };

    const filterExpression: Array<string> = [];

    if (filters.length > 0) {
      filters.forEach(({ field, value, operator = '=' }: { field: string, value: any, operator: string }, index: number) => {
        if (operator === 'BETWEEN') {
          const [start, end] = value;
          filterExpression.push(`#filter_${index} ${operator} :filter_between_0_${index} AND :filter_between_1_${index}`);

          newExpressionAttributeNames[`#filter_${index}`] = field;
          newExpressionAttributeValues[`:filter_between_0_${index}`] = start;
          newExpressionAttributeValues[`:filter_between_1_${index}`] = end;
        } else {
          filterExpression.push(`#filter_${index} ${operator} :filter_${index}`);

          newExpressionAttributeNames[`#filter_${index}`] = field;
          newExpressionAttributeValues[`:filter_${index}`] = value;
        }
      });
    }

    if (!filterExpression.length) return {};

    return {
      ExpressionAttributeNames: newExpressionAttributeNames,
      ExpressionAttributeValues: newExpressionAttributeValues,
      FilterExpression: filterExpression.join(' AND '),
    };
  }

  static mountProjectionExpression({ fields = [], options = {} }: { fields?: Array<string>, options?: Params }): object {
    if (fields.length > 0) {
      const ProjectionExpression = fields.map((_, index) => `#Projection_${index}`).join(',');
      let { ExpressionAttributeNames } = options;
  
      if (!ExpressionAttributeNames) ExpressionAttributeNames = {};
  
      fields.forEach((i, index) => {
        ExpressionAttributeNames![`#Projection_${index}`] = i;
      });
  
      return { ProjectionExpression, ExpressionAttributeNames };
    }
    return {};
  };
};
