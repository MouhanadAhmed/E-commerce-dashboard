import {ID, Response} from '../../../../../../_metronic/helpers'
export type User = {
  id?: ID
  name?: string
  profilePic?: string
  phone?: string,
  email?: string
  position?: string
  role?: string
  lastLogin?: string
  two_steps?: boolean
  joined_day?: string
  online?: boolean
  initials?: {
    label: string
    state: string
  }
  createdAt?:string
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  profilePic: 'avatars/300-6.jpg',
  position: 'Art Director',
  role: 'Administrator',
  name: '',
  email: '',
}
