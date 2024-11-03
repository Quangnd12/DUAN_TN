import React from 'react';
import { TextField, Button, Grid, Typography, Divider } from "@mui/material";

const AccountSettingsForm = ({ formData, handleInputChange, handleSubmit, hasChanges, handleCancel }) => (
  <div>
    <Typography variant="h6" gutterBottom>
      Account Settings
    </Typography>
    <Divider sx={{ mb: 3 }} />
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Birthday"
            type="date"
            variant="outlined"
            name="birthday"
            value={formData.birthday ? new Date(formData.birthday).toISOString().split("T")[0] : ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      <div className="my-2">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!hasChanges()}
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{ ml: 2 }}
          disabled={!hasChanges()}
        >
          Cancel
        </Button>
      </div>
    </form>
  </div>
);

export default AccountSettingsForm;
