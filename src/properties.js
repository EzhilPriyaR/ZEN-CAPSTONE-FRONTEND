const properties = {
    backendHost: "https://interactive-score.onrender.com",
    backendApiRoot: "/api",

    genderQueryParamKey: "?gender=",
    languageQueryParamKey: "&language=",
    majorQueryParamKey: "&major=",

    genderCountPath: "/count/gender",
    languageCountPath: "/count/language",
    majorCountPath: "/count/major",

    topSevenMetricPath: "/metric/topSeven/$subject/$testId",
    perfClassMetricPath: "/metric/performanceClass/$subject/$testId",
    allStudentsScoresMetricPath: "/metric/allStudentsScores/$subject/$testId",

    gridDataPath: "/gridData/$subject"

};

export default properties;
