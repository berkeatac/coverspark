import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from "../../../utils/supabase";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {userId} = req.query
    let {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq("id", userId)
        .single();
    if (error) throw res.status(500).send(error);
    res.status(200).json(data)
}
