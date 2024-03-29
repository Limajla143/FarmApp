import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configStore";
import SignedInMenu from "./SignedInMenu";
import { ShoppingCart } from "@mui/icons-material";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

const defaultLinks = [
    {title: 'Home', path: '/'},
    {title: 'About', path: '/about'},
    {title: 'Contacts', path: '/contacts'},
]


const midLinks = [
    {title: 'Products', path: '/products'},
]

const midLinksForModerator = [
    {title: 'Products', path: '/products'},
    {title: 'Inventory', path: '/inventory'},
    {title: 'AgriTypes', path: '/agritypes'},
]

const midLinksForAdmin = [
    {title: 'Products', path: '/products'},
    {title: 'Inventory', path: '/inventory'},
    {title: 'AgriTypes', path: '/agritypes'},
    {title: 'Users', path: '/users'}
]

const rightLinks = [
    {title: 'login', path: '/login'}
]

const navStyles = {
    color: 'inherit', 
    textDecoration: 'none',
    typography: 'h6', 
    '&:hover': {color: 'grey.500'},
    '&.active' : {color: 'text.secondary'}    
}

export default function Header({darkMode, handleThemeChange}: Props) {
    const {basket} = useAppSelector(state => state.basket);
    const {user} = useAppSelector(state => state.account);
    const itemCount = basket ? basket?.items.reduce((sum, item) => sum + item.quantity, 0) : 0; 
    return (
        <AppBar position='static' sx={{mb: 4}} >
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', overflowX: 'auto'}}>

                <Box display='flex' alignItems='center'>
                <Typography variant='h6' component={NavLink} to='/'
                    sx={navStyles}>
                    MyFARM
                </Typography>
                <Switch checked={darkMode} onChange={handleThemeChange}/>
                </Box>

                <List sx={{display: 'flex'}}>
                    {
                        defaultLinks.map(({title, path}) => (
                            <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title.toUpperCase()}
                          </ListItem>
                        ))
                    }
                    { user && user.role?.includes('Admin') && user.role?.includes('Moderator') && user.role?.includes('Member') &&
                         midLinksForAdmin.map(({title, path}) => (
                            <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title.toUpperCase()}
                          </ListItem>
                        ))
                    }

                     { user && !user.role?.includes('Admin') && user.role?.includes('Moderator') && user.role?.includes('Member') && 
                         midLinksForModerator.map(({title, path}) => (
                            <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}>
                            {title.toUpperCase()}
                          </ListItem>
                        ))
                      }

                      {user && !user.role?.includes('Admin') && !user.role?.includes('Moderator') && user.role?.includes('Member') &&
                        midLinks.map(({title, path}) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title.toUpperCase()}
                              </ListItem>
                        ))
                      }
                </List>


                <Box display='flex' alignItems='center'>
                {user ? (
                     <IconButton component={Link} to='/basket' size='large' sx={{color: 'inherit'}}>
                        <Badge badgeContent={itemCount} color="secondary"> 
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                ) : (
                    <></>
                ) }
                
                
                {user ? (
                    <SignedInMenu />
                ) : (
                    <List sx={{display: 'flex'}}>
                    {rightLinks.map(({title, path}) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title.toUpperCase()}
                          </ListItem>
                        ))}
                    </List>
                )}                
                </Box>
            </Toolbar>
        </AppBar>
    )
}