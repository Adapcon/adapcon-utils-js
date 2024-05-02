import { EntitySchema } from '../../src/entitySchema'

describe('assembleEntitySchema', () => {
  const validDefaultsObjects = [
    {
      solicitation: {
        appId: true,
        jsonData: {
          address: true
        }
      },
      entitySchema: {
        appId: {
          type: 'string',
          occult: false,
          required: true,
          label: 'Portal'
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
              label: 'Ocorrência'
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
                  label: 'Estado'
                },
                city: {
                  type: 'string',
                  occult: false,
                  required: true,
                  label: 'Cidade'
                }
              }
            }
          }
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
            label: 'Ocorrência'
          }
        }
      },
      returnExpected: {
        appId: {
          type: 'string',
          occult: false,
          required: true,
          label: 'Portal'
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
                  label: 'Estado'
                },
                city: {
                  type: 'string',
                  occult: false,
                  required: true,
                  label: 'Cidade'
                }
              }
            }
          }
        }
      }
    },
    {
      solicitation: {
        jsonData: true
      },
      entitySchema: {
        appId: {
          type: 'string',
          occult: false,
          required: true,
          label: 'Portal'
        }
      },
      returnExpected: {}
    },
    {
      solicitation: {
        appId: true
      },
      entitySchema: undefined,
      returnExpected: {}
    },
    {
      solicitation: {
        test: {
          children1: true
        }
      },
      entitySchema: {
        test: {
          type: 'array',
          occult: false,
          required: true,
          label: 'teste',
          contentArray: {
            children1: {
              type: 'string',
              occult: false,
              required: true,
              label: 'teste'
            },
            children2: {
              type: 'string',
              occult: false,
              required: true,
              label: 'teste'
            }
          }
        }
      },
      returnExpected: {
        test: {
          contentArray: {
            children1: {
              label: 'teste',
              occult: false,
              required: true,
              type: 'string'
            },
            children2: {
              label: 'teste',
              occult: false,
              required: true,
              type: 'string'
            }
          },
          contentObject: {
            children1: {
              label: 'teste',
              occult: false,
              required: true,
              type: 'string'
            }
          },
          label: 'teste',
          occult: false,
          required: true,
          type: 'array'
        }
      }
    }
  ]

  test.each(validDefaultsObjects)('should returns validation of the provided specific entity schema', ({ solicitation, entitySchema, returnExpected }) => {
    expect(EntitySchema.assembleEntitySchema(solicitation, entitySchema)).toEqual(returnExpected)
  })
})
