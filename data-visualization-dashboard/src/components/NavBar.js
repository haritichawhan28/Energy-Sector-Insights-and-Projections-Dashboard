import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Data Visualization Dashboard
      </Typography>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;
