import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import Typography  from '@mui/material/Typography';

export function App(props) {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <Paper variant="outlined" sx={{ width: 200 }}>
        <Typography>Hallo</Typography >
          <List sx={{ width: '100%', maxWidth: 360}} dense={false}>
            <ListItem sx={{ margin: '8px 0', backgroundColor: 'gray'  }}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Photos" secondary="Jan 9, 2014" />
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid item>
        <Paper variant="outlined" sx={{ width: 200 }}>
                    <List sx={{ width: '100%', maxWidth: 360}} dense={false}>
            <ListItem sx={{ margin: '8px 0', backgroundColor: 'gray'  }}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Photos" secondary="Jan 9, 2014" />
            </ListItem>
            <ListItem sx={{  margin: '8px 0', backgroundColor: 'red'  }}>
              <ListItemAvatar>
                <Avatar>
                  <WorkIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Work" secondary="Jan 7, 2014" />
            </ListItem>
            
          </List>
        </Paper>
      </Grid>
      <Grid item>
        <Paper variant="outlined" sx={{ width: 200 }}>
          asd
        </Paper>
      </Grid>
    </Grid>
  );
}
