import {houseData} from '../components/Cards'
import {compContent} from '../components/Search'
export let cardsLimit:number = 5;
export function setLimit(newval:number){
    cardsLimit = newval
}
export let curHouse:houseData;
export function setCurHouse(newvar:houseData){
    curHouse = newvar
}
export let access_token:string;
export function setToken(tk:string){
    access_token = tk
}
export let searchHouseData:compContent={data:[],searchText:"",totalPage:1};
export function setSearchHouseData(hd:compContent){
    searchHouseData = hd;
}

