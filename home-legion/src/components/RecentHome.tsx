import React,{useState,useEffect} from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import {houseData} from './Cards'
import {getRecentHouses} from '../net/index'
import Link from '@mui/joy/Link';
import { useNavigate } from 'react-router-dom';
import { setCookie } from 'typescript-cookie'
import {setCurHouse} from '../vars/GlobalVars';

function OverflowCard(house:houseData,nevigate:any) {
  const ToHomeDetail=()=>{
    setCurHouse(house)
    setCookie("curHouse",JSON.stringify(house),{ expires: 7 })
    // console.log(getCookie("curHouse"))
    nevigate('/home')
  }  
  return (
    <Card variant="outlined" sx={{ width: 250 }} key={house.address}>
      <CardOverflow>
        <AspectRatio ratio="2.5">
          <img
            src={house.img}
            // srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318&dpr=2 2x"
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Link level="title-md" textColor="black" component="button" textAlign="left" onClick={ToHomeDetail}>
        {house.address}</Link>
        <Typography level="body-sm">{house.price}</Typography>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal">
          <Typography level="body-xs" fontWeight="md" textColor="text.secondary">
            6.3k views
          </Typography>
          <Divider orientation="vertical" />
          <Typography level="body-xs" fontWeight="md" textColor="text.secondary">
            1 hour ago
          </Typography>
        </CardContent>
      </CardOverflow>
    </Card>
  );
};

export default function RecentHome(){
    const [querydata,setQuerydata] = useState<Array<houseData>>([]);
    const updateContent = async ()=>{
      const resp = await getRecentHouses()
      const res = resp.data
      if(res === undefined ) return;
      // console.log(res);
      setQuerydata(res);
    }
    let nevigate=useNavigate();

    useEffect(()=>{
        updateContent()
        return ()=>{
        };
      },[])
    return (< div>
        <Box
      display="flex"
      alignItems="center"
      mx = {12}
    >
    <Typography level="title-lg" fontWeight="md" textColor="text.secondary" >
            People also search for
    </Typography>
    {/* <Divider
      sx={(theme) => ({
        height: 10
    })}> </Divider> */}
        </Box>
    <Box
      // my={4}
      display="flex"
      alignItems="center"
      gap={10}
      p={2}
      mx = {10}
      sx={{ width: '100%' }}
    >
    {querydata.map((_ , index)=>{return OverflowCard(querydata[index],nevigate)})}
    </Box>
    
    </div>);
}