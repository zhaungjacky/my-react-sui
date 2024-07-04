import React, { useEffect, useMemo, useState } from "react";

import { firebaseConfig } from "../services/firebase_service";
import { initializeApp } from "firebase/app";
import {
  StorageReference,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { CssBaseline } from "@mui/material";
import CircularWithValueLabel from "../components/MyCircleProgress";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadPage() {
  // Initialize Cloud Storage and get a reference to the service
  const [email, setEmail] = useState<string | null>();
  const navigate = useNavigate();
  const app = useMemo(() => initializeApp(firebaseConfig), []);
  const auth = useMemo(() => getAuth(app), [app]);
  const storage = useMemo(() => getStorage(app), [app]);
  const storageRef = useMemo(() => ref(storage), [storage]);

  const [uploading, setUploading] = useState(false);
  const [progressPrecent, setProgressPrecent] = useState(0);

  const [file, setFile] = useState<Blob | null>();
  const [fileName, setFileName] = useState("");

  const [message, setMessage] = useState<string>();

  // Points to the root reference

  // Points to 'images'
  // const imagesRef = ref(storageRef, "images");
  const disabledSubmit = file === null || file === undefined || uploading;
  const [imagesRef, setImagesRef] = useState<StorageReference>();
  // Points to 'images/space.jpg'
  // Note that you can use variables to create child values

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/auth");
      } else {
        setEmail(user.email);
        setImagesRef(ref(storageRef, user.uid.toLowerCase()));
      }
    });
  }, [auth, navigate, storageRef]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files) {
      setUploading(false);
      setProgressPrecent(0);
      const fileInstance = event.target.files[0];
      setFile(fileInstance);
      setFileName(fileInstance.name);
      setMessage(` Choose File ${fileInstance.name.toUpperCase()} Success`);
    }
  };

  const handleSubmitUpload = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!imagesRef) return;
    if (file === null || file === undefined) {
      setMessage("No File");
      return;
    }
    // File path is 'images/space.jpg'
    const now = new Date();
    const uploadFileName =
      Intl.DateTimeFormat("en-US").format(now).replaceAll("/", "_") +
      "_" +
      email +
      "_" +
      fileName;
    const imageRef = ref(imagesRef, uploadFileName);
    try {
      // const snapshot = await uploadBytes(imageRef, file);
      // setMessage(`Upload File ${snapshot.ref.name.toUpperCase()} Success`);

      const uploadTask = uploadBytesResumable(imageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      setUploading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressPrecent(progress);
          // if(progressPrecent > 99.99){
          //   setMessage(`Upload File ${fileName.toUpperCase()} Success`);
          //   setUploading(false);
          // }
          // console.log(progress)
          // <MyModal val={progress} open={uploading} />
          switch (snapshot.state) {
            case "canceled":
              // setMessage("Upload is canceled");
              setUploading(false);
              break;
            case "paused":
              // console.log("Upload is paused");
              // setMessage("Upload is paused");
              setUploading(false);
              break;
            case "running":
              // console.log("Upload is running");
              // setMessage("Upload is running");
              break;

            case "success":
              // setMessage(`Upload File ${fileName.toUpperCase()} Success`);
              setUploading(false);
              break;
            case "error":
              setMessage("Upload error occured!");
              setUploading(false);
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          setMessage(error.message);
          setUploading(false);
        }
        // () => {
        //   // Handle successful uploads on complete
        //   // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //     console.log("File available at", downloadURL);
        //   });
        // }
      );
    } catch (err) {
      setMessage(String(err));
      setUploading(false);
    }
    // const path = spaceRef.fullPath;

    // // File name is 'space.jpg'
    // const name = spaceRef.name;

    // // Points to 'images'
    // const imagesRefAgain = spaceRef.parent;
    // console.log(name)
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          justifyContent: "center",
          alignItems: "center",
          mt: "32px",
          gap: "16px",
        }}
      >
        <Typography>Welcome: {email}</Typography>
      </Box>
      <Box sx={{ mt: "32px", display: "flex", justifyContent: "center" }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          fullWidth
          tabIndex={-1}
          startIcon={<AttachFileIcon />}
        >
          Choose file
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            accept="png"
          />
        </Button>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmitUpload}
        sx={{ mt: "32px", display: "flex", justifyContent: "center", flexDirection:"column" }}
      >
        <Button
          // component="label"
          role={undefined}
          variant="contained"
          fullWidth
          tabIndex={0}
          type="submit"
          startIcon={<CloudUploadIcon />}
          disabled={disabledSubmit}
        >
          Submit file
        </Button>
        {message !== null  ? 
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center",margin:"32px"}}>
          <Typography component="h5" sx={{color:"green"}}>{message}</Typography>
        </Box> : null
      }
      </Box>

      {/* <Box>{progressPrecent?? progressPrecent}</Box> */}
      {/* {uploading ?? <CircularWithValueLabel val={progressPrecent} />} */}

      {/* {(uploading && progressPrecent ) ?? <Box sx={{width:"200px",height:"200px"}}><CircularProgress value={progressPrecent}/></Box>}
       */}
      {progressPrecent > 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "32px",
          }}
        >
          <CircularWithValueLabel val={progressPrecent} />
        </Box>
      ) : null}
   
    </Container>
  );
}
