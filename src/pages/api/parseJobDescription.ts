import type {NextApiRequest, NextApiResponse} from 'next'
import axios from "axios";
import * as cheerio from 'cheerio';

type Data = {
    jobDescription: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // right format https://www.linkedin.com/jobs/view/3518654469/
    const linkedInUrl = req.body.linkedInUrl
    // learned from https://nubela.co/proxycurl/docs#jobs-api-job-profile-endpoint
    //const response = await fetch(linkedInUrl)
    // scraping source: https://www.scrapingbee.com/blog/web-scraping-javascript/

    const htmlData = await axios
        .get(linkedInUrl)
        .then(res => res.data)
    const $ = cheerio.load(htmlData);
    const descriptionText = $('.description__text.description__text--rich').text();
    const cleanedDescriptionText = descriptionText.trim().split(/\r?\n/)[0]
    res.status(200).json({jobDescription: cleanedDescriptionText})
}
