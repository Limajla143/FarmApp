import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";
import { useState } from "react";

interface Props {
    metaData: MetaData;
    onPageChange: (page: number) => void;
}

export default function AppPagination({metaData, onPageChange}: Props) {
    const {pageNumber, count, totalPages, pageSize} = metaData;
    const [currentPage, setCurrentPage] = useState(pageNumber);

    function handlePageChange(page: number) {
        setCurrentPage(page);
        onPageChange(page);
    }
    
    return (
        <Box display='flex' justifyContent='space-between' alignItems='center' >
                     <Typography> Displaying {(pageNumber - 1) * pageSize + 1 } - 
                     {currentPage * pageSize > count! ? count : pageNumber * pageSize } of {count} items </Typography>
                     <Pagination color='secondary' size='large' count={totalPages} page={currentPage} 
                                onChange={(e, page) => handlePageChange(page)}/>
        </Box>
    )
}