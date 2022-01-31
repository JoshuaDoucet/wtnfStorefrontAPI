
// productSpec.ts

// Tests for product model

import {ProductStore, Product} from '../product'
import {LocationStore, Location} from '../location'
import {ColorStore, Color} from '../color'
import {MaterialStore, Material} from '../material'
import utilities from '../../utilities/utilities'

/*
beforeEach(async function() {
    orangeColor = await colorStore.create(orangeColor);
    if(orangeColor.id && jacket.color_ids){
        orangeId = orangeColor.id;
        jacket.color_ids[0] = orangeId
    }
})

afterEach(async function() {
   // await colorStore.delete(orangeId)
})
*/

describe('Product model tests', () => {
    const productStore = new ProductStore();
    var jacket: Product = {
        name: "Columbia Blue/Gray Winter Jacket, Mens, XL",
        price: 139.95,
        cost: 89,
        boh: 1,
        for_sale: false,
        category: "Jackets/Winter",
        description: "A lightly used winter coat. Great in cold",
        measurments: "Chest: 44 in, Waist: 32 in, Length: 33 in",
        owner: "JD",
        sku: "JD/M/TOP/0001",
        size_family: "MENS",
        size: "XL",
        brand: "Columbia",
        condition: "Used- Like New",
        instructions: "Machine wash cold. Tumble dry low",
        country_origin: "Thailand",
        rn_num: "101654",
        weight_grams: 978,
        color_ids: ["1", "2"],
        material_ids: ["1"],
        location_id: "1"
    };
    var jacketId: string | undefined;

    const colorStore = new ColorStore();
    var orangeColor: Color = {
        name: "Orange"
    }
    var orangeId: string | undefined;
    var pinkColor: Color = {
        name: "Pink"
    }
    var pinkId: string | undefined;

    const materialStore = new MaterialStore();
    var silkMaterial: Material = {
        name: "Silk"
    }
    var materialId: string | undefined;

    const locationStore = new LocationStore();
    var testLocation: Location = {
        name: "Test Location",
        zip: 80922
    }
    var locationId : string | undefined;
    
    beforeAll(async function () {
        // Create sample objects that product shou;d relate to
        
        // Create location and add its id to test jacket product
        await locationStore.deleteAll();
        const location = await locationStore.create(testLocation);
        locationId = location.id;
        jacket.location_id = locationId;

        // Create 2 colors and add their ids to test jacket product
        await colorStore.deleteAll();
        const color1 = await colorStore.create(orangeColor);
        orangeId = color1.id;
        const color2 = await colorStore.create(pinkColor);
        pinkId = color2.id;
        if(orangeId && pinkId){
            jacket.color_ids = [orangeId, pinkId];
        }
        
        // Create material and add its id to test jacket product
        await materialStore.deleteAll();
        const material = await materialStore.create(silkMaterial);
        materialId = material.id;
        if(materialId)
            jacket.material_ids = [materialId];
    });

    afterAll(async function(){
        // empty all tables that the tests interacted with
        locationStore.deleteAll();
        materialStore.deleteAll();
        colorStore.deleteAll();
        productStore.deleteAll();
    });

    beforeEach( async function() {
        // Delete products and create 1 jacket before each test
        await productStore.deleteAll();
        const product = await productStore.create(jacket);
        jacketId = product.id;
    });

    // READ tests
    it('Should have an index method', () => {
        expect(productStore.index).toBeDefined();
    });
    it('index should return a list of 1 product', async () => {
        const result = await productStore.index();
        expect(result.length).toEqual(1);
    });
    it('Should have a show method', () => {
        expect(productStore.show).toBeDefined();
    });

    // CREATE tests
    it('Should have a create method', () => {
        expect(productStore.create).toBeDefined();
    });
    it('Should add sample product to the products table', async () => {
        await productStore.deleteAll();
        const createResult = await productStore.create(jacket);
        // create a copy of result to change null values to undefined 
        const copyResult = (utilities.objectNullValsToUndefined(createResult) as Product);
        // check to see if correct product details were added to new row
        expect(copyResult.name).toEqual(jacket.name);
        expect(copyResult.price+'').toEqual(jacket.price+'');
        expect(copyResult.cost+'').toEqual(jacket.cost+'');
        expect(copyResult.boh).toEqual(jacket.boh);
        expect(copyResult.for_sale).toEqual(jacket.for_sale);
        expect(copyResult.category).toEqual(jacket.category);
        expect(copyResult.description).toEqual(jacket.description);
        expect(copyResult.measurments).toEqual(jacket.measurments);
        expect(copyResult.owner).toEqual(jacket.owner);
        expect(copyResult.sku).toEqual(jacket.sku);
        expect(copyResult.size_family).toEqual(jacket.size_family);
        expect(copyResult.size).toEqual(jacket.size);
        expect(copyResult.brand).toEqual(jacket.brand);
        expect(copyResult.condition).toEqual(jacket.condition);
        expect(copyResult.instructions).toEqual(jacket.instructions);
        expect(copyResult.country_origin).toEqual(jacket.country_origin);
        expect(copyResult.rn_num).toEqual(jacket.rn_num);
        expect(copyResult.weight_grams).toEqual(jacket.weight_grams);
        expect(copyResult.location_id).toEqual(jacket.location_id+'');

        // if test object had a material_ids list, it should return indo about materials_ids
        if(jacket.material_ids){
            if(copyResult.material_ids){
                expect(copyResult.material_ids.length).toEqual(jacket.material_ids.length);
            }else{
                throw new Error("product materials_ids is defined, but not returned adter adding to DB")
            }
        }
        // if test object had a color_ids list, it should return indo about color_ids
        if(jacket.color_ids){
            if(copyResult.color_ids){
                expect(copyResult.color_ids.length).toEqual(jacket.color_ids.length);
            }else{
                throw new Error("product color_ids is defined, but not returned adter adding to DB")
            }
        }
    });

    // DELETE tests
    it('Should have a delete method', () => {
        expect(productStore.delete).toBeDefined();
    });
    it("delete should remove a product from the products table", async () => {
        // check id is defined for added product
        if(jacketId){
            // delete product row
            const delResult = await productStore.delete(jacketId.toString());
            // check to see if correct row was deleted
            expect(delResult.id).toEqual(jacketId);
            expect(delResult.name).toEqual(jacket.name);
        }else{
            throw new Error("Invalid product id");
        }

    });

});