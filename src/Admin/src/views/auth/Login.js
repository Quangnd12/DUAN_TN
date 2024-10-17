import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Box,
  Grid,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PeopleIcon from "@mui/icons-material/People";
import ForgotPassword from "./Forgot"; // Import the ForgotPassword component

const Feature = ({ Icon, title, description }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Icon sx={{ mr: 2, fontSize: 30, color: "primary.main" }} />
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Box>
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt", { email, password, rememberMe });
    navigate("/admin/dashboard");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Music Heals Stream Administration
          </Typography>
          <Feature
            Icon={MusicNoteIcon}
            title="Content management"
            description="Easily add, edit, and delete songs and albums in the system."
          />
          <Feature
            Icon={QueueMusicIcon}
            title="Create playlists"
            description="Create and manage unique playlists for users."
          />
          <Feature
            Icon={EqualizerIcon}
            title="Data analysis"
            description="Track music listening trends and user interactions."
          />
          <Feature
            Icon={PeopleIcon}
            title="User management"
            description="Manage user accounts and access."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ padding: 4, width: "100%", maxWidth: 600, mx: "auto" }}
          >
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Forgot Password" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" align="center" gutterBottom>
                Login
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  placeholder="Please enter your email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  placeholder="Please enter your password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember to log in"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign in
                </Button>
              </form>
              <button
                className="w-full py-2 px-4 bg-white border border-[#6a6a6a] text-black rounded-md shadow-md flex items-center justify-center hover:border-white hover:border-[1px] hover:ring-1 hover:ring-white transition-all"
                type="button"
              >
                <img
                  className="w-5 h-5"
                  src={`/images/logo/Google.png`}
                  alt="Google Logo"
                />
                <span className="flex-1 text-center">Sign in with Google</span>
              </button>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ForgotPassword />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}