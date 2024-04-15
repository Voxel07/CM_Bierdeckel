import React from 'react';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import { Box, Container } from '@mui/system';

function Footer() {
    return (
      <Container  sx={{position: "fixed", textAlign:"center", bottom: 0, left: "50%", transform: "translateX(-50%)",}}>
        <Typography variant="body2" color="text.secondary">
          © 2024 CracyMonkeys eV. All rights reserved.
        </Typography>
        <ButtonGroup color="primary" disabled={false} orientation="horizontal" size="small" variant="text">
            <IconButton aria-label='Instagram'  href="https://www.youtube.com">
                <InstagramIcon/>
            </IconButton>
            <IconButton aria-label='WhatsApp'>
                <WhatsAppIcon/>
            </IconButton>
        </ButtonGroup >
        {/* Add more links or social media icons as needed */}
      </Container >
    );
  }
  
  export default Footer;
  