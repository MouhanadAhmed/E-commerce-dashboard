import { ID, Response } from "../../../../../../../../_metronic/helpers"

export type Categories = [{
  _id?: ID
  name?: string
  slug?: string
  description?: string
  imgCover?: string
  order?: number
  branch?:[{
    branch: ID,
    available: boolean,
    order: number
  }]
  available: boolean,
  createdAt?: Date
  updatedAt?: Date

}]

export type CategoriesQueryResponse = Response<Array<Categories>>

// export const initialCategory: Categories = {
//   imgCover: 'avatars/300-6.jpg',
//   available: true,
//   name: '',
// }
