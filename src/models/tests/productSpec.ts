
// productSpec.ts

// Tests for product model

import {ProductStore, Product} from '../product'
import {LocationStore, Location} from '../location'
import {MaterialStore, Material} from '../material'
import {ColorStore, Color} from '../color'
import objectNullValsToUndefined from '../../utilities/utilities'

const productStore = new ProductStore();
const colorStore = new ColorStore();

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
    color_ids: ["1"]
};

var orangeColor: Color = {
    name: "Orange"
}
var orangeId: string;
var orange: Color;

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

describe('Product model tests', () => {
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
        const createResult = await productStore.create(jacket);
        // create a copy of result to change null values to undefined 
        const copyResult = (objectNullValsToUndefined(createResult) as Product);
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
        // create product row
        const createResult = await productStore.create(jacket);
        const prodId = createResult.id?.toString();
        // check id is defined for added product
        if(prodId){
            // delete product row
            const delResult = await productStore.delete(prodId.toString());
            // check to see if correct row was deleted
            expect(delResult.id).toEqual(createResult.id);
            expect(delResult.name).toEqual(createResult.name);
        }else{
            throw new Error("Invalid product id");
        }

    });

});