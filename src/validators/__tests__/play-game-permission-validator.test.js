import { PlayGamePermissionValidator } from '../index';

describe('play-game-permission-validator', () => {
    describe('validate', () => {
        it('always returns true', async () => {
            // arrange
            const validator = new PlayGamePermissionValidator();

            // act
            const actualValue = validator.validate();

            //assert
            expect(actualValue).toBeTruthy();
        });
    });
});
