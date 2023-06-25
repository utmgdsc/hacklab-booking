import { useState, useEffect } from "react";
import { Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import axios from "../../axios";

export const ApproverSelect = ({ setApprovers }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [approvers, setApproversBackend] = useState([]);
  useEffect(() => {
      axios.get('/accounts/approvers').then(({data}) => {
            setApproversBackend(data);
      });
  }, []);
  // TODO INTEGRATE
  // useEffect(() => {
  //   fetch(process.env.REACT_APP_API_URL + "/requests/approvers", {
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data, "approvers");
  //       setApproversBackend(data);
  //     });
  // }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (event) => {
    setSelected(event.target.value);
    setApprovers(event.target.value);
  };

  return (
    <>
      <Select
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={selected}
        onChange={handleSelect}
        multiple
        renderValue={(selected) => {
          if (selected.length === 0) {
            return "Select Approvers";
          } else if (selected.length === approvers.length) {
            return "All Approvers";
          } else {
            return selected.join(", ");
          }
        }}
      >
        {approvers.map((approver) => (
          <MenuItem key={approver.utorid} value={approver.utorid}>
            <Checkbox checked={selected.indexOf(approver.utorid) > -1} />
            <ListItemText primary={approver.name} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
