// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import fetch from 'node-fetch';
import getMobalyticsData from "../../public/handler/mobalyticsData";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const {user, region} = req.query;

    let userFinal = user.toString();
    let regionFinal = region.toString().toUpperCase();

    const regionList = [
        'BR'
    ];

    if (!userFinal) {
        res.status(400).json({success: false, message: 'User param is missing'});
    }

    if (!regionFinal || !regionList.includes(regionFinal)) {
        res.status(400).json({success: false, message: `Region param is missing, available regions: ${regionList}`});
    }

    const mobalyticsUrl = process.env.MOBALYTICS_API ?? '';

    console.log(getMobalyticsData(userFinal, regionFinal));
    const data = await fetch(mobalyticsUrl, {
        headers: {
            'content-type': 'application/json'
        }, method: 'POST', body: getMobalyticsData(userFinal, regionFinal)
    });

    const apiData : any = await data.json();

    if(!apiData.data || apiData.data.tft.profile[0].profile.summonerInfo) {
        res.status(400).json({success: false, message: `Cant retrieve user data: ${userFinal}`});
    }

    const userRank = apiData.data.tft.profile[0].profile.rank;

    res.status(200).send(`${user} - TFT: ${userRank.tier} ${userRank.division}`);
}
