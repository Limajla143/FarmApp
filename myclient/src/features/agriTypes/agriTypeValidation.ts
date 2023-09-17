import * as yup from 'yup';

export const agriTypeSchema = yup.object({
    name: yup.string().required()
})
