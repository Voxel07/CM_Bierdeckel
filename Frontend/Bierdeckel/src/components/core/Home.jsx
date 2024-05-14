import React from "react";
import { Skeleton, Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
function Home()
{
    return(
        <Box sx={{  display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexFlow: 'column'}}>

            <Typography sx={{textAlign:"center", color:"#A64913", fontSize:"3em", marginBottom:"1em", marginTop:"1em"}}>
                Willkommen bei den Cracy Monkeys
            </Typography>
            <Card sx={{ maxWidth: 1000, backgroundColor: '#090c11' }}>
            <CardMedia
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              component="img"
              height="1000"
              image="/src/assets/img/cmlogo.png"
              alt="Logog des CracyMonkeys AC EV"
            />
            </Card>
        </Box>
    )
}

export default Home