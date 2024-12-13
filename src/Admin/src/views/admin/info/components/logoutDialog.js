import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useTheme } from "../../ThemeContext";
import { translations } from "../../../../components/Translation/translation";

const LogoutDialog = ({ open, onClose, onLogout }) => {
  const { language } = useTheme();
  const t = translations[language].userProfile;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t.logoutTitle}</DialogTitle>
      <DialogContent>
        {t.logoutMessage}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t.stayLoggedIn}
        </Button>
        <Button onClick={onLogout} color="primary" variant="contained">
          {t.logout}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
