import { run } from '../app';

jest.mock(
  'awilix',
  () => {
    return {
      asClass: jest.fn((t) => t),
      InjectionMode: jest.fn(() => {}),
      createContainer: jest.fn(() => {}),
    };
  },
  { virtual: true }
);

const mAppStatus = {
  started: false,
};

jest.mock('../game-container-registry', () => {
  return function () {
    return {
      register: () => {
        return { resolve: jest.fn() };
      },
    };
  };
});

jest.mock('sc-game-base/src/core/base-game-app', () => {
  const mApp = {
    run: () => {
      mAppStatus.started = true;
    },
  };

  return function () {
    return mApp;
  };
});

describe('app', () => {
  describe('run', () => {
    it('should call app.run', async () => {
      // arrange
      mAppStatus.started = false;

      // act
      await run();

      //assert
      expect(mAppStatus.started).toBe(true);
    });
  });
});
