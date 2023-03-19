import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from "../../../utils/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        userId,
        fullName,
        email,
        phoneNumber,
        skills,
        qualifications,
        education,
        workExperience,
        personalInterests,
        achievements
    } = req.body
    const {data, error} = await supabase
        .from("profiles")
        .update(
            {
                full_name: fullName,
                email,
                phone_number: phoneNumber,
                skills,
                qualifications,
                education,
                work_experiences: workExperience,
                personal_interests: personalInterests,
                achievements
            },
        )
        .eq('id', userId)
    if (error) throw res.status(500).send(error);
    res.status(200).json('OK')
}
