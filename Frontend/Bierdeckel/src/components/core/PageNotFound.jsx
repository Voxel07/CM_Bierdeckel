import React from "react";
import { Typography, Button } from "@mui/material";

const PageNotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px", outline:"none" }}>
      <Typography variant="h1" component="h1">
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" component="p">
        We couldn't find the page you were looking for. Please check the URL and try again, or explore our site using the navigation below.
      </Typography>
      <Button href="/" variant="contained" color="primary">
        Go to Home Page
      </Button>
    </div>
  );
};

export default PageNotFound;
