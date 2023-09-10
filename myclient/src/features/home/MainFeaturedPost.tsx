import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { Slider } from '@mui/material';

interface MainFeaturedPostProps {
  post: {
    description: string;
    image: string;
    imageText: string;
    linkText: string;
    title: string;
  };
}

export default function MainFeaturedPost(props: MainFeaturedPostProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

  const { post } = props;

  return (
    <>
       <Slider {...settings}>
                <div>
                    <img src={post.image} alt={post.imageText} style={{ display: 'block', width: '100%', maxHeight: 500 }} />
                </div>
                <div>
                    <img src={post.image} alt={post.imageText} style={{ display: 'block', width: '100%', maxHeight: 500 }} />
                </div>
                <div>
                    <img src={post.image} alt={post.imageText} style={{ display: 'block', width: '100%', maxHeight: 500 }} />
                </div>
            </Slider>
            <Box display='flex' justifyContent='center' sx={{ p: 4 }} >
                <Typography variant='h1'>
                    Welcome to my Farm!
                </Typography>
            </Box>
    </>
  );
}