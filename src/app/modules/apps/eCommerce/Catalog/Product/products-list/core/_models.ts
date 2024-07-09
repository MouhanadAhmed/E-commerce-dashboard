import { Response } from "../../../../../../../../_metronic/helpers"

export type Product = {
  imgCover?: [string]
  _id?: string
  name?: string
  slug?: string
  description?: string
  shortDesc?: string
  metaTags?: [string] | [ ]
  category?: [category]| [ ]
  subCategory?: [subCategory]| [ ]
  childSubCategory?: [childSubCategory]| [ ],
  types?:string []| [ ],
  stock?:string,
  price?:string,
  order?: string
  branch?:
    {
      _id?: string
    branch: string,
    available?: boolean,
    order?: string,
    price?: string,
    stock?:string,
    priceAfterDiscount?: string,
    sold?:string,
    id?:string,
    name?:string
  }[]| [ ],
  priceAfterDiscount?:string,
  extras?:{
    _id?: string,
    id?: string,
    extra?:string,
    order?:string
  }[]| [ ],
  descTableName?:string,
  descTable?:{
    _id?: string,
    id?: string,
    name?:string,
    value?:string,
    order?:string
  }[]| [ ],
  images?:string[]| [ ],
  weight?:string,
  showWeight?:boolean,
  book?:string,
  groupOfOptions?:{
    _id?: string,
    id?: string,
    order?:string,
    optionGroup?:string
  }[]| [ ],
  minQty?:string,
  quantity?:string,
  dimensions?:string,
  rewardPoint?:string,
  sold?:string,
  available?: boolean,
  createdAt?: string
  updatedAt?: string
  deleted?:boolean,
  parentAvailable?:boolean,
  __v?:string
  id?:string
}

export type Products = {
  name?: string,
  _id?: string,
  category?:[{
    order?:string,
    id?:string|null
  }],
  id?:string|null
}

type category = 
  {
      category?: string ,
      order?: string,
      _id?: string,
      id?: string
  }
type subCategory = 
  {
    subCategory?: string ,
      order?: string,
      _id?: string,
      id?: string
  }
type childSubCategory = 
  {
    childSubCategory?: string ,
      order?: string,
      _id?: string,
      id?: string
  }


export type ProductsQueryResponse = Response<Array<Product>>

export const initialProduct: Product =  
{
  "name": "",
  // "slug": "تالت-منتح",
  "description": '',
  "shortDesc": '',

  "stock": "null",
  "available": true,
  "price": '',

  "priceAfterDiscount": "",

  "descTableName": '',

  "weight": '',
  "showWeight": false,
  "book": "",

  "minQty": '',
  "dimensions": "",
  "rewardPoint": "",
  "sold": '',
  // "imgCover": [],
  // "createdAt": "",
  // "updatedAt": "",
  // "__v": '',
  "deleted": false,
  "parentAvailable": true,
  // "id": "",

}
  

