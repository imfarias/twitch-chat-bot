export default function getMobalyticsData(name: string, region: string) {
    return JSON.stringify({
        "operationName": "TftProfilePageQuery",
        "variables": {
            "filter": [
                {
                    "summonerName": name,
                    "region": region,
                    "set": process.env.MOBALYTICS_SET_API
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
            "withSummonerPerformance": false,
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
                "sha256Hash": "e260b17991a2698d76387796a5921f09043f4cedae08884843c918418c9dbbfd"
            }
        }
    });
}
