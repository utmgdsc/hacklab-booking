import {
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React, { useState } from "react";

interface RoleChangerProps {
  /** the utorid of the user whose role is being changed */
  utorid: string;
  /** the current role of the user */
  userRole: string;
  /** a react function that will be called updating the role */
  setUpdate: (update: number) => void;
}

/**
 * a button that opens a menu with the options
 * to change the role of a user to student, approver, tcard, or admin
 *
 * @param {string} utorid - the utorid of the user whose role is being changed
 * @param {string} userRole - the current role of the user
 * @param {function} setUpdate - a react function that will be called updating the role
 *
 * @returns {JSX.Element} - the rendered button
 */
export const RoleChanger = ({ utorid, userRole, setUpdate }: RoleChangerProps): JSX.Element => {
  const [role, setRole] = useState(userRole);
  const [open, setOpen] = useState(false);

  const handleRoleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setRole(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
  //   fetch(process.env.REACT_APP_API_URL + "/accounts/changeRole/" + utorid, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ role: role }),
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(`Changed ${utorid}'s role to ${data.role}`);
  //       setUpdate(Math.random());
  //     })
  //   setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Change Role</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the role of {utorid} to:
          </DialogContentText>
          <Select value={role} onChange={handleRoleChange} label="Role">
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="approver">Approver</MenuItem>
            <MenuItem value="tcard">TCard</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
