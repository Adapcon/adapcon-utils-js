import {
  increaseDate,
  decreaseDate,
  changeDate
} from '../../src/date';

describe('increaseDate', () => {
  test.each`
    date|duration|expected
    ${new Date(1636123339970)}|${{year: 2, day: 2}}|${new Date(1699368139970)}
    ${new Date(1636282909077)}|${{month: 5}}|${new Date(1649329309077)}
    ${new Date(1638327600000)}|${{day: 1}}|${new Date(1638414000000)}
    ${new Date(1638327600000)}|${{millisecond: 3600}}|${new Date(1638327603600)}
    ${new Date(1636292510383)}|${{hour: 5, minute: 59}}|${new Date(1636314050383)}
    ${new Date(1609470000000)}|${{second: 1000}}|${new Date(1609471000000)}
  `('returns $expected when $duration is added to $date', ({date,duration,expected}) => {
    expect(increaseDate(date,duration)).toStrictEqual(expected)
  });
})

describe('decreaseDate', () => {
  test.each`
    date|duration|expected
    ${new Date(1636123339970)}|${{year: 2, day: 2}}|${new Date(1572792139970)}
    ${new Date(1636282909077)}|${{month: 5}}|${new Date(1623063709077)}
    ${new Date(1638327600000)}|${{day: 1}}|${new Date(1638241200000)}
    ${new Date(1638327600000)}|${{millisecond: 3600}}|${new Date(1638327596400)}
    ${new Date(1636292510383)}|${{hour: 5, minute: 59}}|${new Date(1636270970383)}
    ${new Date(1609470000000)}|${{second: 1000}}|${new Date(1609469000000)}
  `('returns $expected when $duration is reduced on $date', ({date,duration,expected}) => {
    expect(decreaseDate(date,duration)).toStrictEqual(expected)
  });
});

describe('changeDate', () => {
  test.each`
    date|duration|expected
    ${new Date(1636123339970)}|${{year: 2, day: 2}}|${new Date(1699368139970)}
    ${new Date(1636282909077)}|${{month: 5}}|${new Date(1649329309077)}
    ${new Date(1638327600000)}|${{day: 1}}|${new Date(1638414000000)}
    ${new Date(1638327600000)}|${{millisecond: 3600}}|${new Date(1638327603600)}
    ${new Date(1636292510383)}|${{hour: 5, minute: 59}}|${new Date(1636314050383)}
    ${new Date(1609470000000)}|${{second: 1000}}|${new Date(1609471000000)}
    ${new Date(1636123339970)}|${{year: -2, day: -2}}|${new Date(1572792139970)}
    ${new Date(1636282909077)}|${{month: -5}}|${new Date(1623063709077)}
    ${new Date(1638327600000)}|${{day: -1}}|${new Date(1638241200000)}
    ${new Date(1638327600000)}|${{millisecond: -3600}}|${new Date(1638327596400)}
    ${new Date(1636292510383)}|${{hour: -5, minute: -59}}|${new Date(1636270970383)}
    ${new Date(1609470000000)}|${{second: -1000}}|${new Date(1609469000000)}
    ${new Date(1614567600000)}|${{day: 1, millisecond: -1}}|${new Date(1614653999999)}
  `('returns $expected when $duration is added or reduced to $date', ({date,duration,expected}) => {
    expect(changeDate(date,duration)).toStrictEqual(expected)
  });
});
