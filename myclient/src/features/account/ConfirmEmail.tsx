import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function ConfirmEmail() {
  const { userId, token } = useParams<{ userId?: string; token?: string }>();
  const navigate = useNavigate();

  useEffect(() => {

    const confirmEmail = async () => {
        if(userId != undefined && token != undefined) {
          await agent.Account.confirmEmail(userId, encodeURIComponent(token)).then(response => {
            if (response.statusCode == 200) {
              toast.success(response.message);
              navigate('/login');
            } else {
              toast.error(response.message);
            }
          }).catch(error => {
            toast.error(error);
          });
        }
      };
  
      confirmEmail();

  }, [userId, token, navigate]) 

    return (
      <>
        { userId !== undefined && token !== undefined ? (
          <> </>
          ) : (
            <>  
            <Typography variant='h3'>
                  Register Confirmation
             </Typography>
             <br />
             <Box>
                Please check your email to confirm.
              </Box>
           </>
          ) }
      </>
    )
}