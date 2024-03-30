import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import StateItem from '../components/state/StateItem';
import StateRowHeader from "../components/state/StateRowHeader";
import StateRowSubHeader from "../components/state/StateRowSubHeader";

import "../components/state/state.css"

function State() {
  const titles = ["Ordered", "Processing", "Done"];
  const [processing, setProcessing] = useState([]);
  const [done, setDone] = useState([]);
  const [ordered, setOrdered ] = useState([
    { id: 1, state:"ordered", user: 7, description: "Rote", extras: ["scharf", "senf", "gorß", "eis", "grün", "penis"] },
    { id: 2, state:"ordered", user: 14, description: "Bratwurst", extras: ["scharf", "curry"] },
    { id: 3, state:"ordered", user: 14, description: "Bratwurst", extras: ["scharf", "curry"] },
    { id: 4, state:"ordered", user: 14, description: "Bratwurst", extras: ["scharf", "curry"] },
    { id: 5, state:"ordered", user: 7, description: "Bratwurst", extras: ["scharf", "curry"] },
    { id: 6, state:"ordered", user: 14, description: "Bratwurst", extras: ["scharf", "curry"] },
    { id: 7, state:"ordered", user: 14, description: "Bratwurst", extras: ["scharf", "curry"] },
    { id: 8, state:"ordered", user: 14, description: "Bratwurst", extras: ["scharf", "curry"] },
    { id: 9, state:"ordered", user: 14, description: "Bratwurst", extras: ["scharf", "curry"] },
    { id: 10, state:"ordered", user: 21, description: "Krakauer", extras: ["scharf"] },
    { id: 11, state:"ordered", user: 21, description: "Krakauer", extras:[] }
  ])
  
  const handleNext = (item) => {
    switch (item.state) { // Assuming you add a 'state' attribute to items
      case 'ordered':
        setOrdered(ordered.filter((i) => i.id !== item.id));
        item.state = "processing";
        setProcessing([...processing, item]);
        break;
      case 'processing':
        setProcessing(processing.filter((i) => i.id !== item.id));
        item.state = "done";
        setDone([...done, item]);
        break;
      // No default needed if 'done' is the final state
    }
  };
  
  const handlePrevious = (item) => {
    switch (item.state) {
      case 'processing':
        setProcessing(processing.filter((i) => i.id !== item.id));
        item.state = "ordered";
        setOrdered([...ordered, item]);
        break;
      case 'done':
        setDone(done.filter((i) => i.id !== item.id));
        item.state = "processing";
        setProcessing([...processing, item]);
        break;
      // No default needed if 'ordered' is the initial state
    }
  };


  return (
        // <StateTable/>
    <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>
    <Grid item  justifyContent="center" alignItems="center" >
      <Paper className='itemContainer'  variant="elevation" elevation={2} sx={{ backgroundColor: '#010409'}} >
      <StateRowHeader state={"Bestellt"} color={"error"} number= {ordered?.length} />
      <StateRowSubHeader state={"Bestellt"} color={"error"} number= {ordered?.length} />
        { ordered?.length
        ? ordered.map((product) => (
        <Grid item><StateItem data={product} next={handleNext} previous={handlePrevious}/></Grid>
         )):null}
      </Paper>
    </Grid>
    <Grid item>
      <Paper className='itemContainer' variant="elevation" elevation={2} sx={{ backgroundColor: '#010409'}}>
      <StateRowHeader state={"In Bearbeitung"} color={"warning"} number= {processing?.length} />

        { processing?.length
        ? processing.map((product) => (
        <Grid item><StateItem data={product} next={handleNext} previous={handlePrevious}/></Grid>
         )):null}
      </Paper>
    </Grid>
    <Grid item>
      <Paper className='itemContainer' variant="elevation" elevation={2} sx={{ backgroundColor: '#010409'}}>
      <StateRowHeader state={"Fertig"} color={"success"} number= {done?.length} />

        { done?.length
        ? done.map((product) => (
        <Grid item><StateItem data={product} next={handleNext} previous={handlePrevious}/></Grid>
         )):null}
      </Paper>
    </Grid>
  </Grid>
  )
};

export default State;