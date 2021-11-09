import GameInGameConsumer from '../game-in-game-consumer';

describe('game-in-game-consumer', () => {
  describe('consume', () => {
    it('should return definition.choices', async () => {
      // arrange
      const definition = { choices: [] };
      const publisher = { publishToUser: jest.fn() };
      const consumer = new GameInGameConsumer(definition, publisher);
      const player = { UID: 1 };

      // act
      await consumer.consume(player);

      //assert
      expect(publisher.publishToUser).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ choices: definition.choices })
      );
    });
  });
});
