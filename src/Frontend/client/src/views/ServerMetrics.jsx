import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import * as axios from "axios";
import auth from "../common/auth";
import {CONSTANTS} from "../env";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.jsx";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      data: null,
      server: null,
      containers: null
    };
  }
  setBgChartData = name => {
    this.setState({
      bigChartData: name,
      data: null
    });
  };

  async getUserServer(server){
    try {
        var data;
        var token = auth.getToken();
        this.setState({loading: true})

        let response = await axios.get(`${CONSTANTS.baseUrl}/api/v1/stats/stat/${server}`, {headers: { Authorization: `Bearer ${token}` }});
        response.data.status || response.data.data ? this.setState({data: response.data.data}) : this.setState({data: null}) 
    } catch(error){
      this.setState({notification:{status: "danger", message: error.response.data.message}, loading: false});
    }
    this.setState({loading: false})
  }

  async componentDidMount(){
    const { server } = this.props.match.params
    this.setState({server: server})
    await this.getUserServer(server)
    await this.renderContainers()
  }

  async renderContainers(){
    console.log(this.state.data.metrics.data)
    let containers = this.state.data.metrics.data
    this.setState({containers: containers.map((val, index)=>{
        return (<tr key={val.Id}>
          <th>{"" || val.Id.slice(0, 10)}</th>
          <th>{val.Name.slice(1)}</th>
          <th>{val.Config.Image}</th>
          <th>{(new Date(val.State.StartedAt)).toLocaleString()}</th>
          <th>{val.State.Running == true ? "Running" : (val.State.Restarting == true ? "Restarting" : "Stopped")}</th>
          <th>Ations</th>
        </tr>)
      })
    })
  }

  render() {
    return (
      <>
        <div className="content">
        <Row>
            <Col xs="6">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                      {/* <h5 className="card-category">Server Metrics</h5> */}
                      <CardTitle tag="h2">Server Details</CardTitle>
                      <ul class="list-group">
                        <li class="">Servername: {this.state.data ? this.state.data.server_name : ""}</li>
                        <li class="">Last Updated: {this.state.data ? (new Date(this.state.data.metrics.time)).toLocaleString() : ""}</li>
                      </ul>
                  </Row>
                </CardHeader>
                <CardBody>
                  
                </CardBody>
              </Card>
            </Col>
            <Col xs="6">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h5 className="card-category">Server Health</h5>
                      <CardTitle tag="h2"></CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="12" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Containers</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.containers}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
