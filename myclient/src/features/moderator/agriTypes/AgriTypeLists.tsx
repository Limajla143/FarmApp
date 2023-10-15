import {  useState } from "react";
import { useAppDispatch } from "../../../app/store/configStore";
import { AgriType } from "../../../app/models/agriType";
import agent from "../../../app/api/agent";
import { removeAgriType, setPageNumber } from "./agriTypeSlice";
import AgriTypeForm from "./AgriForm";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useAgriTypes from "../../../app/hooks/useAgriTypes";
import { Delete, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import AppPagination from "../../../app/components/AppPagination";
import AgriTypeSearchInput from "./AgriTypeSearchInput";

export default function AgriTypeLists() {
    const { agriTypelists, metaData } = useAgriTypes();
    const dispatch = useAppDispatch();

    const [editMode, setEditMode] = useState(false);
    const [selectAgriType, setSelectedAgriType] = useState<AgriType | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [target, setTarget] = useState(0);

    function handleSelectAgriType(agrType: AgriType) {
        setSelectedAgriType(agrType);
        setEditMode(true);
    }

    function handleDeleteAgriType(id: number) {
       setLoading(true);
       setTarget(id);
       agent.AgriTypes.removeAgriType(id)
       .then(() => dispatch(removeAgriType(id)))
       .catch(error => console.log(error))
       .finally(() => setLoading(false));
    }

    function cancelEdit() {
        if(selectAgriType) {
            setSelectedAgriType(undefined);
        }
        setEditMode(false);
    }

    if(editMode) return <AgriTypeForm agriType={selectAgriType} cancelEdit={cancelEdit} />

    return (
        <>
             <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Agri Types</Typography>
                <Button onClick={() => setEditMode(true)} sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
            </Box>

            <Box  sx={{marginBottom: 1}}>
                <Paper sx={{width: '500px'}}>
                    <AgriTypeSearchInput />
                </Paper>
            </Box>

            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{fontStyle: "Monospace", fontSize: 20}}>Product Types</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agriTypelists.map((agrType) => (
                            <TableRow
                                 key={agrType.agriTypeId}
                                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {agrType.name}
                                </TableCell>                              
                                <TableCell align="right">
                                    <Button onClick={() => handleSelectAgriType(agrType)} startIcon={<Edit />} />
                                    <LoadingButton 
                                        loading={loading && target === agrType.agriTypeId} 
                                        onClick={() => handleDeleteAgriType(agrType.agriTypeId)} 
                                        startIcon={<Delete />} color='error' />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {metaData && 
                <Box sx={{pt: 2}}>
                    <AppPagination 
                        metaData={metaData} 
                        onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
                </Box>
            }        
        </>
    )
}