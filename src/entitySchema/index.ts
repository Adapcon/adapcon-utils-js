export const assembleEntitySchema = (solicitation: any, entitySchema: any): object => {
  const defaultObject = {};
  const properties = Object.keys(solicitation);

  properties.forEach(key => {
    if (entitySchema === undefined) return;
    const haveChildren = typeof solicitation[key] === 'object';
    const property = entitySchema[key];

    if (property === undefined) return;

    if (haveChildren) {
      defaultObject[key] = {
        ...property,
        contentObject: {
          ...assembleEntitySchema(solicitation[key], property.contentObject || property.contentArray),
        },
      };
    } else defaultObject[key] = property;
  });

  return defaultObject;
}
