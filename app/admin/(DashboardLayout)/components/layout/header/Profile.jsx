import React, {useState} from "react";
import {useAuth} from "../../../../context/authContext";
import { Box } from "@mui/material";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
const Profile = ()=>{
    const {user, logout} = useAuth();
    const [achorEl2, setAnchorEl2] = useState(null);

    const handleCLick2 = (event)=>{
        setAnchorEl2(event.currentTarget);
    };

    const handleClose2=()=>{
        setAnchorEl2(null);
    };

    const handleLogout=()=>{
        logout();
    };

    return(
        <Box>
        <IconButton
        size="large"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(Boolean(anchorEl2) && { color: "primary.main" }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={user?.user?.avatar || "/images/profile/user-1.jpg"}
          alt="User Avatar"
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>
        <Menu
            id="profile-menu"
            anchorEl={anchorEl2}
            keepMounted
            open={Boolean(anchorEl2)}
            onClose={handleClose2}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            sx={{ "& .MuiMenu-paper": { width: "200px" } }}
        >
            <MenuItem>
            <ListItemIcon>
                <IconUser width={20} />
            </ListItemIcon>
            <ListItemText>Хувийн мэдээлэл</ListItemText>
            </MenuItem>
            <Box mt={1} py={1} px={2}>
            <Button variant="outlined" color="primary" fullWidth onClick={handleLogout}>
                Гарах
            </Button>
            </Box>
        </Menu>
        </Box>
    );
};
export default Profile;