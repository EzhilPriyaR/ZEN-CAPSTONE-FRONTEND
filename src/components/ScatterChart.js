import React from "react";
import { Scatter } from 'react-chartjs-2';

const ScatterChart = (props) => {
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

    const labels = ["January", "February", "March", "April", "May", "June"];
    const data = {
        labels: labels,
        datasets: [{
            label: "My First dataset",
            data: [0, 10, 5, 2, 20, 30, 45],
        },
        ],
    };
    
    return (
        < div class="chart-box d-flex justify-content-center my-2" >
            < Scatter data={props.data}
                options={
                    options
                }
            />
        </div >
    );
}

export default ScatterChart;