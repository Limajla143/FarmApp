import * as yup from 'yup';

export const userAdminValidation = yup.object({
    email: yup.string().required(),
    userName: yup.string().required(),
    dateOfBirth: yup.string().required(),
    gender: yup.string().required(),
    photo: yup.mixed().when('file', {
        is: (value: string) => !value,
        then: yup.mixed().required('Please provide an image')
    }),
    mobileNumber: yup.string().required(),
    addressDto: yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        street: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        zipcode: yup.string().required()
    })
})