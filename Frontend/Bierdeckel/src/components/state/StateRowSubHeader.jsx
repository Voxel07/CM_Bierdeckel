import Stack from '@mui/material/Stack';
import Typography  from '@mui/material/Typography';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import {Paper, Grid, Divider, Chip } from "@mui/material";


export default function StateRowSubHeader ({state, color, number})
{
    return(
        <Paper sx={{background:"#cccccc", marginBottom:1}}>
            <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-around" sx={{color:"#05152f"}}>
                <Chip color="primary" label={number} size="small" />
                <Typography>Ausgewählt</Typography>
                <IconButton aria-label="user">
                    <SettingsIcon />
                </IconButton>
            </Stack>
            <Divider/>
        </Paper>

    )
}