import React, { useEffect, useMemo, useState } from "react";

import { firebaseConfig } from "../services/firebase_service";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

  const [file, setFile] = useState<Blob | null>();
  const [fileName, setFileName] = useState("");

  const [message, setMessage] = useState<string>();

  // Points to the root reference

  // Points to 'images'
  const imagesRef = ref(storageRef, "images");
  const disabledSubmit = file === null || file === undefined;

  // Points to 'images/space.jpg'
  // Note that you can use variables to create child values

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/auth");
      } else {
        setEmail(user.email);
      }
    });
  }, [auth, navigate]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files) {
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
      const snapshot = await uploadBytes(imageRef, file);
      setMessage(`Upload File ${snapshot.ref.name.toUpperCase()} Success`);
    } catch (err) {
      setMessage(String(err));
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
        sx={{ mt: "32px", display: "flex", justifyContent: "center" }}
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
      </Box>
      <CssBaseline />
      <CssBaseline />
      {message ?? (
          <Box
            sx={{
              m: "32px",
              p: "32px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {message}
          </Box>
      )}
    </Container>
  );
}
