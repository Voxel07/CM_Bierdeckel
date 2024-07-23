import React from "react";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FaceIcon from '@mui/icons-material/Face';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import "./StateItem.css"

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const StateItem = ({data, next, previous, pHandleSetSelectedITems}) => {
  const{id, userId, description, extraItems, product} = data;
  console.log(extraItems);
  return (
    <Card key={product.id} sx={{ minWidth: 250, marginTop:1, padding:1, borderRadius:1, background:"#083036" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip icon={<FaceIcon />}  size="small" label={userId} variant="outlined" color="primary" sx={{minWidth: 50}}/>
          <Typography variant="h5" component="div" gutterBottom>
              {product.name}
          </Typography >
          </Stack>

        </Stack>
          <Stack direction="row"  alignItems="center" spacing={1}  useFlexGap  sx={{ maxHeight: '200px', overflowY: 'auto', padding:0.25 }}> 
          {
              extraItems?.length? extraItems.map((extra)=>(
                  <Chip key={Math.random()} color="primary" label={extra.extras.name} size="small" />
              )):null
          }
          </Stack>
        <Stack direction="row"  justifyContent="space-between" spacing={1} >
          <IconButton aria-label="delete" size="small" onClick={() => previous(data)}>
            <ArrowBackIcon fontSize="inherit" />
          </IconButton>
            <Checkbox {...label} checked={data.selected || false} color="success" onChange={() => pHandleSetSelectedITems(data)} />
          <IconButton aria-label="delete" size="small" onClick={() => next(data)}>
            <ArrowForwardIcon fontSize="inherit" />
          </IconButton>
       
        </Stack>
     
    </Card>
  );
}

export default StateItem