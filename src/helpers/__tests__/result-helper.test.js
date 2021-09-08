import { generateResult } from '../result-helper';

jest.mock('../../game-settings', () => {
  return { choices: [10, 20] };
});

describe('generateResult', () => {
  it('should return choice in choices setting', () => {
    // act
    const actualResult = generateResult();

    // assert
    expect(Object.values(actualResult)).toSatisfyAll((r) => r >= 0 && r <= 1);
  });
});
