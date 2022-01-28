// product.ts

import Client from '../database'
import {Color, ColorStore} from './color'
import {Material, MaterialStore} from './material'

// Model for products

// Product type
// TODO
export type Product = {
    id?: string,
    name: string,
    price: number,
    boh: number,
    for_sale: boolean,
    category: string,
    description: string,
    measurments: string,
    owner: string,
    sku: string,
    size_family: string,
    size: string,
    brand: string,
    condition: string,
    instructions: string,
    country_origin: string,
    rn_num: string, 
    weight_grams: number,
    location: Location,
    colors: Color[],
    materials: Material[]
}


// Class to interact with the products database table
export class ProductStore {
    // TODO
    // addMaterial
    // addColor
}