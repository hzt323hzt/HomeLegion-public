import Slider from '@mui/joy/Slider';
import Box from '@mui/joy/Box';
import React,{useState,useEffect} from 'react';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';

export type SliderCallback = (name:string,value: number)  => void;
export default function MySlider({
    name,
    // min,
    defaultVal,
    mult,
    setFunction
  }: React.PropsWithChildren<{ name:string, defaultVal:number, mult:number, setFunction:SliderCallback }>) {
    const [val,setVal] = useState<number>(defaultVal);
    const SliderChange = (event: React.SyntheticEvent | Event,value: number | Array<number>)  => {
        if( typeof value == 'number'){            
            setVal(value/mult/10);
        }
    }
    useEffect(()=>{
      setFunction(name,val);
      return ()=>{
      };
    },[val])
    const fixNum = (numValue:number) => {
        return numValue>1 || numValue == 0?Math.round(numValue):numValue.toFixed(3)
    }
    const addSpace = (str: string): string => {
      return str.replace(/([a-z])([A-Z])/g, '$1 $2');
    }
    const getVal = () =>{
      return val*mult*10;
    }
    return (
    <Box sx={{ width: '100%' }}>
    <Stack direction="row" spacing={2} >
        <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg" width={300} noWrap={false}>
            {addSpace(name)}
        </Typography>
        <Slider
        // aria-label="Custom marks"
        defaultValue={defaultVal*mult*10}
        //valueLabelFormat getAriaLabel
        valueLabelFormat={(value:number)=>{return `${(fixNum(value/mult/10))}`;}}
        valueLabelDisplay="auto"
        min={0}
        max={1000}
        // value={getVal()}
        onChangeCommitted={SliderChange}
      />
        {/* <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg" width = {100}>
            {fixNum(val)}
        </Typography> */}
        <Box width={120}>
        <Input
        value={fixNum(val)}
        type="number"
        onChange={(event) => setVal(Number(event.target.value))}
        fullWidth={true}
        slotProps={{
            input: {
              min: 0,
              max: 100/mult,
              step: 1/mult,
            },
          }}
        />
        </Box>
    </Stack>
    </Box>
    );
}