// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import fetch from 'node-fetch';

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
    const {user, region} = req.query;

    try {
        let {userFinal, regionFinal} = validaDadosPreenchidos(user, region);

        let apiUrl = process.env.TFT_API ?? '';

        apiUrl = `${apiUrl}?player=${userFinal}&region=${regionFinal}`;

        const data = await fetch(apiUrl, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'GET'
        });

        const apiData: any = await data.json();

        if (!apiData.player_info || !apiData?.player_info?.queueRanks?.length) {
            throw new Error(`Cant retrieve user data: ${userFinal}`);
        }

        const queueRanked = apiData.player_info.queueRanks.find((queue: any) => {
            return queue.queueType === 'RANKED_TFT';
        })

        const tier = queueRanked.tier.charAt(0).toUpperCase() + queueRanked.tier.slice(1).toLowerCase();

        const lp = queueRanked ? `${queueRanked.leaguePoints} LP` : '0 LP';

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

        res.status(200).json(`${user} - TFT: ${tier} ${queueRanked.rank} (${lp})`);

    } catch (e: any) {
        res.status(400).json({success: false, message: e.message});
    }

}
