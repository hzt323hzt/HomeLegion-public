import React,{useState,useEffect} from 'react';
import Card from '@mui/joy/Card';
import {cardsLimit,setLimit,curHouse,setCurHouse} from '../vars/GlobalVars';
import Grid from '@mui/joy/Grid';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import {addRecentHouses, queryHouseData} from '../net/index'
import { useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from 'typescript-cookie'
import { getRecentHouses } from '../net/index';
export interface houseData{
  img:string,
  price:string,
  link:string,
  address:string,
  details:string
}

function HouseCard(props:houseData){
  // const [data,setData] = useState<compContent>({searchText:props.searchText});
  let nevigate=useNavigate();
  useEffect(()=>{
    return ()=>{
    };
  },[])
  const ToHomeDetail=()=>{
    setCurHouse(props)
    setCookie("curHouse",JSON.stringify(props),{ expires: 7 })
    // console.log(getCookie("curHouse"))
    nevigate('/home')
    addToRecent()
  }  
  const addToRecent = async ()=>{
    const resp = await addRecentHouses(props)
  }  
  return (<div>
      <Card sx={{ width: 320 }}>
      <div>
        <Typography level="title-lg">{props.address}</Typography>
        <Typography level="body-sm">{props.details}</Typography>
        <IconButton
          aria-label="bookmark Bahamas Islands"
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
        >
        </IconButton>
      </div>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={props.img}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Total price:</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            {props.price}
          </Typography>
        </div>
        <Button
          onClick={ToHomeDetail}
          variant="solid"
          size="md"
          color="primary"
          aria-label="Explore Bahamas Islands"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
        >
          Explore
        </Button>
      </CardContent>
    </Card>
    </div>);
}
export default HouseCard;