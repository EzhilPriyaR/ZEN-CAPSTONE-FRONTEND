import React from "react";

const DataGrid = (props) => {

    return (
        <div class="container-lg">
            <table class="table table-striped table-hover table-bordered">
                <thead class="thead-dark text-center">
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Gender</th>
                        <th scope="col">Language</th>
                        <th scope="col">Major</th>
                        <th scope="col">All Time Best</th>
                        <th scope="col">All Time Worst</th>
                        <th scope="col">All Time Average</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((student, index) => {
                        let rowDat = []
                        rowDat.push(student['sno']);
                        rowDat.push(student['name']);
                        rowDat.push(student['gender']);
                        rowDat.push(student['language']);
                        rowDat.push(student['major']);
                        rowDat.push(student['allTimeHigh']);
                        rowDat.push(student['allTimeLow']);
                        rowDat.push(Math.round(student['allTimeAvg'] * 100) / 100);
                        return (
                            <tr key={index}>
                                {rowDat.map((col, index) => {
                                    return (<td key={index}>{col}</td>)
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );

}

export default DataGrid;