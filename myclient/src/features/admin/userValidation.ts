import * as yup from 'yup';

export const userValidation = yup.object({
    email: yup.string().required(),
    userName: yup.string().required(),
    dateOfBirth: yup.string().required(),
    gender: yup.string().required(),
    addressDto: yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        street: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        zipcode: yup.string().required()
    })
})