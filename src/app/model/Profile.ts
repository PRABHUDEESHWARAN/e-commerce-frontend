import { Address } from "./Address";

export interface Profile {
    userId:number;
    customerId:number;
    cartId:number;
    firstName: string;
    lastName: string;
    username: string;
    role:string;
    email: string;
    mobileNo: number;
    address:Address[];
  }


   //get user details as profile {userId,firstname,lastname,username,role,mobile,email,customerId,address,cartid}
  