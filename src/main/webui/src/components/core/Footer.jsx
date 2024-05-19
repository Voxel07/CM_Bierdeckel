import React from 'react';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import { Box, Container } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material';

const theme2 = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            color: '#a64913',
          },
          '&:hover': {
            '& .MuiSvgIcon-root': {
              color: '#1998a1',
            },
          },
        },
      },
    },
  }
  });
function Footer() {
    return (
      <ThemeProvider theme={theme2}>
      <Container  sx={{position: "fixed", textAlign:"center", bottom: 0, left: "50%", transform: "translateX(-50%)",}}>
        <ButtonGroup color="secondary" disabled={false} orientation="horizontal" size="small" variant="text">
            <IconButton aria-label='Instagram'  href="https://www.instagram.com/crazymonkeysace.v/">
                <InstagramIcon/>
            </IconButton>
            <IconButton aria-label='WhatsApp' href='https://discord.gg/CaVKszgxj5'>
                <WhatsAppIcon/>
            </IconButton>
            <IconButton aria-label='YouTube' href='https://www.youtube.com/@CrazyMonkeysACe.V.'>
                <YouTubeIcon/>
            </IconButton>
        </ButtonGroup >
        <Typography variant="body2" color="#a64913">
          © 2024 CracyMonkeys eV. All rights reserved.
        </Typography>
        {/* Add more links or social media icons as needed */}
      </Container >
      </ThemeProvider>
    );
  }
  
  export default Footer;
  