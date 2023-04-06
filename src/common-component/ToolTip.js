import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Roboto",
    fontStyle: "normal",
    color: "#2D1F7A",
    opacity: "70%",
    boxShadow: theme.shadows[1],
    fontSize: "16px",
    fontWeight: 800,
    width: "auto",
    height: "20px",
    padding: "10px 5px",
  },
}));
export default function TriggersTooltips(props) {
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <Box>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
          <LightTooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={open}
            title={props?.msg}
            arrow
            placement="top"
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <IconButton onClick={handleTooltipOpen}>
              <InfoOutlinedIcon sx={{ color: "#D6D3E9" }} />
            </IconButton>
          </LightTooltip>
        </div>
      </ClickAwayListener>
    </Box>
  );
}
