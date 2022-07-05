// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import fetch from 'node-fetch';
import getMobalyticsData from "../../public/handler/mobalyticsData";
import updateMobalyticsData from "../../public/handler/updateMobalyticsData";

function validaDadosPreenchidos(user: string | string[], region: string | string[]) {
    let userFinal = user.toString();
    let regionFinal = region.toString().toUpperCase();

    const regionList = [
        'BR',
        'NA'
    ];

    if (!userFinal) {
        throw new Error('User param is missing');
    }

    if (!regionFinal || !regionList.includes(regionFinal)) {
        throw new Error(`Region param is missing, available regions: ${regionList}`);
    }

    return {userFinal, regionFinal};
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const {user, region} = req.query;

    try {
        let {userFinal, regionFinal} = validaDadosPreenchidos(user, region);

        const apiUrl = process.env.TFT_API ?? '';

        const dataUpdate = await fetch(apiUrl, {
            headers: {
                'content-type': 'application/json'
            }, method: 'POST', body: updateMobalyticsData(userFinal, regionFinal)
        });

        const apiDataUpdate: any = await dataUpdate.json();

        let isUpdating = false;

        if (!apiDataUpdate.data.tft) {
            isUpdating = true;
        }

        const data = await fetch(apiUrl, {
            headers: {
                'content-type': 'application/json'
            }, method: 'POST', body: getMobalyticsData(userFinal, regionFinal)
        });

        const apiData: any = await data.json();

        if (!apiData.data || apiData.data.tft.profile[0].profile.summonerInfo) {
            throw new Error(`Cant retrieve user data: ${userFinal}`);
        }

        const userRank = apiData.data.tft.profile[0].profile.rank;

        const tier = userRank.tier.charAt(0).toUpperCase() + userRank.tier.slice(1).toLowerCase();

        const performanceRankedList = apiData.data.tft.profile[0].profile.summonerPerformance.filter((performance: any) => {
            return performance.performance.queue === "RANKED";
        });

        const lp = performanceRankedList ? `${performanceRankedList[0].performance.lp} LP` : '0 LP';

        const isUpdatingText = isUpdating ? ' (ATUALIZANDO DADOS) ' : '';

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

        res.status(200).json(`${user} - TFT: ${tier} ${userRank.division} (${lp})${isUpdatingText}`);

    } catch (e: any) {
        res.status(400).json({success: false, message: e.message});
    }

}
