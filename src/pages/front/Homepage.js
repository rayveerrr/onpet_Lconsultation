import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Carousel from '@itseasy21/react-elastic-carousel';

//components
import Header from '../../components/frontend/Header'

//styles
import '../../styles/homepage.css'

// image
import petfood from '../../image/pet-food-category.png'
import petvit from '../../image/pet-vit-category.png'
import petaccessories from '../../image/pet-accessories-category.png'
import petcage from '../../image/pet-cage-category.png'
import petbowl from '../../image/pet-feeder-category.png'
import pettreats from '../../image/pet-treat-category.png'
import { Box, Typography } from '@mui/material';
import Footer from '../../components/frontend/Footer';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

import dog from '../../image/doggo.jpg'
import cat from '../../image/catto.jpg'
import rabbit from '../../image/rabbitto.jpeg'
import fish from '../../image/fisho.jpg'
import bird from '../../image/birdo.jpg'

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";


const HomePage = () => {
    const boxStyle = {
        backgroundColor: 'white', 
        color: 'black',
        height: '100%',
        width: '16%',
        "&:hover": {
            backgroundColor: 'black',
            color: 'white',
        },
        "& a:hover": {
            backgroundColor: 'black',
            color: 'white',
        },
    }


    const [feedback, setFeedback] = useState([]);
    const feedbackCollectionRef = collection(db, "Feedback");

    useEffect(() => {
        const getFeedback = async () => {
            const data = await getDocs(feedbackCollectionRef);
            setFeedback(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }
        getFeedback(feedback);
    }, [])

    
    return (
        <div className='main'>
            <Header />
            <div className="promotion-section">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                }}
                pagination={{
                clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide><img src={dog} alt="dog" /></SwiperSlide>
                <SwiperSlide><img src={cat} alt="cat" /></SwiperSlide>
                <SwiperSlide><img src={rabbit} alt="rabbit" /></SwiperSlide>
                <SwiperSlide><img src={fish} alt="fish" /></SwiperSlide>
                <SwiperSlide><img src={bird} alt="bird" /></SwiperSlide>
            </Swiper>
            </div>

            <div className="category-section">
                <h3>Categories</h3>
                <div className="category-list">
                    <Box  className="category" sx={boxStyle}>
                        <Link to={"/productlist/" + 'food'}  sx={boxStyle}>
                            <div className="image-container">
                                <img src={petfood} alt="petfoodicon" ></img>
                            </div>
                            <p>Pet food</p>
                        </Link>
                    </Box>
                    <Box  className="category" sx={boxStyle}>
                        <Link to={"/productlist/" + 'supplement'}>
                            <div className="image-container">
                                <img src={petvit} alt="petvitaminsicon"></img>
                            </div>
                            <p>Pet supplement</p>
                        </Link>
                    </Box>
                    <Box  className="category" sx={boxStyle}>
                        <Link to={"/productlist/" + 'accessories'} >
                        <div className="image-container">
                            <img src={petaccessories} alt="petaccessoriesicon"></img>
                        </div>
                        <p>Pet accessories</p>
                        </Link>
                    </Box>
                    <Box  className="category" sx={boxStyle}>
                        <Link to={"/productlist/" + 'cage'}>
                        <div className="image-container">
                            <img src={petcage} alt="petcageicon"></img>
                        </div>
                        <p>Pet cage</p>
                        </Link>
                    </Box>
                    <Box  className="category" sx={boxStyle}>
                        <Link to={"/productlist/" + 'feeders'}>
                        <div className="image-container">
                            <img src={petbowl} alt="petbowlsicon"></img>
                        </div>
                        <p>Pet feeders/bowls</p>
                        </Link>
                    </Box>
                    <Box  className="category" sx={boxStyle}>
                        <Link to={"/productlist/" + 'treats'}>
                        <div className="image-container">
                            <img src={pettreats} alt="pettreaticon"></img>
                        </div>
                        <p>Pet treats</p>
                        </Link>
                    </Box>
                </div>
            </div>

            <div className="feedback-section">
                <h3>Feedback</h3>
                <div className='carousel'>
                <Carousel>
                        {feedback.map((feed) => {
                            return feedback.length >= 1 ?
                                ( 
                                    <>
                                        
                                            <div key={feed.id} style={{width: '80%', height: '200px', margin: 'auto'}}>
                                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px'}}>
                                                    <Typography variant='title'><b>Name: </b><i>{feed.Name}</i></Typography>
                                                    <Typography variant='title'><b>Date:</b> <i>{feed.Date.toLocaleString()}</i></Typography>
                                                </div>
                                                <Typography variant='h6'>Feedback:</Typography>
                                                <Typography variant='h6'><em>{feed.Comment}</em></Typography>
                                            </div>
                                        
                                    </>
                                ) 
                                : <div><h3> No feedback </h3></div>
                            })}
                    </Carousel>
                </div>
            </div>

            <div className="about-section">
                <h3>About</h3>
                
                <div style={{textAlign: 'left', padding: 0, margin: 0}}>
                <h2 style={{margin: '0.8em', padding: 0}}>Paws and Claws Grooming Services</h2>
                <Typography variant='title' sx={{margin: '0 1em'}}> The concept started at <em>July 24,2020</em> and established on <em>August 15,2020</em>. </Typography>
                <Typography variant='subtitle1' sx={{margin: '0 1em'}}> <b>Paws and Claws</b> was established to promote alternative <b>healthy products and promote outmost care for our pets</b> that we all cherished. Many products that are available to market are not enough to provide the nutrition that our pets need and some of it might be harmful. The passion of the owner for animals made the establishment of Paws and Claws possible. </Typography>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage