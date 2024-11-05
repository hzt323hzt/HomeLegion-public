import React from 'react'
import Box from '@mui/joy/Box';
import Search from '../../components/Search'
import HomeDetails from '../../components/HomeDetails';
import Cards from '../../components/Cards'
import JoySignInSideTemplate from '../../components/JoySignInSideTemplate'
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import Divider from '@mui/joy/Divider';
import {Route,Routes,BrowserRouter} from 'react-router-dom'
function Homepage(){
    return (<div>
    <Box
        component="main"
        sx={{
          my: 'auto',
          margin: 'auto',
          justifyContent: 'center',
          mx: 'auto',
          alignItems: 'center',
          borderRadius: 'sm',
          '& form': {
            display: 'flex',
            flexDirection: 'column',
          },
          [`& .${formLabelClasses.asterisk}`]: {
            visibility: 'hidden',
          },
        }}
      >
    <BrowserRouter>
    <Routes>
      <Route path={'/'} element={<Search/>}></Route>
      <Route path={'/home'} element={<HomeDetails/>}></Route>
    </Routes>  
    </BrowserRouter>
    </Box>
    </div>);
}
export default Homepage