import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "../Navbar.css";

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Data Visualization Dashboard
      </Typography>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
      <Button color="inherit" component={Link} to="/city">
        City Chart
      </Button>
      <Button color="inherit" component={Link} to="/line">
        Line Chart
      </Button>
      <Button color="inherit" component={Link} to="/region">
        Region Chart
      </Button>
      <Button color="inherit" component={Link} to="/timeline">
        Timeline Chart
      </Button>
      <Button color="inherit" component={Link} to="/topics">
        Topics Chart
      </Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;
