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

const StateItem = ({data, next, previous}) => {
  const{id, user, description, extras} = data;
  return (
    <Card sx={{ minWidth: 250, marginTop:1, padding:1, borderRadius:1, background:"#cccccc" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip icon={<FaceIcon />}  size="small" label={user} variant="outlined" color="primary" sx={{minWidth: 50}}/>
          <Typography variant="h5" component="div" gutterBottom>
              {description}
          </Typography >
          </Stack>

          <Stack direction="row"  alignItems="center" spacing={1}  useFlexGap  sx={{ maxHeight: '200px', overflowY: 'auto', padding:0.25 }}> 
          {
              extras.map((extra)=>(
                  <Chip color="primary" label={extra} size="small" />
              ))
          }
          </Stack>
        </Stack>
        <Stack direction="row"  justifyContent="space-between" spacing={1} >
          <IconButton aria-label="delete" size="small" onClick={() => previous(data)}>
            <ArrowBackIcon fontSize="inherit" />
          </IconButton>
            <Checkbox {...label} defaultChecked color="success" />
          <IconButton aria-label="delete" size="small" onClick={() => next(data)}>
            <ArrowForwardIcon fontSize="inherit" />
          </IconButton>
       
        </Stack>
     
    </Card>
  );
}

export default StateItem