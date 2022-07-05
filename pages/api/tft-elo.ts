// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import fetch from 'node-fetch';
import {getApiData} from "../../public/handler/api-fetch-tft";

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

    switch (regionFinal) {
        default:
            regionFinal = 'br1';
            break;
    }

    return {userFinal, regionFinal};
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const {user, region, disableLastPositions} = req.query;

    try {
        let {userFinal, apiData} = await getApiData(`${user}`, `${region}`);

        if (!apiData.player_info || !apiData?.player_info?.queueRanks?.length) {
            throw new Error(`Cant retrieve user data: ${userFinal}`);
        }

        const queueRanked = apiData.player_info.queueRanks.find((queue: any) => {
            return queue.queueType === 'RANKED_TFT';
        })

        const tier = queueRanked.tier.charAt(0).toUpperCase() + queueRanked.tier.slice(1).toLowerCase();

        const lp = queueRanked ? `${queueRanked.leaguePoints} LP` : '0 LP';

        const lastPlacements = apiData.matches_overview.placements.splice(0, 5);

        const placementString = lastPlacements.join(', ');

        const finalPlacementString = !!disableLastPositions === true ? '' : ` Last Positions: [${placementString}]`;

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

        res.status(200).json(`${user}: ${tier} ${queueRanked.rank} (${lp})${finalPlacementString}`);

    } catch (e: any) {
        res.status(400).json({success: false, message: e.message});
    }

}
