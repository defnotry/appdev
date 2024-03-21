import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminManageUsers from "./AdminManageUsers";
import Sidebar from './AdminSidebar';
import { Breadcrumbs } from "./components/Breadcrumbs";
import BACKEND_URL from "../config";


const HomePage = () => {
  const [logoutDisabled, setLogoutDisabled] = useState(false);
  const [timeInterval, setTimeInterval] = useState('months');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLogoutDisabled(true);
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.post(
        `${BACKEND_URL}/api/auth/logout`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('jwt_token');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutDisabled(false);
    }
  };

  const handleIntervalChange = (event) => {
    setTimeInterval(event.target.value);
  };

  // Chart data and options
  const downloadsDataMonthly = [1000000, 1500000, 500000, 1800000, 700000, 62000, 320000, 180000, 14000, 55600, 9000, 43000];
  const downloadsLabelsMonthly = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const downloadsDataYearly = [4000000, 12000000, 6180000];
  const downloadsLabelsYearly = ['2022', '2023', '2024'];

  const downloadsHighestIndexMonthly = downloadsDataMonthly.indexOf(Math.max(...downloadsDataMonthly));
  const downloadsHighestLabelMonthly = downloadsLabelsMonthly[downloadsHighestIndexMonthly];
  const totalDownloadsMonthly = downloadsDataMonthly.reduce((acc, cur) => acc + cur, 0);

  const downloadsHighestIndexYearly = downloadsDataYearly.indexOf(Math.max(...downloadsDataYearly));
  const downloadsHighestLabelYearly = downloadsLabelsYearly[downloadsHighestIndexYearly];
  const totalDownloadsYearly = downloadsDataYearly.reduce((acc, cur) => acc + cur, 0);

  const downloadsChart = {
    labels: timeInterval === 'months' ? downloadsLabelsMonthly : downloadsLabelsYearly,
    datasets: [
      {
        label: timeInterval === 'months' ? 'App Downloads (Monthly)' : 'App Downloads (Yearly)',
        data: timeInterval === 'months' ? downloadsDataMonthly : downloadsDataYearly,
        backgroundColor: 'black',
        borderColor: 'red',
        borderWidth: 1,
      },
    ],
  };

  const linechartOptions = {
    maintainAspectRatio: false,
    responsive: false,
    scales: {
      y: {
        grid: {
          color: 'white'
        }
      },
      x: {
        grid: {
          color: 'white'
        }
      }
    }
  };

  // End of chart data and options

  return (
    <>
      <div className="d-flex vh-100 justify-content-center align-items-center">

        <Sidebar />
        <Container className="manage-users align-self-start">
          <Row xs={1}>
            <Col>
              <Breadcrumbs />
              <Row xs={1} className="mb-3 align-self-start">
                <Col xs={6}>
                  <div className="card-body bg-light">
                    <h3 className="card-title text-danger fw-bold d-flex align-items-center">App Downloads
                      <select className="form-select ms-auto" value={timeInterval} onChange={handleIntervalChange} style={{ fontSize: 'small', width: '100px' }}>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select></h3>

                    <div className="chart-container d-flex justify-content-between align-items-center">
                      <Chart type="line" data={downloadsChart} options={linechartOptions} height={300} width={500} />
                      <p className="text-white fw-bold">    Highest Downloads: <strong className="text-warning">
                        {timeInterval === 'months' ? downloadsHighestLabelMonthly : downloadsHighestLabelYearly}
                      </strong><br /><br />
                        Total Downloads: <strong className="text-warning">
                          {/* {timeInterval === 'months' ? formatTotalListeners(totalDownloadsMonthly) : formatTotalListeners(totalDownloadsYearly)} */}
                        </strong></p>
                    </div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="card-body bg-light">
                    <h3 className="card-title text-danger fw-bold d-flex align-items-center">App Downloads
                      <select className="form-select ms-auto" value={timeInterval} onChange={handleIntervalChange} style={{ fontSize: 'small', width: '100px' }}>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select></h3>

                    <div className="chart-container d-flex justify-content-between align-items-center">
                      <Chart type="line" data={downloadsChart} options={linechartOptions} height={300} width={500} />
                      <p className="text-white fw-bold">    Highest Downloads: <strong className="text-warning">
                        {timeInterval === 'months' ? downloadsHighestLabelMonthly : downloadsHighestLabelYearly}
                      </strong><br /><br />
                        Total Downloads: <strong className="text-warning">
                          {/* {timeInterval === 'months' ? formatTotalListeners(totalDownloadsMonthly) : formatTotalListeners(totalDownloadsYearly)} */}
                        </strong></p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row xs={1}>
                <Col xs={6}>
                  {/* <div className={`card col-md-11 `}>
                  <div className="card-body bg-light">
                    <h3 className="card-title text-danger fw-bold">Listeners</h3>
                    <div className="chart-container d-flex justify-content-between align-items-center">
                      <Chart type="pie" data={freeChart} options={piechartOptions} height={300} width={500} />
                      <p className="text-white fw-bold">Most Number of Users: <strong className="text-danger">{percentages[freeHighestIndex]}%</strong> of Users are {freeHighestLabel}
                        <br /><br />Total Listeners: <strong className="text-danger">{formatTotalListeners(totalUsers)}</strong> </p>
                    </div>
                  </div>
                </div> */}
                </Col>
                <Col xs={6}>
                  <div className="card-body bg-light">
                    {/* <h3 className="card-title text-danger fw-bold d-flex align-items-center">App Downloads
                    <select className="form-select ms-auto" value={timeInterval} onChange={handleIntervalChange} style={{ fontSize: 'small', width: '100px' }}>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select></h3> */}

                    {/* <div className="chart-container d-flex justify-content-between align-items-center">
                    <Chart type="line" data={downloadsChart} options={linechartOptions} height={300} width={500} />
                    <p className="text-white fw-bold">    Highest Downloads: <strong className="text-warning">
                      {timeInterval === 'months' ? downloadsHighestLabelMonthly : downloadsHighestLabelYearly}
                    </strong><br /><br />
                      Total Downloads: <strong className="text-warning">
                        {timeInterval === 'months' ? formatTotalListeners(totalDownloadsMonthly) : formatTotalListeners(totalDownloadsYearly)}
                      </strong></p> */}
                    {/* </div> */}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* 
        <Breadcrumbs />
        <Row>
          <Col>

          </Col>
        </Row > */}
        </Container >
      </div>

    </>
  );
};

export default HomePage;
