import React from "react";
import { render } from "react-dom";
// Import Highcharts
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { todos } from "./data";

export default function Chart({ data }) {
  const options = {
    chart: {
      zoomType: "x",
      width: 1000,
    },
    credits: {
      enabled: false,
    },

    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "daily todos",
      },
    },
    title: {
      text: "",
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
    series: [...todos].map(([name, _]) => ({
      type: "area",
      name,
      //color: "blue",
      data: data
        .filter((item) => item.name === name)
        .map((item) => ({
          x: Date.UTC(
            new Date(item.timestamp).getFullYear(),
            new Date(item.timestamp).getMonth(),
            new Date(item.timestamp).getDate()
          ),
          y: item.score,
        })),
    })),
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
