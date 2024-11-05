import {curHouse, setCurHouse} from '../vars/GlobalVars'
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Star from '@mui/icons-material/Star';
import TwoSidedLayout from '../components/TwoSidedLayout';
import React,{useState,useEffect,useRef} from 'react';
import Slider from '@mui/joy/Slider';
import Box from '@mui/joy/Box';
import MySlider,{SliderCallback} from './MySlider';
import {remodelParamsItf} from '../net/reqBody'
import {getCalResults} from '../net/index'
import Table from '@mui/joy/Table';
import { useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from 'typescript-cookie'
import { houseData } from './Cards';
import Container from '@mui/joy/Container';
import AspectRatio from '@mui/joy/AspectRatio';
import html2canvas from 'html2canvas';
import { Card } from '@mui/joy';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

class remodelParams implements remodelParamsItf{
   Forecast:number =3200000 ;//此为输入参数, 1000000000-0
   Asking:number = 1850000 ;//此为输入参数 1000000000-0
   PermitCost:number = 7000 ;//此为输入参数 5000000-0
   DesginCost:number = 18000 ;//此为输入参数 5000000-0
   OtherCost:number = 0 ;//此为输入参数 1000000000-0
   AcqLoanRate:number = 0.8 ;//此为输入参数 1-0
   AcqLoanInterestRate:number = 0.10 ;//此为输入参数 1-0
   DesignPermitMonth:number = 7 ;//此为输入参数 500-0
   ConstructionMonth:number = 5 ;//此为输入参数 500-0
   ConsLoanRate:number = 1.00 ;//此为输入参数 1-0
   ConsLoanInterest:number = 0.10 ;//此为输入参数 1-0
   AcqPoint:number = 0.025 ;//此为输入参数 1-0
   ConsPoint:number = 0.025 ;//此为输入参数 1-0
   remodel:number = 300000 ;//此为输入参数 1000000000-0
   static ranngeMap:Map<string,Array<number>> = new Map<string, Array<number>>([
    ["Forecast", [0,100000000,0.000001]],
    ["Asking", [0,100000000,0.000001]],
    ["remodel", [0,100000000,0.000001]],
    ["OtherCost", [0,10000000,0.00001]],
    ["PermitCost", [0,5000000,0.00002]],
    ["DesginCost", [0,5000000,0.00002]],
    ["DesignPermitMonth", [0,500,0.2]],
    ["ConstructionMonth", [0,500,0.2]],
  ]);
  static paramMultiplier= (valName:string)=>{
    if(remodelParams.ranngeMap.has(valName)){
      let objVal = remodelParams.ranngeMap.get(valName)?.at(2);
      if(objVal!==undefined)
        return objVal===undefined?100:objVal;
      else return 100
    }
    else return 100;
  }
  constructor(asking: number) {
    this.Asking = asking;
  }
  // static paramMax = (valName:string)=>{
  //   if(remodelParams.ranngeMap.has(valName)){
  //     return remodelParams.ranngeMap.get(valName)?.at(1);
  //   }
  //   else return 1;
  // }
}

class remodelOutputs{
  TotalCost:number = 0;
  TotalInterest:number = 0;
  GrossProfit:number = 0;
  NetProfit:number = 0;
  ROI:number = 0;
  IRR:number = 0;
}

class outputsHistory extends remodelOutputs{
  Forecast:number =3200000 ;//此为输入参数, 1000000000-0
  Asking:number = 1850000 ;//此为输入参数 1000000000-0
  PermitCost:number = 7000 ;//此为输入参数 5000000-0
  DesginCost:number = 18000 ;//此为输入参数 5000000-0
  OtherCost:number = 0 ;//此为输入参数 1000000000-0
  DesignPermitMonth:number = 7 ;//此为输入参数 500-0
  ConstructionMonth:number = 5 ;//此为输入参数 500-0
  remodel:number = 300000 ;//此为输入参数 1000000000-0
  HistoryKey:number = 0;
}
export default function HomeDetails() {
  if(curHouse===undefined){
    const cookie = getCookie("curHouse")
    if(cookie){
      const curHouseFromCookie:houseData = JSON.parse(cookie);
      setCurHouse(curHouseFromCookie)
    }
  }
  const priceNumber:number = Number(curHouse?.price.replace(/[^0-9.-]/g, ''));
  const [pageState,setPageState] = useState<number>(0);
  const [inputs,setInputs] = useState<remodelParams>(new remodelParams(priceNumber));
  // const [outputs,setOutputs] = useState<remodelOutputs>(new remodelOutputs());
  const [history,setHistory] = useState<Array<outputsHistory>>([]);
  const [historyCount,setHistoryCount] = useState<number>(0);
  let nevigate=useNavigate();
  const updateContent = async ()=>{
    const resp = await getCalResults(inputs);
    const data = resp.data;
    const newOutputs:remodelOutputs = {TotalCost:data.TotalCost,
      TotalInterest:data.TotalInterest,
      GrossProfit:data.GrossProfit,
      NetProfit:data.NetProfit,
      ROI:data.ROI,
      IRR:data.IRR
    };
    setHistoryCount(historyCount+1);
    const oneHistory:outputsHistory = {...newOutputs,
      Forecast:inputs.Forecast,
      Asking:inputs.Asking,
      PermitCost:inputs.PermitCost,
      DesginCost:inputs.DesginCost,
      OtherCost:inputs.OtherCost,
      DesignPermitMonth:inputs.DesignPermitMonth,
      ConstructionMonth:inputs.ConstructionMonth,
      remodel:inputs.remodel,
      HistoryKey:historyCount
    };
    let oldHis = history;
    oldHis.push(oneHistory);
    // setOutputs(newOutputs);
    setHistory(oldHis);
    setPageState(2);
    // console.log(outputs);
  }
  const updateInputs:SliderCallback = (name:string,value: number) => {
    const pname = name as (keyof typeof inputs);
    inputs[pname] = value;
    // console.log(inputs);
  }
  const fixNum = (numValue:number) => {
    if(numValue===undefined) return 0;
    const numabs = Math.abs(numValue)
    if(numabs) return Math.round(numValue);
    else if(numabs) return numValue.toFixed(2);
    else return numValue.toFixed(3);
  }
  const fixNum2 = (numValue:number) => {
    if(numValue===undefined) return 0;
    const numabs = Math.abs(numValue)
    if (numabs >= 1e6) {
      return (numValue / 1e6).toFixed(2).replace(/\.0+$/, '') + 'M';
    } else if (numabs >= 1e5) {
      return (numValue / 1e3).toFixed(0).replace(/\.0+$/, '') + 'k';
    } else if (numabs >= 1e4) {
      return (numValue / 1e3).toFixed(1).replace(/\.0+$/, '') + 'k';
    } else if (numabs >= 1e3) {
      return (numValue / 1e3).toFixed(2).replace(/\.0+$/, '') + 'k';
    }else if(numabs>100) return Math.round(numValue);
    else if(numabs>1) return numValue.toFixed(1);
    else return numValue.toFixed(2);
  }
  const addSpace = (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  const tableRef = useRef<HTMLTableElement>(null);
  const saveImage = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'table-image.png';
        link.click();
      });
    }
  };
  const deleteOneHistory = (deletekey:number) => {
    const newhistory = history.filter(element=>element.HistoryKey!=deletekey);
    setHistory(newhistory);
  }

  return (<div>
    <TwoSidedLayout {...{imgsrc:curHouse.img}}>
      <Typography
        level="h2"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
        key={"address"}
      >
        {curHouse.address} - {curHouse.price}
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg" key={"details"}>
        {curHouse.details}
      </Typography>
      <Button onClick={()=>{if(pageState===0){setPageState(1);}}} size="lg">Start Remodeling</Button>
      {pageState>0?Object.keys(inputs).map((paramName:string,index)=>{
          const pname = paramName as (keyof typeof inputs)
          return <MySlider {...{name:paramName,
            // min:remodelParams.paramMin(paramName),
            defaultVal:inputs[pname],
            mult:remodelParams.paramMultiplier(paramName),
            setFunction:updateInputs}} key={'slider'+index}/>
      }):<div/>}      


      {/* <Typography
        fontSize="xl"
        fontWeight="md"
        endDecorator={
          <React.Fragment>
            <Star sx={{ color: 'warning.300' }} />
            <Star sx={{ color: 'warning.300' }} />
            <Star sx={{ color: 'warning.300' }} />
            <Star sx={{ color: 'warning.300' }} />
            <Star sx={{ color: 'warning.300' }} />
          </React.Fragment>
        }
        sx={{ mt: 3 }}
      >
        5.0
      </Typography> */}
      {/* <Typography textColor="text.secondary">

        
      </Typography> */}
      {/* <Typography
        startDecorator={<Avatar component="span" size="lg" variant="outlined" />}
        sx={{ '--Typography-gap': '12px' }}
      >
        <b>John Seed</b>, Apple Inc.
      </Typography> */}
      {/* <Typography
        level="body-xs"
        sx={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {curHouse.address}
      </Typography> */}
    </TwoSidedLayout>
    <Container
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1rem',
          // maxWidth: '150ch',
          textAlign: 'center',
          py: 2,
          flexShrink: 999,
          [theme.breakpoints.up(834)]: {
            minWidth: 420,
            alignItems: 'flex-start',
            textAlign: 'initial',
          },
        })}
    >
    {pageState==1?(
    <Button onClick={updateContent} size="lg">Show results</Button>
    ):<div/>}    
    {pageState>1?(<div>
      <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center',})}>
      <Button onClick={updateContent} size="lg">Evaluate new settings</Button>
      <Button onClick={saveImage} size="lg">Save results as image</Button>
      </Box>
    {/* <Container
      sx={(theme) => ({
        position: 'relative',
        // minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        py: 4,
        gap: 1,
        [theme.breakpoints.up(834)]: {
          flexDirection: 'row',
          gap: 2,
        },
        // [theme.breakpoints.up(1199)]: {
        //   gap: 12,
        // },
      })}
      
    >    */}
    <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '2rem',
          py: 4,
          // maxWidth: '20ch',
          textAlign: 'initial',
          // width: '30%',
          flexShrink: 999,
          // [theme.breakpoints.up(834)]: {
          //   minWidth: 280,
          //   alignItems: 'flex-start',
          //   textAlign: 'initial',
          // },
        })}
        ref={tableRef}
  
    >

      {history.map( (_ , index)=>{
          return <Card key={"card"+index}>
            <Typography level="h4">Result {index+1}</Typography>
            <IconButton
          aria-label="bookmark Bahamas Islands"
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
          onClick={()=>{deleteOneHistory(history[index].HistoryKey)}}
        ><RemoveCircleIcon color="error"/></IconButton>
      <CardContent orientation="horizontal" >
      <CardContent orientation="vertical">
      {Object.keys(history[0]).map((paramName:string,index)=>{
          if(paramName==='HistoryKey') return;
          // const pname = paramName as (keyof typeof history)          
          return <Typography noWrap={true} key={"param "+paramName}>
            {addSpace(paramName)}
          </Typography>
      })}
      </CardContent>
      <CardContent orientation="vertical">      
          {Object.keys(history[index]).map((paramName:string,_)=>{
              if(paramName==='HistoryKey') return;
              const pname = paramName as (keyof typeof history[0])
              return <Typography noWrap={false} key={"value "+paramName}>
                {fixNum(history[index][pname])}
                {/* {"\n"}
                {index!==(history.length-1) && history[(history.length-1)][pname]!==0?
                Math.round(history[index][pname]*100/history[(history.length-1)][pname])+'%':''} */}
                </Typography>
          })}
      </CardContent>
      </CardContent>
      </Card>
      })}

    </Box> 
    {/* {history.length>0?(
    <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '150ch',
          textAlign: 'center',
          flexShrink: 1499,
          [theme.breakpoints.up(834)]: {
            minWidth: 820,
            alignItems: 'flex-start',
            textAlign: 'initial',
          },
        })}
    >
      <Table aria-label="basic table" ref={tableRef}>
      <tbody>
        <tr>
        {Object.keys(history[0]).map((paramName:string,index)=>{
          if(paramName==='HistoryKey') return;
          // const pname = paramName as (keyof typeof history)          
          return <th style={{ height: '100px',whiteSpace: "normal",
            wordWrap: "break-word"}} key={"th"+paramName}> 
          <Typography noWrap={false} >
            {addSpace(paramName)}
          </Typography></th>
      })}
        </tr>
        {history.map( (_ , index)=>{
          return <tr key={"tr"+index}>
          {Object.keys(history[index]).map((paramName:string,_)=>{
              if(paramName==='HistoryKey') return;
              const pname = paramName as (keyof typeof history[0])
              return <td key={"td"+index+pname}>
                <Typography noWrap={false} >
                {fixNum2(history[index][pname])}{"\n"}
                {index!==(history.length-1) && history[(history.length-1)][pname]!==0?
                Math.round(history[index][pname]*100/history[(history.length-1)][pname])+'%':''}
                </Typography>
              </td>
          })}
          </tr>
        }
        )}
      </tbody>
      </Table>
      <Button onClick={saveImage} size="lg">Save as image</Button>
    </Box>)
    :<div></div>} */}
      {/* </Container> */}
      </div>):<div/>}
      <Button onClick={()=>{nevigate('/');}} size="lg">Back to Search Result</Button>
      </Container>
    </div>
  );
}