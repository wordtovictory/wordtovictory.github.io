import React, {useRef} from 'react';
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import exportFromJSON from "export-from-json";

export default function ControlPanel(props) {

    const {readStatus, setReadStatus} = props;
    const inputRef = useRef(null);

    const handleSave = () => {
        const data = [{readStatus: readStatus}];
        const fileName = "application-state";
        const exportType = exportFromJSON.types.json;
        exportFromJSON({ data, fileName, exportType });
    };
    const handleInputLoad = (event)=>{
        if(event.target.files.length){
            event.target.files[0]
                .text()
                .then((data) => JSON.parse(data))
                .then((data) => {
                    setReadStatus(data[0].readStatus);
                });
        }
    };

    const handleLoad = (e) => {
        if (!inputRef || !inputRef.current) return;
        inputRef.current.click();
    };

    return (
        <div>
            {/*<Button variant={"contained"}>Clear All</Button>*/}
            <Button variant={"contained"} onClick={handleSave}>Save bible study record</Button>
            <Box sx={{
                flex: '0 0 32px'
            }}></Box>
            <Button variant={"contained"} onClick={handleLoad}>
                Load bible study record
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleInputLoad}
                    accept=".json"
                    hidden
                />
            </Button>

        </div>
    );
};
