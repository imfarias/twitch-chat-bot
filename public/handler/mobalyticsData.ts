export default function getMobalyticsData(name: string, region: string) {
    return JSON.stringify({
        "operationName": "TftProfilePageQuery",
        "variables": {
            "filter": [
                {
                    "summonerName": name,
                    "region": region,
                    "set": process.env.TFT_SET_API
                }
            ],
            "filterStats": {
                "queue": null,
                "synergy": null,
                "champion": null,
                "patch": null,
                "dateFrom": null
            },
            "filterProgressTracking": {
                "queue": "RANKED"
            },
            "summonerProgressPerPageCount": 50,
            "filterPerformance": null,
            "filterRecentActivity": "2021-07-26T12:23:41.694Z",
            "statsOverviewLimit": 5,
            "statsSectionLimit": 20,
            "withSummonerInfo": false,
            "withSummonerPerformance": true,
            "withSummonerProgressTracking": false,
            "withOverviewSection": false,
            "withTeamCompsSection": false,
            "withStatsSection": false,
            "withLpGainsSection": false,
            "lpGainsPage": 1,
            "teamCompsArchetypeSize": 20
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "90e8844a1548f7a89351044039fab89507eaa03362ff05ec62cbb23567864245"
            }
        }
    });
}
