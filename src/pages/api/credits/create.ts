import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from "../../../utils/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {user, initialCredits} = req.body
    const {data, error} = await supabase
        .from("credits")
        .insert([
            {
                credits: initialCredits,
                user_id: user,
            },
        ])
        .select()
        .single();
    if (error) throw res.status(500).send(error);
    res.status(200).json(data)
}
