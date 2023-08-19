import React from "react";
import Chart from "chart.js/auto";
import {Bar} from "react-chartjs-2";

const BarChart = (props) => {
    const labels = ["January", "February", "March", "April", "May", "June"];
    const data = {
        labels: labels,
        datasets: [{
            label: "My First dataset",
            data: [0, 10, 5, 2, 20, 30, 45],
        },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false
            },
            colors: {
                enabled: true,
                forceOverride: true
            }
        }
    }

    return (
        < div class="chart-box d-flex justify-content-center my-2" >
            < Bar data={props.data}
                options={
                    options
                }
            />
        </div >
    );
};

export default BarChart;
