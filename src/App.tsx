import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Card from "./Components/Card";
import NewsFeed from "./Components/NewsFeed";
import { Badge, Container, ListGroup, Navbar, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  
  const [newsArray, setnewsArray] = useState([]);
  const [ftableData, setftableData] = useState({});
  const [symbolslistdata, setsymbolData] = useState();
  const [fsymbol, setFsymbol] = useState("MSFT");
  const dummylist = [
    "MSFT",
    "AMZN",
    "AAPL",
    "NVDA",
    "GME",
    "INTC",
    "LIXT",
    "TSLA",
  ];
  const loadsymbolList = async () => {
    const options = {
      method: "GET",
      url: "https://mboum-finance.p.rapidapi.com/qu/quote",
      params: { symbol: dummylist.join() },
      headers: {
        "X-RapidAPI-Key": "fdb6b756c2msh3a7571b3a266046p192ec9jsn5a83d7e045e6",
        "X-RapidAPI-Host": "mboum-finance.p.rapidapi.com",
      },
    };
    let data = await axios(options);

    return data.data;
  };
  useEffect(() => {
    
    loadsymbolList().then((data) => {
      setsymbolData(data);
    });
  }, []);
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Text>Matt Harris LLC</Navbar.Text>
          <Navbar.Text>Signed in As: Matt Harris</Navbar.Text>
        </Container>
      </Navbar>
      <div id="cardfeed">
        <div className="symbolFeed">
          <ListGroup className="screen">
            {symbolslistdata &&
              dummylist.map((symbol: string, index: number) => {
                return (
                  <ListGroup.Item variant="primary" className="symbols">
                    <span
                      onClick={(e) => {
                        setFsymbol(e.target.textContent.slice(1));
                        console.log(import.meta.env.VITE_SOME_KEY);
                      }}
                      className="clickableSymbol"
                    >
                      <h6 className="symbolName">${symbol}</h6>
                    </span>
                    <div>
                      <b>{symbolslistdata[index]["longName"]}</b>
                    </div>
                    <div>
                      Market Cap : {symbolslistdata[index]["marketCap"]}
                    </div>

                    <span>
                      <Badge bg="primary" pill>
                        {symbolslistdata[index]["bid"]}
                      </Badge>
                    </span>
                  </ListGroup.Item>
                );
              })}
            <ListGroup.Item>
              <label id="addSymbol">Add a Symbol</label>
              <input></input>
            </ListGroup.Item>
          </ListGroup>
          <div>
            <Card
              className="screen"
              setnewsArray={setnewsArray}
              setftableData={setftableData}
              fsymbol={fsymbol}
              setFsymbol={setFsymbol}
            ></Card>
            <Table variant="secondary">
              <thead>
                <tr>
                  <th>#</th>
                  {ftableData.quarterly &&
                    ftableData.quarterly.map((quarter, index) => {
                      return <th key={index}>{quarter.date}</th>;
                    })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quarterly</td>
                  {ftableData.quarterly &&
                    ftableData.quarterly.map((quarter, index) => {
                      return <td key={index}>{quarter.actual.fmt}</td>;
                    })}
                </tr>
              </tbody>
            </Table>
            <Table variant="secondary">
              <thead>
                <tr>
                  <th>#</th>
                  {ftableData.yearly &&
                    ftableData.yearly.map((year, index) => {
                      return <th key={index}>{year.date}</th>;
                    })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Earnings</td>
                  {ftableData.yearly &&
                    ftableData.yearly.map((year, index) => {
                      return <td key={index}>{year.earnings.fmt}</td>;
                    })}
                </tr>
                <tr>
                  <td>Revenue</td>
                  {ftableData.yearly &&
                    ftableData.yearly.map((year, index) => {
                      return <td key={index}>{year.revenue.fmt}</td>;
                    })}
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <div className="tableandfeed">
          <Table
            variant="primary"
            id="bigTable"
            bordered
            hover
            striped
            responsive="sm"
          >
            <thead>
              <tr>
                <th>DataPoint</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {ftableData.data &&
                Object.keys(ftableData.data)
                  .slice(0, 15)
                  .map((property, index) => {
                    return (
                      <tr key={index}>
                        <th>
                          {property.replace(
                            property[0],
                            property[0].toUpperCase()
                          )}
                          :
                        </th>
                        <td>{ftableData.data[property]["fmt"]}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </Table>

          <NewsFeed newsArray={newsArray} className="screen"></NewsFeed>
          
        </div>
      </div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossorigin="anonymous"
      />
    </>
  );
}

export default App;
