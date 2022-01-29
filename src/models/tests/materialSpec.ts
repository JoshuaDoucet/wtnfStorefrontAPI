import {MaterialStore, Material} from '../material'

const materialStore = new MaterialStore();

const leatherMat: Material = {name: "Brown leather"};

describe('Material model tests', () => {
    // READ tests
    it('Should have an index method', () => {
        expect(materialStore.index).toBeDefined();
    });
    it('index should return a list with 1 material', async () => {
        const result = await materialStore.index();
        expect(result.length).toEqual(2);
    });
    it('Should have an show method', () => {
        expect(materialStore.show).toBeDefined();
    });

    // CREATE tests
    it('Should have a create method', () => {
        expect(materialStore.create).toBeDefined();
    });
    it('Should add brown leather material to the materials table', async () => {
        const createResult = await materialStore.create(leatherMat);
        expect(createResult.name).toEqual("Brown leather");
    });

    // DELETE tests
    it('Should have a delete method', () => {
        expect(materialStore.delete).toBeDefined();
    });
    it("delete should remove a material from the materials table", async () => {
        // create material row
        const createResult = await materialStore.create(leatherMat);
        const matId = createResult.id?.toString();
        // check id is defined for added material
        if(matId){
            // delete material row
            const delResult = await materialStore.delete(matId.toString());
            // check to see if correct row was deleted
            expect(delResult.id).toEqual(createResult.id);
            expect(delResult.name).toEqual(createResult.name);
        }else{
            throw new Error("Invalid material id");
        }

    });

});