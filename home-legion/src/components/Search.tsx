import React,{useState,useEffect} from 'react';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import titleImg from './title.jpg'
import Divider from '@mui/joy/Divider';
import {queryHouseData,getSingleHouseData,queryToken} from '../net/index'
import HouseCard, {houseData} from './Cards'
import AspectRatio from '@mui/joy/AspectRatio';
import CardContent from '@mui/joy/CardContent';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { useNavigate } from 'react-router-dom';
import {cardsLimit,setLimit,curHouse,setCurHouse,searchHouseData,setSearchHouseData} from '../vars/GlobalVars';
import { getCookie, setCookie } from 'typescript-cookie'
import RecentHome from './RecentHome';
export interface compContent{
  data:Array<houseData>,
  searchText:string,
  totalPage:number
}
function generatePagination(currentPage:number,totalPages:number) {
  const pagination = [];

  if (currentPage >= 1) {
      pagination.push("1");
  }
  if (currentPage > 3) {
    pagination.push("...");
  }

  if (currentPage > 2) {
      pagination.push((currentPage - 1).toString());
  }
  if(currentPage != 1 && currentPage != totalPages){
      pagination.push(currentPage.toString());
  }
  if (currentPage < totalPages - 1) {
    pagination.push((currentPage + 1).toString());
  }

  if (currentPage < totalPages - 2) {
      pagination.push("...");
  }

  if (currentPage <= totalPages && totalPages != 1) {
      pagination.push(totalPages.toString());
  }

  return pagination;
}

function Search() {
  // const [words,setWords] = useState<string>("");
  const [querydata,setQuerydata] = useState<compContent>({
    data:searchHouseData.data,
    searchText:searchHouseData.searchText,
    totalPage:searchHouseData.totalPage});
  const [page,setPage] = useState<number>(1);
  let nevigate=useNavigate();

  // const onSearch=()=>{
  //   querydata.searchText=words;
  //   setQuerydata(querydata)
  // }
  const startsWithNumber = (input: string): boolean =>{
      const regex = /^[0-9]/;
      return regex.test(input);
  }
  const handleSearch = ()=>{
      if(querydata.searchText.length===0) return;
      if(startsWithNumber(querydata.searchText)){
        singleHouseDetail()        
      }else{
        updateContent()
      }
  }
  const singleHouseDetail = async ()=>{
    try {
      const resp = await getSingleHouseData(querydata.searchText)
      if(Object.keys(resp.data).length === 0) alert("Address unavailable");
      const respData = resp.data;
      // console.log(respData)
      if(respData === undefined) return;
      const tempp:houseData= {img:respData.img,price:respData.price,link:respData.link,details:respData.details,address:respData.address};
      setCurHouse(tempp);
      setCookie("curHouse",JSON.stringify(tempp),{ expires: 7 })
      nevigate('/home');
    } catch (error) {
      alert('Requests fail!')
      console.error('Error fetching data:', error);
    }
  }
  const updateContent = async ()=>{
    try {
      const resp = await queryHouseData(querydata.searchText,page)
      const res = resp.data.items
      if(res === undefined ) return;
      // console.log(res);
      const totalpage = resp.data.pages
      const newdata:compContent={data:res,searchText:querydata.searchText,totalPage:totalpage}
      setSearchHouseData(newdata)
      setQuerydata(newdata)
    } catch (error) {
      alert('Requests fail!')
      console.error('Error fetching data:', error);
    }
  }
  useEffect(()=>{
    handleSearch()
    return ()=>{
    };
  },[page])
  useEffect(()=>{
    queryToken()
    return ()=>{
    };
  },[])
  return (
    <div className="Search">
      <Divider
      sx={(theme) => ({
        height: 50
        })}> </Divider>

      <Box sx={(theme) => ({
        height: 300,
        maxHeight: '30%',
        // width: 800,
        justifyContent: 'center',
        mx: 'auto',
        alignItems: 'center',})}>
          {/* <img width={'800'} height={'300'}
          src={titleImg}></img> */}
          <RecentHome />

      </Box>
      <Divider       sx={(theme) => ({
        height: 50
        })}> </Divider>
  <Grid container spacing={2} sx={{ flexGrow: 1,alignItems: 'center',justifyContent: 'center',margin: 'auto',}}>
  <Grid xs={2} />
  <Grid xs={6} >
  <Input placeholder="Seach city name or address"
  onChange={(e)=>{querydata.searchText = e.target.value}}></Input>
  </Grid>
  <Grid xs={2} sx={{ alignItems: 'center',justifyContent: 'center',margin: 'auto',}}>
  <Button onClick={handleSearch}>Find your home!</Button>
  </Grid>
  <Grid xs={2} />
  </Grid>
  <Divider       sx={(theme) => ({
        height: 50
        })}> </Divider>
   <Grid
    container
    spacing={{ xs: 2, md: 3 }}
    columns={{ xs: 4, sm: 8, md: 12 }}
    sx={{ flexGrow: 1 }}
  >
    {querydata.data.map((_, index) => (
      <Grid xs={2} sm={4} md={4} key={index}>
        <HouseCard {...querydata.data[index]}/>
      </Grid>
    ))}
  </Grid>
  <Box
        className="Pagination-mobile"
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          mx: 2,
          my: 1,
        }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
          onClick={()=>{if(page > 1){setPage(page - 1)}}}
        >
          <ArrowBackIosRoundedIcon />
        </IconButton>
        <Typography level="body-sm" mx="auto">
          Page {page} of {querydata.totalPage}
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
          onClick={()=>{if(page < querydata.totalPage){setPage(page + 1)}}}
        >
          <ArrowForwardIosRoundedIcon />
        </IconButton>
      </Box>
      <Box
        className="Pagination-laptopUp"
        sx={{
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
          mx: 4,
          my: 2,
        }}
      >
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          startDecorator={<ArrowBackIosRoundedIcon />}
          onClick={()=>{if(page > 1){setPage(page - 1)}}}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {generatePagination(page,querydata.totalPage).map((pageNum) => (
          <IconButton
            key={pageNum}
            size="sm"
            variant={Number(pageNum) != page ? 'plain' : 'soft'}
            color="neutral"
            onClick={()=>{if(Number(pageNum)){setPage(Number(pageNum))}}}
          >
            {pageNum}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="plain"
          color="neutral"
          endDecorator={<ArrowForwardIosRoundedIcon />}
          onClick={()=>{if(page < querydata.totalPage){setPage(page + 1)}}}
        >
          Next
        </Button>
      </Box>
  </div>
  );
}

export default Search;
