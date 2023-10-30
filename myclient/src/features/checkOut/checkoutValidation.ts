import * as yup from 'yup';

export const validationSchema = [
    yup.object({
        firstName: yup.string().required('first name is required'),
        lastName: yup.string().required('last name is required'),
        street: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        zipcode: yup.string().required()
    }),
    yup.object(),
    yup.object({
        nameOnCard: yup.string().required()
    })
]