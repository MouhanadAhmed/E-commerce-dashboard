import { Response } from "../../../../../../../../_metronic/helpers"

export type Product = {
  imgCover?: [string]
  _id?: string
  name?: string
  slug?: string
  description?: string
  shortDesc?: string
  metaTags?: [string]
  category?: [category]
  subCategory?: [subCategory]
  childSubCategory?: [childSubCategory],
  types?:string [],
  stock?:string,
  price?:number,
  order?: number
  branch?:
    {
      _id?: string
    branch: string,
    available?: boolean,
    order?: number,
    price?: number,
    stock?:string,
    priceAfterDiscount?: number,
    sold?:number,
    id?:string
  }[],
  priceAfterDiscount?:string,
  extras?:{
    _id?: string,
    id?: string,
    extra?:string,
    order?:number
  }[],
  descTableName?:string,
  descTable:{
    _id?: string,
    id?: string,
    name?:string,
    value?:string,
    order?:number
  }[],
  images:string[],
  weight?:string,
  showWeight?:boolean,
  book?:string,
  groupOfOptions?:{
    _id?: string,
    id?: string,
    order?:number,
    optionGroup?:string
  }[],
  minQty?:number,
  quantity?:number,
  dimensions?:string,
  rewardPoint?:string,
  sold?:number,
  available?: boolean,
  createdAt?: string
  updatedAt?: string
  deleted?:boolean,
  parentAvailable?:boolean,
  __v?:number
  id?:string
}

export type Products = {
  name?: string,
  _id?: string,
  category?:[{
    order?:number,
    id?:string|null
  }],
  id?:string|null
}

type category = 
  {
      category?: string ,
      order?: number,
      _id?: string,
      id?: string
  }
type subCategory = 
  {
    subCategory?: string ,
      order?: number,
      _id?: string,
      id?: string
  }
type childSubCategory = 
  {
    childSubCategory?: string ,
      order?: number,
      _id?: string,
      id?: string
  }


export type ProductsQueryResponse = Response<Array<Product>>

export const initialCategory: Product =  
{
  "_id": "65612b477a1d4243849ea3dd",
  "name": "تالت  منتح",
  "slug": "تالت-منتح",
  "description": "وصف تالت منتج",
  "shortDesc": "وصف مختصر تالت منتج",
  "metaTags": [
      "حلويات نورنه شيكولاته"
  ],
  "category": [
      {
          "category": "6560a826d746be4e85f35055",
          "order": 4,
          "_id": "65612b477a1d4243849ea3de",
          "id": "65612b477a1d4243849ea3de"
      }
  ],
  "subCategory": [
      {
          "subCategory": "656216ee9a8c0a15ba5f4c8e",
          "order": 2,
          "_id": "65612b477a1d4243849ea3df",
          "id": "65612b477a1d4243849ea3df"
      }
  ],
  "childSubCategory": [
      {
          "childSubCategory": "6562526e7af67a0b30fd5f7b",
          "order": 1,
          "_id": "65612b477a1d4243849ea3e0",
          "id": "65612b477a1d4243849ea3e0"
      }
  ],
  "types": [
      "655b0bc97a23fe0ef32ff358",
      "655b0bcf7a23fe0ef32ff35a"
  ],
  "stock": "null",
  "available": true,
  "price": 400,
  "branch": [
      {
          "branch": "6559c4abd057da4061a73efa",
          "price": 210,
          "available": true,
          "stock": "null",
          "priceAfterDiscount": 200,
          "_id": "65612b477a1d4243849ea3e1",
          "sold": 20,
          "id": "65612b477a1d4243849ea3e1"
      },
      {
          "branch": "6559c4abd057da4061a73efa",
          "price": 210,
          "available": true,
          "stock": "null",
          "priceAfterDiscount": 200,
          "_id": "65612b477a1d4243849ea3e1",
          "sold": 20,
          "id": "65612b477a1d4243849ea3e1"
      },
  ],
  "priceAfterDiscount": "null",
  "extras": [
      {
          "extra": "6559dbdfbb28e32618031673",
          "order": 2,
          "_id": "65612b477a1d4243849ea3e3",
          "id": "65612b477a1d4243849ea3e3"
      },
      {
          "extra": "6559dc1dbb28e32618031675",
          "order": 1,
          "_id": "65612b477a1d4243849ea3e4",
          "id": "65612b477a1d4243849ea3e4"
      }
  ],
  "descTableName": "اسم تالت جدول",
  "descTable": [
      {
          "name": "اول اسم",
          "value": "500جم",
          "order": 3,
          "_id": "65612b477a1d4243849ea3e5",
          "id": "65612b477a1d4243849ea3e5"
      },
      {
          "name": "تاني اسم",
          "value": "600جم",
          "order": 1,
          "_id": "65612b477a1d4243849ea3e6",
          "id": "65612b477a1d4243849ea3e6"
      },
      {
          "name": "تالت اسم",
          "value": "700جم",
          "order": 2,
          "_id": "65612b477a1d4243849ea3e7",
          "id": "65612b477a1d4243849ea3e7"
      }
  ],
  "images": [],
  "weight": "2 كيلو",
  "showWeight": false,
  "book": "book",
  "groupOfOptions": [
      {
          "optionGroup": "655b192a80168daa1159c8a6",
          "order": 1,
          "_id": "65612b477a1d4243849ea3e8",
          "id": "65612b477a1d4243849ea3e8"
      },
      {
          "optionGroup": "655b194580168daa1159c8a8",
          "order": 2,
          "_id": "65612b477a1d4243849ea3e9",
          "id": "65612b477a1d4243849ea3e9"
      }
  ],
  "minQty": 50,
  "dimensions": "100x90x50",
  "rewardPoint": "50",
  "sold": 0,
  // "imgCover": [],
  "createdAt": "2023-11-24T23:01:27.554Z",
  "updatedAt": "2024-06-27T13:22:42.569Z",
  "__v": 1,
  "deleted": false,
  "parentAvailable": true,
  "id": "65612b477a1d4243849ea3dd"
}
  

