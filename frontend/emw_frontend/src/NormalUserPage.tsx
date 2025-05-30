import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useQuery } from '@tanstack/react-query';
import axiosWithCredentials from './axiosWithCredentials';
import { NavLink, useNavigate } from 'react-router';
import { Button } from '@mui/material';
import PaginationComponent from './PaginationComponent';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';


export type eventType = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: "Ongoing" | "Completed";
  thumbnail: string;
  mimeType: string; 
  location: string;
  ownerId: number;
  
}

export default function NormalUserPage() {
  
  const { data, isPending, error} = useQuery({
    queryKey: ['fetchAllEvents'],
    queryFn: async () => {
      const response = await axiosWithCredentials.get('http://localhost:8000/event/getAllEvents');
      if (!response) {
        throw new Error('Network response was not ok');
      }

      console.log("Response from getAllEvents: ", response.data);
      return response.data;
    },
  });

  const navigate = useNavigate();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No events found.</div>;

  const goToDetail = (data :eventType) => {
    navigate(`/eventdetail/${data.id}`, { state: { eventData: data } });
  }

  return (
  <ImageList sx={{ width: 700, height: 350 }}>
    {/* <PaginationComponent array=  */}
      {data.map((item:eventType) => (
        <ImageListItem key={item.id} style={{ cursor:"pointer"}} onClick={() => goToDetail(item)}>
          <img
            srcSet={`${item.thumbnail} 2x`}
            src={`${item.thumbnail}`}
            alt={item.name}
            loading="lazy"
            width={300}
            height={200}
          />
          {/* <NavLink to={`/event/${item.id}`} style={{ textDecoration: "underline", color: 'blue' }}> */}
          {/* <Button sx={{ padding : 0, margin: 0}} onClick={()=> goToDetail(item)}> */}
            <ImageListItemBar
              title={item.name}
              subtitle={<span>by: Owner ID {item.ownerId}</span>}
              position="top"
              
            />
          {/* </Button> */}
          {/* </NavLink> */}
          </ImageListItem>
          
      ))}
      {/* itemsPerPage={3} */}
      {/* /> */}
    </ImageList>
  // <ImageList sx={{ width: 300, height: 250 }}>
  //     <ImageListItem key="Event" cols={2}>
  //       <ListSubheader component="div">Event</ListSubheader>
  //     </ImageListItem>
  //     {data.map((item:eventType) => (
  //       <ImageListItem key={item.id}>
  //         <img
  //           srcSet={`${item.thumbnail} 2x`}
  //           src={`${item.thumbnail}`}
  //           alt={item.name}
  //           loading="lazy"
  //           width={300}
  //           height={200}
  //         />
  //         <ImageListItemBar
  //           title={item.name}
  //           subtitle={<span>by: Owner ID {item.ownerId}</span>}
  //           actionIcon={
  //             <IconButton
  //               sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
  //               aria-label={`info about ${item.name}`}
  //             >
  //               <InfoIcon />
  //             </IconButton>
  //           }
  //         />
  //       </ImageListItem>
  //     ))}
  //   </ImageList>
  )
}

