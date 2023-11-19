import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function HomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1
};

   const [homeImages, setHomeImages] = useState<string[]>([]);

   useEffect(() => {
      agent.Home.getHomeImages().then((response) => {
        setHomeImages(response);
      }).catch(error => {
        toast.error(error);
      });
   }, []);

   return (
      <>
      <Box display='flex' justifyContent='center' sx={{ p: 4 }} >
                <Typography variant='h1'>
                    Welcome to MyFarm!
                </Typography>
            </Box>
        <Slider {...settings}>
          {homeImages?.map((img, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <img src={img} alt="" style={{ display: 'inline-block', width: '100%', maxHeight: 500}} />
          </div>
        ))}
        </Slider>
            
      </>
   )
  
}