import { csv } from "d3";
import Plotly from "plotly.js-dist-min";
import * as COLOR from "./colors.js";

// import styles
import "../css/reset.css";
import "../css/main.scss";

// ---------------------------------------------------
// Helpers
// ---------------------------------------------------

/**
 * Get row from csv data (csv is read line wise).
 * @param rows json objects with values from csv
 * @param key json key of column
 * @returns column
 */
const unpack = (rows, key) => rows.map((row) => parseFloat(row[key]));

/**
 * Gets minimum value of two lists/array.
 * @param a first list/array
 * @param b second list/array
 * @returns minimum
 */
const getMin = (a, b) => Math.min(Math.min(...a), Math.min(...b));

/**
 * Gets maximal value of two lists/array.
 * @param a first list/array
 * @param b second list/array
 * @returns maximum
 */
const getMax = (a, b) => Math.max(Math.max(...a), Math.max(...b));

// ---------------------------------------------------
// Plotting
// ---------------------------------------------------

/**
 * Where the actual plotting happens.
 */
const initd3 = async () => {
  const mfit2 = await csv("data/mfit2.csv");
  const bfgs = await csv("data/wb97m_fit_nlopt_LBFGS_params.csv");

  const s8start = unpack(mfit2, "s8-start");
  const a1start = unpack(mfit2, "a1-start");
  const a2start = unpack(mfit2, "a2-start");
  const s8final = unpack(mfit2, "s8-final");
  const a1final = unpack(mfit2, "a1-final");
  const a2final = unpack(mfit2, "a2-final");

  const trace1 = {
    x: s8start,
    y: a1start,
    z: a2start,
    name: "initial",
    mode: "markers",
    marker: {
      size: 8,
      line: {
        color: COLOR.tubafblue,
        width: 0.5,
      },
      opacity: 0.8,
    },
    type: "scatter3d",
  };
  const trace2 = {
    x: s8final,
    y: a1final,
    z: a2final,
    name: "mfit2",
    mode: "markers",
    marker: {
      color: COLOR.tubafred,
      size: 6,
      symbol: "circle",
      line: {
        color: COLOR.gray,
        width: 1,
      },
      opacity: 0.8,
    },
    type: "scatter3d",
  };
  const trace3 = {
    x: unpack(bfgs, "s8-final"),
    y: unpack(bfgs, "a1-final"),
    z: unpack(bfgs, "a2-final"),
    name: "BFGS",
    mode: "markers",
    marker: {
      color: COLOR.tubaforange,
      size: 6,
      symbol: "circle",
      line: {
        color: COLOR.gray,
        width: 1,
      },
      opacity: 0.8,
    },
    type: "scatter3d",
  };
  const ref = {
    x: [0.78],
    y: [0.75],
    z: [2.71],
    name: "ref",
    mode: "markers",
    marker: {
      color: COLOR.black,
      size: 6,
      symbol: "circle",
      line: {
        color: "rgb(0, 0, 0)",
        width: 1,
      },
      opacity: 1,
    },
    type: "scatter3d",
  };

  const layout = {
    title: false,
    autosize: false,
    font: {
      family: "Computer Modern",
      size: 14,
      color: COLOR.black,
    },
    width: 1000,
    height: 900,
    margin: {
      l: 20,
      r: 20,
      b: 20,
      t: 20,
      pad: 5,
    },
    scene: {
      xaxis: {
        title: "s8",
        range: [getMin(s8start, s8final), getMax(s8start, s8final)],
      },
      yaxis: {
        title: "a1",
        range: [getMin(a1start, a1final), getMax(a1start, a1final)],
      },
      zaxis: {
        title: "a2",
        range: [getMin(a2start, a2final), getMax(a2start, a2final)],
      },
    },
  };
  const config = {
    responsive: true,
  };

  Plotly.newPlot("d4fit", [trace1, trace2, trace3, ref], layout, config);
};

// ---------------------------------------------------
// init
// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  initd3();
});
