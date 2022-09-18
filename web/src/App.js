import React, { useState, useEffect } from "react";
import "./App.css";

import axios from "axios";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = () => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
      )
      .then((res) => {
        setCoins(res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    let start = true;
    if (start) {
      fetchData();
    }
    const interval = setInterval(() => {
      fetchData();
    }, 600000);
    start = false;
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="coin-app">
      <div className="coin-search">
        <h1 className="coin-text">Crypto Tracker</h1>
        <form>
          <input
            className="coin-input"
            type="text"
            onChange={handleChange}
            placeholder="Search"
          />
        </form>
      </div>
      <div className="coin-table">
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 750, maxWidth: 700 }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell align="right" width={60}>
                  #
                </StyledTableCell>
                <StyledTableCell align="right" width={40}>
                  Name
                </StyledTableCell>
                <StyledTableCell align="right">Symbol</StyledTableCell>
                <StyledTableCell align="right">Total volume</StyledTableCell>
                <StyledTableCell align="right">Current price</StyledTableCell>
                <StyledTableCell align="right" width={120}>
                  Price change
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCoins
                .sort(function (a, b) {
                  return (
                    a.price_change_percentage_24h -
                    b.price_change_percentage_24h
                  );
                })
                .reverse()
                .map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      <img
                        src={row.image}
                        alt="crypto"
                        width="40"
                        height="40"
                      />
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.symbol.toUpperCase()}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      $ {row.total_volume}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      $ {row.current_price}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.price_change_percentage_24h < 0 ? (
                        <p className="coin-percent red">
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </p>
                      ) : (
                        <p className="coin-percent green">
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </p>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default App;
