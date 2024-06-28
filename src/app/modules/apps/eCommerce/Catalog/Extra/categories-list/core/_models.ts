import { Response } from "../../../../../../../../_metronic/helpers"

export type Extras = {
  imgCover?: string
  _id?: string
  name?: string
  slug?: string
  description?: string
  order?: number
  // branch?:[
  //   {
  //     _id?: string
  //   branch: string,
  //   available: boolean,
  //   order: number
  // }
  // ]
  available?: boolean,
  createdAt?: string
  updatedAt?: string
  deleted?:boolean,
  __v?:number,
  price?:number,
  stock?:string,
  qty?:number,
  sold?:number,
  id?:string,
  priceAfterDiscount?:number,
  priceAfterExpirest?:string,
}



export type ExtrasQueryResponse = Response<Array<Extras>>

export const initialCategory: Extras =  
      {
        "deleted": false,
        "_id": "6559dbdfbb28e32618031673",
        "name": "شمع",
        "slug": "شمع",
        "price": 120,
        "available": true,
        "stock": "50",
        "qty": 50,
        "sold": 0,
        "createdAt": "2023-11-19T09:56:47.319Z",
        "updatedAt": "2023-11-19T17:09:41.705Z",
        "__v": 0,
        "order": 1,
        "id": "6559dbdfbb28e32618031673"
      }
  

