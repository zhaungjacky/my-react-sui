import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "../services/firebase_service";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";

type ImageObjProps = {
  title: string;
  url: string;
};

function ImageListPage() {
  const navigate = useNavigate();
  const app = useMemo(() => initializeApp(firebaseConfig), []);
  const auth = useMemo(() => getAuth(app), [app]);
  const storage = useMemo(() => getStorage(app), [app]);

  const [imagesRef, setImagesRef] = useState<StorageReference>();

  const [imageList, setImageList] = useState<ImageObjProps[]>(
    [] as ImageObjProps[]
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/auth");
        return;
      }
      setImagesRef(ref(storage, user.uid?.toLowerCase()));
      // setImagesRef(ref(storage, user.email?.toLowerCase()));
    });
  }, [auth, navigate, storage]);

  useEffect(() => {

    if(!imagesRef) return;
 

      listAll(imagesRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((res) => {
              const obj: ImageObjProps = {
                title: itemRef.name,
                // type:itemRef.
                url: res,
              };
              setImageList((prev) => {
                let old = prev;
                       old.push(obj);
                const newSet = new Set([...old]);
                const newList = Array.from(newSet);
                return newList;
              });
            });

            // return null;
          });
        })
        .catch((err) => console.log(err));
    
  
  }, [imagesRef]);

  if (imageList.length ===0) {
    return (
      <Box
        sx={{
          width: 500,
          height: 450,
        display:"flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:"ButtonShadow"
        }}
      >
        {/* <Box>"No Images"</Box> */}
        <Box><CircularProgress sx={{width:"200px",height:"200px"}}/></Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: " 90%",
        minHeight: 450,
        overflowY: "scroll",
        justifyContent: "center",
        marginLeft: "32px",
      }}
    >
      <ImageList variant="masonry" cols={3} gap={8}>
        {imageList.map((item) => (
          <ImageListItem key={item.url}>
            <img
              srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.url}?w=248&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

export default React.memo(() => ImageListPage());
