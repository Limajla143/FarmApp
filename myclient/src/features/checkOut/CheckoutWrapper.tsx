import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import LoadingComponent from "../../app/layout/Loading";

const stripePromise = loadStripe('pk_test_51MYsW4L9cMDwJt2vwb0wYTIWJHpfFy5rmUPMwTy96DvNHNWWWRrYIDxTuPNCxGDV7gWLdutOaFV0fix7Sx6BV7zf00zA9xoVLr');

export default function CheckoutWrapper() {
    const {user} = useAppSelector(state => state.account);
    const {basket} = useAppSelector(state => state.basket);    
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentIntent(user?.username!, basket?.deliveryMethodId)
                .then(basket => dispatch(setBasket(basket)))
                .catch(error => console.log(error))
                .finally(() => setLoading(false))
    }, [dispatch]);

    if(loading) return <LoadingComponent message="Loading Checkout..." />

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}