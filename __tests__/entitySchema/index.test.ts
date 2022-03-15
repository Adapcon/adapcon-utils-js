import { assembleEntitySchema } from '../../src/entitySchema';

describe('assembleEntitySchema', () => {
  const validDefaultsObjects = [
    {
      solicitation: {
        appId: true,
        jsonData: {
          address: true,
        },
      },
      entitySchema: {
        appId: {
          type: 'string',
          occult: false,
          required: true,
          label: 'Portal',
        },
        jsonData: {
          type: 'object',
          occult: false,
          required: true,
          label: 'Dados',
          contentObject: {
            occurrence: {
              type: 'string',
              occult: false,
              required: true,
              label: 'Ocorrência',
            },
            address: {
              type: 'object',
              occult: false,
              required: true,
              label: 'Endereço',
              contentObject: {
                state: {
                  type: 'string',
                  occult: false,
                  required: true,
                  label: 'Estado',
                },
                city: {
                  type: 'string',
                  occult: false,
                  required: true,
                  label: 'Cidade',
                },
              },
            },
          },
        },
        test: {
          type: 'array',
          occult: false,
          required: true,
          label: 'teste',
          contentArray: {
            type: 'string',
            occult: false,
            required: true,
            label: 'Ocorrência',
          },
        },
      },
      returnExpected: {
        appId: {
          type: 'string',
          occult: false,
          required: true,
          label: 'Portal',
        },
        jsonData: {
          type: 'object',
          occult: false,
          required: true,
          label: 'Dados',
          contentObject: {
            address: {
              type: 'object',
              occult: false,
              required: true,
              label: 'Endereço',
              contentObject: {
                state: {
                  type: 'string',
                  occult: false,
                  required: true,
                  label: 'Estado',
                },
                city: {
                  type: 'string',
                  occult: false,
                  required: true,
                  label: 'Cidade',
                },
              },
            },
          },
        },
      },
    },
    {
      solicitation: {},
      entitySchema: {
        appId: {
          type: 'string',
          occult: false,
          required: true,
          label: 'Portal',
        },
      },
      returnExpected: {},
    },
  ];

  test.each(validDefaultsObjects)('should returns validation of the provided specific entity schema', ({ solicitation, entitySchema, returnExpected }) => {
    expect(assembleEntitySchema(solicitation, entitySchema)).toEqual(returnExpected);
  });
});
