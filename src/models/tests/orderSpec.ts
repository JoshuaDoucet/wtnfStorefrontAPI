
// orderSpec.ts

// Tests for Order model

import {ProductStore, Product} from '../product'
import {OrderStore, Order} from '../order'

const productStore = new ProductStore();
const orderStore = new OrderStore();

var purse: Product = {
    name: "Toni, Gray Cross-Body Bag",
    price: 49.95,
    cost: 10,
    boh: 1,
    for_sale: false,
    category: "Bag",
    owner: "JD",
    size: "OS",
    brand: "Toni",
    condition: "Used- Like New",
    weight_grams: 210,
};

var testOrder: Order = {
    status: "active",
    user_id: "1"
}

var order: Order;
var order_id: string;

beforeEach(async function (){
    order = await orderStore.create(testOrder);
    if(order.id)
        order_id = order.id;
})


describe('Order model tests', () => {
    // READ tests
    it('Should have an index method', () => {
        expect(orderStore.index).toBeDefined();
    });
    it('index should return a list of 2 order', async () => {
        const result = await orderStore.index();
        expect(result.length).toEqual(2);
    });
    it('Should have a show method', () => {
        expect(orderStore.show).toBeDefined();
    });

    // CREATE tests
    it('Should have a create method', () => {
        expect(orderStore.create).toBeDefined();
    });

    it('Should add sample order to the orders table', async () => {
        const createResult = await orderStore.create(order);
        // check to see if correct order details were added to new row
        expect(createResult.status).toEqual(testOrder.status);
        expect(createResult.id).toBeDefined;
    });

    // DELETE tests
    it('Should have a delete method', () => {
        expect(orderStore.delete).toBeDefined();
    });
    it("delete should remove an order from the orders table", async () => {
        // create order row
        const createResult = await orderStore.create(testOrder);
        const orderId = createResult.id?.toString();
        // check id is defined for added order
        if(orderId){
            // delete order row
            const delResult = await orderStore.delete(orderId.toString());
            // check to see if correct row was deleted
            expect(delResult.user_id).toBeFalsy();
            expect(delResult.status).toEqual(createResult.status);
        }else{
            throw new Error("Invalid order id");
        }

    });

});