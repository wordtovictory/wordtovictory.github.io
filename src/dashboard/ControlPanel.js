import React from 'react';
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import exportFromJSON from "export-from-json";

export default function ControlPanel(props) {

    const {readStatus, setReadStatus} = props;

    const handleSave = () => {
        const data = [{readStatus: readStatus}];
        const fileName = "application-state";
        const exportType = exportFromJSON.types.json;
        exportFromJSON({ data, fileName, exportType });
    };
    const handleLoad = (event)=>{
        console.log(event.target.files.length);
        if(event.target.files.length){
            console.log(event.target.files[0]);
            event.target.files[0]
                .text()
                .then((data) => JSON.parse(data))
                .then((data) => {
                    setReadStatus(data[0].readStatus);
                });
        }
    };

    return (
        <div>
            {/*<Button variant={"contained"}>Clear All</Button>*/}
            <Button variant={"contained"} onClick={handleSave}>Save bible study record</Button>
            <Box sx={{
                flex: '0 0 32px'
            }}></Box>
            <Button variant={"contained"}>
                Load bible study record
                <input
                    type="file"
                    onChange={handleLoad}
                    accept=".json"
                    hidden
                />
            </Button>

        </div>
    );
};
