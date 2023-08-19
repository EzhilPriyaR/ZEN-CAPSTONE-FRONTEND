import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import '../App.css';

const PieChart = (props) => {
  const labels = ["January", "February", "March", "April", "May", "June"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ]
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
    <div class="chart-box mx-auto d-flex justify-content-between my-2">
      <Pie data={props.data} options={options} />
    </div>
  );
};
export default PieChart;