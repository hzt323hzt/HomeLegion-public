import {del, get, post, put,fetchAccessToken} from "./http";
import {remodelParamsItf} from './reqBody'
import { houseData } from "../components/Cards";
export function queryToken(){
    fetchAccessToken();
}

export function queryHouseData(pos?:string,page?:number) {
    return get('/'+pos+'/'+page)
}
export function getCalResults(data:remodelParamsItf) {
    return post('/cal-results', {},data)
}
export function getSingleHouseData(data:string) {
    return post('/house-with-address', {},data)
}
export function updateAddress(userId?:number, address?:string) {
    return get('/user/update_address', { 'user_id': userId, "address": address })
}

export function getRecentHouses() {
    return get('/recent-houses', {})
}

export function addRecentHouses(data:houseData) {
    return post('/add-recent-houses', {},data)
}
