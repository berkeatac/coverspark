import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from "../../../utils/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {user, incrementValue} = req.body
    const {data, error} = await supabase.rpc('increment', {
        p_user_id: user, p_increment_num: incrementValue
    })
    if (error) throw res.status(500).send(error);
    return res.status(200).send('OK')
}
