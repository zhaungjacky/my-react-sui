import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Container from "@mui/material/Container/Container";
import TextField from "@mui/material/TextField/TextField";
import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import Tooltip from "@mui/material/Tooltip/Tooltip";

type PayloadActionType = {
  action: "F2C" | "C2F";
  input: number;
  numberType: "F" | "C";
};

export default function IndexPage() {
  function transerNumber(state: number, payload: PayloadActionType) {
    switch (payload.action) {
      case "F2C":
        state = ((payload.input - 32) * 5) / 9;
        return state;
      case "C2F":
        state = (payload.input * 9) / 5 + 32;
        return state;
    }
  }

  const [state, dispatch] = useReducer(transerNumber, 0);

  const [fOrC, setFOrC] = useState<string | null>(null);
  const [number, setNumber] = useState(0);

  const handleCOrFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFOrC(event.currentTarget.value);
  };

  const endSignInput: string = fOrC?.toLowerCase() === "celsius" ? "C" : "F";
  const endSignOutput: string = fOrC?.toLowerCase() === "celsius" ? "F" : "C";

  const handleNumChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNumber(Number(event.currentTarget.value));
  };

  const handleTransfer = () => {
    if (fOrC?.toLowerCase() === "celsius") {
      dispatch({
        action: "C2F",
        input: number,
        numberType: "F",
      });
    } else if (fOrC?.toLowerCase() === "fahrenheit") {
      dispatch({
        action: "F2C",
        input: number,
        numberType: "C",
      });
    } else {
      window.alert("No type selected");
    }
  };

  return (
    <Container>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          margin: "20px auto",
        }}
      >
        <div>
          <Link to="/home" style={{ color: "red" }}>
            Home
          </Link>
        </div>
        <br />
        <br />
        <div>
          <Link to="/transcation">Transcation</Link>
        </div>
        <br />
        <hr />
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={fOrC}
            onChange={handleCOrFChange}
            // defaultValue="celsius"
          >
            <FormControlLabel
              value="fahrenheit"
              control={<Radio />}
              // defaultChecked
              label="Fahrenheit To Celsius"
            />
            <FormControlLabel
              value="celsius"
              control={<Radio />}
              label="Celsius To Fahrenheit"
            />
          </RadioGroup>
        </FormControl>
        <TextField
          onChange={handleNumChange}
          name="input"
          helperText="Input"
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={endSignInput}>
                  <p>{endSignInput}</p>
                </Tooltip>
              </InputAdornment>
            ),
            // startAdornment: (
            //   <InputAdornment position="start">
            //     <Tooltip title="QR code">
            //       <IconButton onClick={handleOpenCloseQRModal}>
            //         <QrCode2 />
            //       </IconButton>
            //     </Tooltip>
            //   </InputAdornment>
            // ),
          }}
        />
        <TextField
          name="output"
          helperText="Output"
          type="number"
          disabled={true}
          value={state.toFixed(4)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={endSignOutput}>
                  <p>{endSignOutput}</p>
                </Tooltip>
              </InputAdornment>
            ),
            // startAdornment: (
            //   <InputAdornment position="start">
            //     <Tooltip title="QR code">
            //       <IconButton onClick={handleOpenCloseQRModal}>
            //         <QrCode2 />
            //       </IconButton>
            //     </Tooltip>
            //   </InputAdornment>
            // ),
          }}
        />

        <Button onClick={handleTransfer}>Transfer</Button>
      </Box>
    </Container>
  );
}
