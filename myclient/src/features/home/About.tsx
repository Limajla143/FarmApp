import { Box, Typography } from "@mui/material";
import Footer from "./Footer";

export default function About() {
    return (
        <>
            <Box
                sx={{
                display: 'grid',
                gridTemplateRows: '1fr auto', // One row for the content, one for the footer
                minHeight: '100vh',
            }}>
            <Box>
                <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              About FarmApp
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
               This is an application for the Farm owners who wants to advertise and to sell their products.
               For now, it is built for portfolio purposes only. Currently in development to practice my dev skills.  
            </Typography>

           </Box>  
           <Footer title="" description="" />
          </Box>
        </>
    )
}