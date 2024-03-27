import { Address } from "./address.interface";

export interface UserAddress extends Address {
  id: string
  userId: string
}