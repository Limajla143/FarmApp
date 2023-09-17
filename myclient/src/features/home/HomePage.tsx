import { Grid } from "@mui/material";
import FeaturedPost from "./FeaturedPost";
import Footer from "./Footer";
import MainFeaturedPost from "./MainFeaturedPost";
import Main from "./Main";

const mainFeaturedPost = {
   title: 'Title of a longer featured blog post',
   description:
     "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
   image: 'https://source.unsplash.com/random?wallpapers',
   imageText: 'main image description',
   linkText: 'Continue reading…',
 };
 
 const featuredPosts = [
   {
     title: 'Featured post',
     date: 'Nov 12',
     description:
       'This is a wider card with supporting text below as a natural lead-in to additional content.',
     image: 'https://source.unsplash.com/random?wallpapers',
     imageLabel: 'Image Text',
   },
   {
     title: 'Post title',
     date: 'Nov 11',
     description:
       'This is a wider card with supporting text below as a natural lead-in to additional content.',
     image: 'https://source.unsplash.com/random?wallpapers',
     imageLabel: 'Image Text',
   },
 ];

 const posts = [""]

export default function HomePage() {

   return (
      <>
      <main>
           {/* <MainFeaturedPost post={mainFeaturedPost} /> */}
           {/* <Grid container spacing={4}>
             {featuredPosts.map((post) => (
               <FeaturedPost key={post.title} post={post} />
             ))}
           </Grid>     */}
       </main>
       <Footer
         title="Footer"
         description="Something here to give the footer a purpose!"
       />
    </>
   )
  
}