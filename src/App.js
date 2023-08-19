import './App.css';

import { useState, useEffect } from "react";

import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import ScatterChart from "./components/ScatterChart";

import DataGrid from "./components/DataGrid";
import LoadingSpinner from "./components/LoadingSpinner";

import data from './data/scores.json';
import properties from "./properties.js";


function App() {
	// Utility Variables
	const allLanguagesList = ["Tamil", "French", "Hindi", "Sanskrit"]
	const allMajorsList = ["Biology", "Computer Science", "Commerce"]
	const allBiologyMinors = ["English", "Maths", "Physics", "Chemistry"]
	const allComputerMinors = ["English", "Maths", "Physics", "Chemistry"]
	const allCommerceMinors = ["English", "Maths", "Economics", "Accountancy"]
	const allTestTypes = [
		"Mid-Month Assesment - April 2023",
		"Month-End Assesment - April 2023",
		"Mid-Month Assesment - May 2023",
		"Month-End Assesment - May 2023",
		"Mid-Month Assesment - June 2023",
		"Quarterly Assesment - June 2023",
		"Mid-Month Assesment - July 2023",
		"Month-End Assesment - July 2023",
		"Mid-Month Assesment - August 2023",
		"Month-End Assesment - August 2023",
		"Mid-Month Assesment - September 2023",
		"Half Yearly Assesment - September 2023",
		"Mid-Month Assesment - October 2023",
		"Month-End Assesment - October 2023",
		"Mid-Month Assesment - November 2023",
		"Month-End Assesment - November 2023",
		"Mid-Month Assesment - December 2023",
		"Revison Test 1 - December 2023",
		"Mid-Month Assesment - January 2024",
		"Revison Test 2 - January 2024",
		"Mid-Month Assesment - February 2024",
		"Model Examination 1 - February 2024",
		"Model Examination 2 - March 2024",
		"Public Examination - March 2024"
	]

	// Fetch Control
	const [isFirstFetchDone, setIsFirstFetchDone] = useState(false);

	// Pie Charts data buffer
	const [pieChartsData, setPieChartsData] = useState([]);

	// Mutating Variables to be passed to Children as Props
	const [genderPieData, setGenderPieData] = useState({
		labels: ["Female", "Male"],
		datasets: [
			{
				label: "Gender",
				data: [51, 40],
			},
		]
	});
	const [languagePieData, setLanguagePieData] = useState({
		labels: ["Tamil", "French", "Hindi", "Sanskrit"],
		datasets: [
			{
				label: "Language",
				data: [20, 10, 47, 26],
			},
		]
	});
	const [majorPieData, setMajorPieData] = useState({
		labels: ["Biology", "Computer Science", "Commerce"],
		datasets: [
			{
				label: "Major",
				data: [10, 45, 72],
			},
		]
	});
	const [top7BarData, setTop7BarData] = useState({
		labels: ["Valavan", "Kabilan", "Tamarai", "Karki", "Vaali", "Vairamuthu", "Muthukumar"],
		datasets: [{
			label: "Top 7 Performers",
			data: [10, 55, 28, 20, 30, 45, 41],
		},
		],
	});
	const [perfSegBarData, setPerfSegBarData] = useState({
		labels: ["Above Average", "Average", "Below Average"],
		datasets: [{
			label: "Performance Class",
			data: [78, 50, 21],
		},
		],
	});
	const [allPerfScatterData, setAllPerfScatterData] = useState({
		labels: ["Biology", "Computer Science", "Commerce"],
		datasets: [{
			label: "All Performance",
			data: [{
				x: -10,
				y: 0
			}, {
				x: 0,
				y: 10
			}, {
				x: 10,
				y: 5
			}, {
				x: 0.5,
				y: 5.5
			}],
		},
		],
	});
	const [dataGridData, setDataGridData] = useState([]);

	// IsLoading UseState
	const [isLoading, setIsLoading] = useState(true);

	// Dropdown useState's
	const [currentGender, setCurrentGender] = useState("All");
	const [currentLanguage, setcurrentLanguage] = useState("All");
	const [currentMajor, setcurrentMajor] = useState("All");

	const [currentSubjectList, setcurrentSubjectList] = useState(['Overall', ...allLanguagesList, ...allMajorsList, ...allBiologyMinors, allCommerceMinors[2], allCommerceMinors[3]]);
	const [currentSubject, setcurrentSubject] = useState("Overall");
	const [currentTest, setcurrentTest] = useState(0);

	// Dropdown Event Handlers
	const handleGenderChange = (e) => {
		setCurrentGender(e.target.innerText)
	}

	const handleLanguageChange = (e) => {
		setcurrentLanguage(e.target.innerText)
		resetSubjectAndTest()
	}

	const handleMajorChange = (e) => {
		setcurrentMajor(e.target.innerText)
		resetSubjectAndTest()
	}

	const handleSubjectChange = (e) => {
		setcurrentSubject(e.target.innerText)
	}

	const handleTestChange = (e) => {
		setcurrentTest(allTestTypes.indexOf(e.target.innerText))
	}

	// Subject List Revision
	const reviseSubjectsList = () => {
		let tempArr = []
		tempArr.push('Overall');
		if (currentLanguage == "All") {
			tempArr.push(...allLanguagesList)
		} else {
			tempArr.push(currentLanguage)
		}
		if (currentMajor == "Biology" | currentMajor == "Computer Science") {
			tempArr.push(...allBiologyMinors)
			tempArr.push(currentMajor)
		} else if (currentMajor == "Commerce") {
			tempArr.push(...allCommerceMinors)
			tempArr.push(currentMajor)
		} else {
			tempArr.push(...allMajorsList)
			tempArr.push(...allBiologyMinors)
			tempArr.push(allCommerceMinors[2])
			tempArr.push(allCommerceMinors[3])
		}
		setcurrentSubjectList(tempArr)
	}

	// reset Subject & Test when Fiter Dropdown changes
	const resetSubjectAndTest = () => {
		setcurrentSubject("Overall")
	}

	// useEffect for dropdowns
	useEffect(() => {
		reviseSubjectsList()
	}, [currentLanguage, currentMajor]);

	// fetch routines
	const subsequentFetchData = () => {
		setIsLoading(true);
		Promise.all([
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.topSevenMetricPath.replace('$subject', currentSubject).replace('$testId', currentTest)
				+ properties.genderQueryParamKey + currentGender
				+ properties.languageQueryParamKey + currentLanguage
				+ properties.majorQueryParamKey + currentMajor),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.perfClassMetricPath.replace('$subject', currentSubject).replace('$testId', currentTest)
				+ properties.genderQueryParamKey + currentGender
				+ properties.languageQueryParamKey + currentLanguage
				+ properties.majorQueryParamKey + currentMajor),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.allStudentsScoresMetricPath.replace('$subject', currentSubject).replace('$testId', currentTest)
				+ properties.genderQueryParamKey + currentGender
				+ properties.languageQueryParamKey + currentLanguage
				+ properties.majorQueryParamKey + currentMajor),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.gridDataPath.replace('$subject', currentSubject)
				+ properties.genderQueryParamKey + currentGender
				+ properties.languageQueryParamKey + currentLanguage
				+ properties.majorQueryParamKey + currentMajor),
		])
			.then(([topSevenRes, perfSeggreRes, allPerfRes, gridRes]) =>
				Promise.all([topSevenRes.json(), perfSeggreRes.json(), allPerfRes.json(), gridRes.json()])
			)
			.then(([topSevenJsn, perfSeggreJsn, allPerfJsn, gridJsn]) => {
				updateCountPieCharts();
				updateDataBarCharts(topSevenJsn, perfSeggreJsn);
				updateDataScatterChart(allPerfJsn);
				updateGrid(gridJsn);
				setIsLoading(false);
			});
	}

	const firstFetchData = () => {
		setIsLoading(true);
		Promise.all([
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.genderCountPath),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.languageCountPath),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.majorCountPath),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.topSevenMetricPath.replace('$subject', currentSubject).replace('$testId', currentTest)
				+ properties.genderQueryParamKey + currentGender
				+ properties.languageQueryParamKey + currentLanguage
				+ properties.majorQueryParamKey + currentMajor),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.perfClassMetricPath.replace('$subject', currentSubject).replace('$testId', currentTest)
				+ properties.genderQueryParamKey + currentGender
				+ properties.languageQueryParamKey + currentLanguage
				+ properties.majorQueryParamKey + currentMajor),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.allStudentsScoresMetricPath.replace('$subject', currentSubject).replace('$testId', currentTest)
				+ properties.genderQueryParamKey + currentGender
				+ properties.languageQueryParamKey + currentLanguage
				+ properties.majorQueryParamKey + currentMajor),
			fetch(properties.backendHost
				+ properties.backendApiRoot
				+ properties.gridDataPath.replace('$subject', currentSubject)
				+ properties.genderQueryParamKey + currentGender
				+ properties.languageQueryParamKey + currentLanguage
				+ properties.majorQueryParamKey + currentMajor),
		])
			.then(([genderCountRes, languageCountRes, majorCountRes, topSevenRes, perfSeggreRes, allPerfRes, gridRes]) =>
				Promise.all([genderCountRes.json(), languageCountRes.json(), majorCountRes.json(), topSevenRes.json(), perfSeggreRes.json(), allPerfRes.json(), gridRes.json()])
			)
			.then(([genderCountJsn, languageCountJsn, majorCountJsn, topSevenJsn, perfSeggreJsn, allPerfJsn, gridJsn]) => {
				setupCountPieCharts(genderCountJsn, languageCountJsn, majorCountJsn);
				updateDataBarCharts(topSevenJsn, perfSeggreJsn);
				updateDataScatterChart(allPerfJsn);
				updateGrid(gridJsn);
				setIsLoading(false);
			});

	}

	// useEffect for fetch
	useEffect(() => {

		if (!isFirstFetchDone) {
			firstFetchData()
			setIsFirstFetchDone(true);
		} else {
			subsequentFetchData()
		}

	}, [currentGender, currentLanguage, currentMajor, currentSubject, currentTest]);


	// update subroutines
	const setupCountPieCharts = (gend, lang, majr) => {
		let tempArr = [gend, lang, majr];
		setPieChartsData(tempArr);

		// [{"_id":"Female","count":145},{"_id":"Male","count":155}]
		let tempObj = {};
		tempObj = genderPieData;
		tempObj.datasets[0].data = [];
		tempObj.datasets[0].data.push(gend.find(item => item._id == 'Female').count);
		tempObj.datasets[0].data.push(gend.find(item => item._id == 'Male').count);
		setGenderPieData(tempObj);

		// [{"_id":"Hindi","count":82},{"_id":"French","count":77},{"_id":"Sanskrit","count":68},{"_id":"Tamil","count":73}]
		// labels: ["Tamil", "French", "Hindi", "Sanskrit"],
		tempObj = languagePieData;
		tempObj.datasets[0].data = [];
		tempObj.datasets[0].data.push(lang.find(item => item._id == 'Tamil').count);
		tempObj.datasets[0].data.push(lang.find(item => item._id == 'French').count);
		tempObj.datasets[0].data.push(lang.find(item => item._id == 'Hindi').count);
		tempObj.datasets[0].data.push(lang.find(item => item._id == 'Sanskrit').count);
		setLanguagePieData(tempObj);

		// [{"_id":"Commerce","count":97},{"_id":"Computer","count":104},{"_id":"Biology","count":99}]
		//labels: ["Biology", "Computer Science", "Commerce"],
		tempObj = majorPieData;
		tempObj.datasets[0].data = [];
		tempObj.datasets[0].data.push(majr.find(item => item._id == 'Biology').count);
		tempObj.datasets[0].data.push(majr.find(item => item._id == 'Computer').count);
		tempObj.datasets[0].data.push(majr.find(item => item._id == 'Commerce').count);
		setMajorPieData(tempObj);
	};

	const updateCountPieCharts = () => {
		let tempObj = {};

		if (currentGender == 'All') {
			tempObj = genderPieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(pieChartsData[0].find(item => item._id == 'Female').count);
			tempObj.datasets[0].data.push(pieChartsData[0].find(item => item._id == 'Male').count);
			setGenderPieData(tempObj);
		}

		if (currentGender == 'Female') {
			tempObj = genderPieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(pieChartsData[0].find(item => item._id == 'Female').count);
			tempObj.datasets[0].data.push(0);
			setGenderPieData(tempObj);
		}

		if (currentGender == 'Male') {
			tempObj = genderPieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(pieChartsData[0].find(item => item._id == 'Male').count);
			setGenderPieData(tempObj);
		}

		if (currentLanguage == 'All') {
			tempObj = languagePieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(pieChartsData[1].find(item => item._id == 'Tamil').count);
			tempObj.datasets[0].data.push(pieChartsData[1].find(item => item._id == 'French').count);
			tempObj.datasets[0].data.push(pieChartsData[1].find(item => item._id == 'Hindi').count);
			tempObj.datasets[0].data.push(pieChartsData[1].find(item => item._id == 'Sanskrit').count);
			setLanguagePieData(tempObj);
		}

		if (currentLanguage == 'Tamil') {
			tempObj = languagePieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(pieChartsData[1].find(item => item._id == 'Tamil').count);
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(0);
			setLanguagePieData(tempObj);
		}

		if (currentLanguage == 'French') {
			tempObj = languagePieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(pieChartsData[1].find(item => item._id == 'French').count);
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(0);
			setLanguagePieData(tempObj);
		}

		if (currentLanguage == 'Hindi') {
			tempObj = languagePieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(pieChartsData[1].find(item => item._id == 'Hindi').count);
			tempObj.datasets[0].data.push(0);
			setLanguagePieData(tempObj);
		}

		if (currentLanguage == 'Sanskrit') {
			tempObj = languagePieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(pieChartsData[1].find(item => item._id == 'Sanskrit').count);
			setLanguagePieData(tempObj);
		}

		if (currentMajor == 'All') {
			tempObj = majorPieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(pieChartsData[2].find(item => item._id == 'Biology').count);
			tempObj.datasets[0].data.push(pieChartsData[2].find(item => item._id == 'Computer').count);
			tempObj.datasets[0].data.push(pieChartsData[2].find(item => item._id == 'Commerce').count);
			setMajorPieData(tempObj);
		}

		if (currentMajor == 'Biology') {
			tempObj = majorPieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(pieChartsData[2].find(item => item._id == 'Biology').count);
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(0);
			setMajorPieData(tempObj);
		}

		if (currentMajor == 'Computer') {
			tempObj = majorPieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(pieChartsData[2].find(item => item._id == 'Computer').count);
			tempObj.datasets[0].data.push(0);
			setMajorPieData(tempObj);
		}

		if (currentMajor == 'Commerce') {
			tempObj = majorPieData;
			tempObj.datasets[0].data = [];
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(0);
			tempObj.datasets[0].data.push(pieChartsData[2].find(item => item._id == 'Commerce').count);
			setMajorPieData(tempObj);
		}

	};

	const updateDataBarCharts = (topSvn, perfSeg) => {
		let tempObj = {};

		// [{"_id":"64deeb35c33adb6d267cae56","id":20,"name":"Silva Orridge","gender":"Female","language":"Tamil","major":"Computer","singleTestScore":198}]
		if (topSvn.length != 0) {
			tempObj = top7BarData;
			tempObj.labels = [];
			tempObj.datasets[0].data = [];
			topSvn.forEach(element => {
				tempObj.labels.push(element.name);
				tempObj.datasets[0].data.push(element.singleTestScore);
			});
			setTop7BarData(tempObj);
		}

		//[{"_id":0,"count":10},{"_id":900,"count":54},{"_id":1020,"count":9}]
		if (perfSeg.length != 0) {
			tempObj = perfSegBarData;
			tempObj.datasets[0].data = [];
			perfSeg.forEach(element => {
				tempObj.datasets[0].data.push(element.count);
			});
			setPerfSegBarData(tempObj);
		}

	};

	const updateDataScatterChart = (allperf) => {
		let tempObj = {};
		// [{"_id":"64deeb35c33adb6d267cae7b","id":57,"name":"Burch Levecque","gender":"Male","language":"French","major":"Commerce","singleTestScore":946}]
		if (allperf.length != 0) {
			tempObj = allPerfScatterData;
			tempObj.labels = [];
			tempObj.datasets[0].data = [];
			allperf.forEach(element => {
				tempObj.labels.push(element.name);
				tempObj.datasets[0].data.push({ x: element.id, y: element.singleTestScore });
			});
			setAllPerfScatterData(tempObj);
		}
	};

	const updateGrid = (datGrid) => {
		if (datGrid.length != 0) {
			setDataGridData(datGrid);
		}
	};

	// JSX Split
	const mainContent = (
		<div>
			{ /* Dashboard Row 1 - Filter Charts*/}
			<div class="container-lg">
				<div class="row">
					<div class="col">
						<div class="card card-config my-2 p-2 d-flex justify-content-between">
							<PieChart data={genderPieData} />
							<div class="dropdown-center d-flex justify-content-between">
								<button class="btn btn-primary dropdown-toggle my-2 mx-auto" type="button" data-bs-toggle="dropdown">
									{currentGender}
								</button>
								<ul class="dropdown-menu">
									<li class="dropdown-item" onClick={handleGenderChange}>All</li>
									<li class="dropdown-item" onClick={handleGenderChange}>Female</li>
									<li class="dropdown-item" onClick={handleGenderChange}>Male</li>
								</ul>
							</div>
						</div>
					</div>

					<div class="col">
						<div class="card card-config my-2 p-2 d-flex justify-content-between">
							<PieChart data={languagePieData} />
							<div class="dropdown-center d-flex justify-content-between">
								<button class="btn btn-primary dropdown-toggle my-2 mx-auto" type="button" data-bs-toggle="dropdown">
									{currentLanguage}
								</button>
								<ul class="dropdown-menu">
									<li class="dropdown-item" onClick={handleLanguageChange}>All</li>
									<li class="dropdown-item" onClick={handleLanguageChange}>Tamil</li>
									<li class="dropdown-item" onClick={handleLanguageChange}>French</li>
									<li class="dropdown-item" onClick={handleLanguageChange}>Hindi</li>
									<li class="dropdown-item" onClick={handleLanguageChange}>Sanskrit</li>
								</ul>
							</div>
						</div>
					</div>

					<div class="col">
						<div class="card card-config my-2 p-2 d-flex justify-content-between">
							<PieChart data={majorPieData} />
							<div class="dropdown-center d-flex justify-content-between">
								<button class="btn btn-primary dropdown-toggle my-2 mx-auto" type="button" data-bs-toggle="dropdown">
									{currentMajor}
								</button>
								<ul class="dropdown-menu">
									<li class="dropdown-item" onClick={handleMajorChange}>All</li>
									<li class="dropdown-item" onClick={handleMajorChange}>Biology</li>
									<li class="dropdown-item" onClick={handleMajorChange}>Computer</li>
									<li class="dropdown-item" onClick={handleMajorChange}>Commerce</li>
								</ul>
							</div>
						</div>
					</div>

				</div>
			</div>

			{ /* Dashboard Row 2 Subject & Test */}
			<div class="container-lg d-flex justify-content-start">
				<div class="dropdown-center d-flex justify-content-between mx-2">
					<button class="btn btn-primary dropdown-toggle my-2 mx-auto" type="button" data-bs-toggle="dropdown">
						{currentSubject}
					</button>
					<ul class="dropdown-menu">
						{currentSubjectList.map((subject, index) => {
							return (
								<li class="dropdown-item" key={index} onClick={handleSubjectChange}>{subject}</li>
							)
						})}
					</ul>
				</div>

				<div class="dropdown-center d-flex justify-content-between mx-2">
					<button class="btn btn-primary dropdown-toggle my-2 mx-auto" type="button" data-bs-toggle="dropdown">
						{allTestTypes[currentTest]}
					</button>
					<ul class="dropdown-menu">
						{allTestTypes.map((testType, index) => {
							return (
								<li class="dropdown-item" key={index} onClick={handleTestChange}>{testType}</li>
							)
						})}
					</ul>
				</div>
			</div>

			{ /* Dashboard Row 3 - Data Charts */}
			<div class="container-lg">
				<div class="row">
					<div class="col">
						<div class="card card-config my-2 p-2 d-flex justify-content-center">
							<BarChart data={top7BarData} />
							<div class="text-center my-2">
								Top 7 Performers
							</div>
						</div>
					</div>

					<div class="col">
						<div class="card card-config my-2 p-2 d-flex justify-content-center">
							<BarChart data={perfSegBarData} />
							<div class="text-center my-2">
								Performanace Seggregation
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col">
						<div class="card card-config my-2 p-2 d-flex justify-content-center">
							<ScatterChart data={allPerfScatterData} />
							<div class="text-center my-2">
								All Students Performance
							</div>
						</div>
					</div>
				</div>

			</div>

			{ /* Dashboard Row 4 - Table Title */}
			<div class="container-lg d-flex justify-content-start">
				<div class="text-center my-2">
					<h2>Students List</h2>
				</div>
			</div>

			{ /* Dashboard Row 5 - Table */}
			<DataGrid data={dataGridData} />
		</div>
	);

	// Actual Render
	return (
		<>
			{ /* Minimal Header */}
			<nav class="navbar bg-body-tertiary">
				<div class="container-lg">
					<a class="navbar-brand" href="#">
						<img src="/logo192.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top mx-2" />
						Interactive Score Card
					</a>
				</div>
			</nav>

			{isLoading ? <LoadingSpinner /> : mainContent}																																	{ /* Table */}
		</>
	);
}

export default App;
