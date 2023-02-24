import React, { useEffect, useState } from "react";
import "./Card.css";
import axios from "axios";
import Chart from "react-apexcharts";
import { Badge, Button } from "react-bootstrap";

const Card = (props: any) => {
  let recent;
  let inputval: string;

  const [fseries, setfSeries] = useState([]);
  const [faxis, setfaxis] = useState([]);

  const [recentClose, setRecentClose] = useState(0);

  let options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: faxis,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.5,
      },
    },
  };
  let series = [
    {
      name: "series-1",
      data: fseries,
    },
  ];

  const getdata_news = async () => {
    const options = {
      method: "GET",
      url: "https://mboum-finance.p.rapidapi.com/ne/news/",
      params: { symbol: props.fsymbol },
      headers: {
        "X-RapidAPI-Key": "fdb6b756c2msh3a7571b3a266046p192ec9jsn5a83d7e045e6",
        "X-RapidAPI-Host": "mboum-finance.p.rapidapi.com",
      },
    };

    let news = await (await axios(options)).data;

    props.setnewsArray(news);
  };
  const getdata_Day = async () => {
    const options = {
      method: "GET",
      url: "https://alpha-vantage.p.rapidapi.com/query",
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: props.fsymbol,
        outputsize: "compact",
        datatype: "json",
      },
      headers: {
        "X-RapidAPI-Key": "29e93fe5b0msh920532c17ebcea4p1574ffjsne1de7288c870",
        "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
      },
    };
    const data = await axios(options);
    recent = Object.keys(data.data["Time Series (Daily)"])[0];

    setRecentClose(data.data["Time Series (Daily)"][recent]["4. close"]);
    setfaxis(
      Object.keys(data.data["Time Series (Daily)"])
        .slice(0, 7)
        .reverse()
        .map((time: string) => {
          return time.slice(-5);
        })
    );
    setfSeries(
      Object.values(data.data["Time Series (Daily)"])
        .slice(0, 7)
        .reverse()
        .map((equity: any) => {
          return equity["4. close"];
        })
    );
  };
  const get_data_table = async () => {
    const options = {
      method: "GET",
      url: "https://mboum-finance.p.rapidapi.com/mo/module/",
      params: {
        symbol: props.fsymbol,
        module: "asset-profile,financial-data,earnings",
      },
      headers: {
        "X-RapidAPI-Key": "fdb6b756c2msh3a7571b3a266046p192ec9jsn5a83d7e045e6",
        "X-RapidAPI-Host": "mboum-finance.p.rapidapi.com",
      },
    };
    let tabledata = await axios(options);
    let earnings_quarterly = tabledata.data.earnings.earningsChart.quarterly;
    let earnings_yearly = tabledata.data.earnings.financialsChart.yearly;
    let financialData = tabledata.data.financialData;
    return {
      quarterly: earnings_quarterly,
      yearly: earnings_yearly,
      data: financialData,
      assetProfile: tabledata.data.assetProfile,
    };
  };
  useEffect(() => {
    getdata_Day();
    getdata_news();
    get_data_table().then((fd) => {
      props.setftableData(fd);
      console.log(fd.assetProfile);
    });
  }, [props.fsymbol]);

  return (
    <div id="toplevel">
      <Badge>
        <h2>${props.fsymbol}</h2>
      </Badge>

      <div>
        <label>{recentClose}</label>
      </div>
      <Chart options={options} series={series} type="line" width="500"></Chart>

      <form id="actualForm">
        <label className="inputBox">Symbol</label>
        <input
          value={inputval}
          className="inputBox"
          onChange={(e) => {
            inputval = e.target.value;
          }}
        ></input>
        <Button
          id="submitButton"
          variant="secondary"
          className="inputBox"
          onClick={(e) => {
            e.preventDefault();
            props.setFsymbol(inputval);
          }}
        >
          ClickMe
        </Button>
      </form>
    </div>
  );
};
export default Card;
