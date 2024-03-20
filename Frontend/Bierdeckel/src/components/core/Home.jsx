import React from "react";
import { Skeleton, Box } from "@mui/material";
import Typography from '@mui/material/Typography';

function Home()
{
    return(
        <Box sx={{textAlign:"center", color:"red"}}>
            <Skeleton />
            <Skeleton animation={false} />
            <Skeleton animation="wave" />
            <Typography>
                Hier könte ihre Webrung stehen
            </Typography>
        </Box>
    )
}

export default Home