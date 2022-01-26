import {ColorStore, Color} from '../color'

const colorStore = new ColorStore();

describe('Color model tests', () => {
    it('Should have an index method', () => {
        expect(colorStore.index).toBeDefined();
    });
    it('index, should return a list of colors', async () => {
        const result = await colorStore.index();
        expect(result).toEqual([]);
    });
});