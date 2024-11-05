import {Goods, ReqBody} from "./reqBody";


export interface Resp {
    code: number,
    msg: string,
    data: RespContent

}

export interface RespContent {

}



export interface GoodsInfoBySearch {
    goods_list: Goods[],
    brand_list: string[],
    price_range: [number, number],
    goods_total: number
}


export interface LoginedUserInfo extends RespContent{
    id: number,
    name: string,
    type: number,
    token: string
}

export interface GoodsPicInfo extends RespContent, ReqBody{
    url: string,
    uid?: string,
    name?: string
}














