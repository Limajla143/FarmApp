import { Edit } from "@mui/icons-material";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useAppDispatch } from "../../../app/store/configStore";
import { useState } from "react";
import { UserProfile } from "../../../app/models/UserProfile";
import AppPagination from "../../../app/components/AppPagination";
import { setUsersPageNumber } from "./adminSlice";
import UserSearchInput from "./UserSearchInput";
import UserAdminForm from "./UserAdminForm";
import useUserProfiles from "../../../app/hooks/useUserProfile";

export default function UserProfileLists() {
    const {userProfileLists, metaData} = useUserProfiles();
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | undefined>(undefined);

    function handleSelectUserProfile(userProfile: UserProfile) {
        setSelectedUserProfile(userProfile);
        setEditMode(true);
    }

    function cancelEdit() {
        if (selectedUserProfile) setSelectedUserProfile(undefined);
        setEditMode(false);
    }

    if (editMode) return <UserAdminForm user={selectedUserProfile} cancelEdit={cancelEdit} />

    return (
        <>
             <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Users</Typography>
            </Box>
           
            <Box  sx={{marginBottom: 1}}>
                <Paper sx={{width: '500px'}}>
                <UserSearchInput />
                </Paper>
            </Box>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Username</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">First Name</TableCell>
                            <TableCell align="center">Last Name</TableCell>
                            <TableCell align="center">Gender</TableCell>
                            <TableCell align="center">Birthday</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userProfileLists.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">
                                    <Box display='flex' alignItems='center'>
                                        <img src={user.photo} alt={user.userName} style={{ height: 50, marginRight: 20 }} />
                                        <span>{user.userName}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">{user.email}</TableCell>
                                <TableCell align="center">{user.addressDto?.firstName}</TableCell>
                               
                                <TableCell align="center">{user.addressDto?.lastName}</TableCell>
                                <TableCell align="center">{user.gender}</TableCell>
                                <TableCell align="center">{user.dateOfBirth.toString()}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => handleSelectUserProfile(user)} startIcon={<Edit />} />                                    
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
                        onPageChange={(page: number) => dispatch(setUsersPageNumber({pageNumber: page}))} />
                </Box>
            }        
        </>
    )
}