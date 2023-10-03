import { Edit } from "@mui/icons-material";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useUserProfiles from "../../app/hooks/useUserProfile";
import { useAppDispatch } from "../../app/store/configStore";
import { useState } from "react";
import { UserProfile } from "../../app/models/UserProfile";
import AppPagination from "../../app/components/AppPagination";
import { setUsersPageNumber } from "./adminSlice";
import UserSearchInput from "./UserSearchInput";
import UserForm from "./UserForm";
import { yyyymmdd } from "../../app/utility/utils";

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

    if (editMode) return <UserForm user={selectedUserProfile} cancelEdit={cancelEdit} />

    return (
        <>
             <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Users</Typography>
            </Box>
            <Box  sx={{margin: 1}}>
                <UserSearchInput />
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
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
                                <TableCell component="th" scope="row">
                                    {user.id}
                                </TableCell>
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
                                <TableCell align="center">{yyyymmdd(user.dateOfBirth)}</TableCell>
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