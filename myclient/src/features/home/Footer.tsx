import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        MyFarm App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface FooterProps {
  description: string;
  title: string;
}

export default function Footer(props: FooterProps) {
  const { description, title } = props;


  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, margin: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          {description}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
        Powered by{' '}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2, // Adjust the gap as needed
            flexWrap: 'wrap', // Allow images to wrap to the next line if necessary
          }}
        >
          {[
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/.NET_Core_Logo.svg/2048px-.NET_Core_Logo.svg.png',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png',
            'https://cdn.worldvectorlogo.com/logos/redux.svg',
            'https://mui.com/static/logo.png',
            'https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Logo-redis.svg/2560px-Logo-redis.svg.png',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Cloudinary_logo.svg/2560px-Cloudinary_logo.svg.png',
          ].map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Logo ${index + 1}`}
              style={{ width: '100px', height: 'auto' }} // Adjust the width as needed
            />
          ))}
        </Box>
      </Typography>
        <Copyright />
      </Container>
    </Box>
  );
}