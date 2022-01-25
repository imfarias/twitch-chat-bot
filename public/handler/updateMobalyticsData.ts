export default function updateMobalyticsData(name: string, region: string) {
    return JSON.stringify({
        "operationName": "TftProfileRefreshMutation",
        "variables": {"input": {"inputs": [{"summonerName": name, "region": region}]}},
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "38bf778b7fdab22e824ccc2d1ae432670f0c1be680f2bbfc672e70b73421610b"
            }
        }
    });
}
