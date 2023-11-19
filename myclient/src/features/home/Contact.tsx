import { Box, Typography } from "@mui/material";
import Footer from "./Footer";

export default function Contact() {
    return (
        <>
          <Box
                sx={{
                display: 'grid',
                gridTemplateRows: '1fr auto', // One row for the content, one for the footer
                minHeight: '100vh',
            }}>
              <Box>
                <Typography component="h1" variant="h2" align="center"color="text.primary" gutterBottom>
             Contact us!
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
               You may contact at 09212461068 for more inquiruies.
            </Typography>  
              </Box>
              <Footer title="" description="" />
         </Box>
           
        </>
    )
}