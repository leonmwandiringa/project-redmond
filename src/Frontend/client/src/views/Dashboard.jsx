import React from "react";
// nodejs library that concatenates classes

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
import { Link } from "react-router-dom";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      data: [],
      loading: false
    };
  }
  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };

  async getUserServers(){
    try {
        var data = []
        var token = auth.getToken();
        this.setState({loading: true})

        let response = await axios.get(`${CONSTANTS.baseUrl}/api/v1/stats/stat`, {headers: { Authorization: `Bearer ${token}` }});
        response.data.status || response.data.data ? this.setState({data: response.data.data}) : this.setState({data: []}) 

    } catch(error){
      this.setState({notification:{status: "danger", message: error.response.data.message}, loading: false});
    }
    this.setState({loading: false})
  }

  componentDidMount(){
    this.getUserServers()
  }

  rendersServers(){
    console.log(this.state.data)
    let serverVals = this.state.data
    return (serverVals.map((val, index)=>{
      return (<tr key={val.server_name}>
          <td>
            <p className="title">{val.server_name}</p>
            <p className="">Containers: {val.metrics.length}</p>
          </td>
          <td className="td-actions text-right">
            <Link to={`/admin/metrics/${val.server_name}`}>
              <Button
                color="link"
                id="tooltip636901683"
                title=""
                type="button"
              >
                <i className="tim-icons icon-zoom-split" />
              </Button>
            </Link>
            <UncontrolledTooltip
              delay={0}
              target="tooltip636901683"
              placement="right"
            >
              Edit Task
            </UncontrolledTooltip>
          </td>
        </tr>)
      }))
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col lg="12" md="12">
              <Card className="card-tasks">
                <CardHeader>
                  <h6 className="title d-inline">Server/Instances</h6>
                </CardHeader>
                <CardBody>
                  <div className="table-full-width table-responsive">
                    <Table>
                      <tbody>
                        {this.rendersServers()}
                      </tbody>
                    </Table>
                  </div>
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
