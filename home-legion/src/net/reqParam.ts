
export interface ReqParam {

}


export interface AdminSearchParam extends ReqParam {
    category_id: Array<number> | number,
    keyword: string,
    brands?: Array<string>,
    price_low: number,
    price_high: number,
    sort_type: number,
    page: number
}

export interface Userinfo extends ReqParam{
    category_id: Array<number> | number,
    keyword: string,
    brands: Array<string>,
    price_low: number,
    price_high: number,
    sort_type: number,
    page: number
}