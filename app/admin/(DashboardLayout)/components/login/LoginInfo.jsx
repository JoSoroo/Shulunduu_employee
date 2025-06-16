"use client";
import React from "react";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Grid } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import Image from "next/image";
import img from "./image.png";
import logo from "./imagelogo.png";

const LoginInfo = () => {
  const benefits = [
    "Хэн ямар ээлжинд гарч байгаа",
    "Хэн хэзээ ажилласан ",
    "Ажилчины дэлгэрэнгүй мэдээлэл",
    
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: 900, p: 2, mx: "auto" }}>
      <Grid container spacing={2}>
        {/* Row 1: MUIS Logo (centered) */}
        <Grid item xs={12} textAlign="center">
          <Image
            src={img}
            alt="Logo"
            width={1000}
            height={150}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid>

        {/* Row 2: Doctor image (left), bullet points + info (right) */}
        {/* <Grid item xs={12} sm={4} textAlign="end" mt={5}>
          <Image
            src={logo}
            alt="Doctor"
            width={150}
            height={290}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid> */}

        <Grid item xs={12} sm={8} color="orange">
          <Box textAlign="left">
            <Typography variant="body1" mt={2} >
              Та Шөлөндөгийн <b>Бүртгэлийн системийг</b> ашигласнаар дараах давуу талуудыг эдлэнэ:
            </Typography>

            <List sx={{ mt: 1 }}>
              {benefits.map((benefit, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <VerifiedIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" fontWeight="bold" mt={2}>
              Холбогдох утас: 7575-4400
            </Typography>

            {/* <Typography variant="body2" color="textSecondary" mt={10} color="orange">
              2025 © Бүх эрх хуулиар хамгаалагдсан.
            </Typography> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginInfo;
