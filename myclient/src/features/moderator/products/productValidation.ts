import * as yup from 'yup';

export const prodValidationSchema = yup.object({
    name: yup.string().required(),
    agriType: yup.string().required(),
    price: yup.number().required().moreThan(1),
    salesTax: yup.number().required().lessThan(101),
    quantity: yup.number().required().min(0),
    description: yup.string().required(),
    file: yup.mixed().when('pictureUrl', {
        is: (value: string) => !value,
        then: yup.mixed().required('Please provide an image')
    })
})
