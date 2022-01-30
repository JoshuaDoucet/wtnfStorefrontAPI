import {ColorStore, Color} from '../color'

const colorStore = new ColorStore();

const blueColor: Color = {name: "Blue", blue: 255, hex: "0000FF"};


describe('Color model tests', () => {
    // READ tests
    it('Should have an index method', () => {
        expect(colorStore.index).toBeDefined();
    });
    it('index should return a list of 3 color', async () => {
        const result = await colorStore.index();
        expect(result.length).toEqual(3);
    });
    it('Should have an show method', () => {
        expect(colorStore.show).toBeDefined();
    });

    // CREATE tests
    it('Should have a create method', () => {
        expect(colorStore.create).toBeDefined();
    });
    it('Should add blue color to the colors table', async () => {
        const createResult = await colorStore.create(blueColor);
        expect(createResult.name).toEqual("Blue");
        expect(createResult.blue).toEqual(255);
        expect(createResult.hex).toEqual("0000FF");
    });

    // DELETE tests
    it('Should have a delete method', () => {
        expect(colorStore.delete).toBeDefined();
    });
    it("delete should remove a color from the colors table", async () => {
        // create color row
        const createResult = await colorStore.create(blueColor);
        const colorId = createResult.id?.toString();
        // check id is defined for added color
        if(colorId){
            // delete color row
            const delResult = await colorStore.delete(colorId.toString());
            // check to see if correct row was deleted
            expect(delResult.id).toEqual(createResult.id);
            expect(delResult.name).toEqual(createResult.name);
        }else{
            throw new Error("Invalid color id");
        }

    });

});