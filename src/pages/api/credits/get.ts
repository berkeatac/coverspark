import type {NextApiRequest, NextApiResponse} from 'next'
import {supabase} from "../../../utils/supabase";
import {PostgrestError} from "@supabase/supabase-js";

type Data = {
    credits: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | PostgrestError>
) {
    const {user} = req.body
    const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq("user_id", user)
        .single();

    if (error) throw res.status(500).send(error);
    res.status(200).json({credits: data.credits})
}
