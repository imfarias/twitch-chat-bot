import fetch from "node-fetch";

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

export async function getApiData(user: string, region: string) {
    let {userFinal, regionFinal} = validaDadosPreenchidos(user, region);

    let apiUrl = process.env.TFT_API ?? '';

    apiUrl = `${apiUrl}/${regionFinal}/${userFinal}/70/50`;

    const data = await fetch(apiUrl, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'GET'
    });

    const apiData: any = await data.json();
    return {userFinal, apiData};
}
