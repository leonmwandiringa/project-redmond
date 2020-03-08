import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
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
  Alert,
  Table,
  Row,
  Modal,
  ModalFooter,
  ModalBody,
  Col,
  Nav, 
  NavItem,
  NavLink,
  TabPane,
  TabContent
} from "reactstrap";
import * as axios from "axios";
import auth from "../common/auth";
import {CONSTANTS} from "../env";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      data: null,
      server: null,
      serverExecutions: null,
      containers: null,
      pills: 1,
      executions: null,
      loading: false,
      notification: {
        status: null,
        message: null
      },
      alertModal:false
    };
  }
  toggleTabs = (e, stateName, index) => {
    e.preventDefault();
    this.setState({
      [stateName]: index
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

  async getServerExecitions(server){
    try {
        var data;
        var token = auth.getToken();
        this.setState({loading: true})

        let response = await axios.get(`${CONSTANTS.baseUrl}/api/v1/server-execution/execution/${server}`, {headers: { Authorization: `Bearer ${token}` }});
        response.data.status || response.data.data ? this.setState({serverExecutions: response.data.data}) : this.setState({serverExecutions: null}) 
        console.log(response.data)
    } catch(error){
      console.log(error)
    }
    this.setState({loading: false})
  }

  async serverExecution(resource, action){
    try {
      var token = auth.getToken();
      this.setState({loading: true})

      let response = await axios.post(`${CONSTANTS.baseUrl}/api/v1/server-execution/execution`, {
        server_name: this.state.data.server_name,
        target: "CONTAINER",
        instruction: {
          container_name: resource.Name.slice(1),
          container_id: resource.Id,
          action: action
        },
        requested_at: Date.now(),
      }, {headers: { Authorization: `Bearer ${token}` }});

      this.setState({notification:{status: response.data.status ? "success" : "danger", message: response.data.message+" "+response.data.data.server_name}, loading: false});
      
    } catch(error){
      console.log(error)
      this.setState({notification:{status: "danger", message: error.response.data.message}, loading: false});
    }
    this.setState({loading: false})
    setTimeout(()=>{
      this.setState({notification:{status: null, message: null}});
    }, 5000)
  }

  async serverAlert(resource, action){
    try {
      var token = auth.getToken();
      this.setState({loading: true})

      let response = await axios.post(`${CONSTANTS.baseUrl}/api/v1/server-alerts/alert`, {
        server_name: this.state.data.server_name,
        target: "CONTAINER",
        instruction: {
          container_name: resource.Name.slice(1),
          container_id: resource.Id,
          action: action
        },
        requested_at: Date.now(),
      }, {headers: { Authorization: `Bearer ${token}` }});

      this.setState({notification:{status: response.data.status ? "success" : "danger", message: response.data.message+" "+response.data.data.server_name}, loading: false});
      
    } catch(error){
      console.log(error)
      this.setState({notification:{status: "danger", message: error.response.data.message}, loading: false});
    }
    this.setState({loading: false})
    setTimeout(()=>{
      this.setState({notification:{status: null, message: null}});
    }, 5000)
  }

  async componentDidMount(){
    const { server } = this.props.match.params
    this.setState({server: server})
    await this.getServerExecitions(server)
    await this.getUserServer(server)
    await this.renderContainers()
    await this.renderServerExecutions()
  }

  async toggleAlertModal(){
    this.setState({
        alertModal: !this.state.alertModal
    });
  }

  async renderServerExecutions(){
    console.log(this.state.serverExecutions)
    let executions = this.state.serverExecutions
    this.setState({executions: executions.map((val, index)=>{
        return (<tr key={"exec-"+val._id}>
          <th>{val.instruction.container_id.slice(0, 10)}</th>
          <th>{val.instruction.container_name}</th>
          <th>{val.instruction.action}</th>
          <th>{(new Date(val.createdAt)).toLocaleString()}</th>
          <th>{String(val.satisfied)}</th>
          <th>
                <Button className="btn-icon" color="danger" size="sm" onClick={()=>{console.log("stopping command")}} disabled={val.satisfied}>
                    <i className="fa fa-times"></i>
                </Button>{` `}
          </th>
        </tr>)
      })
    })
  }

  async renderContainers(){
    let containers = this.state.data.metrics.data
    this.setState({containers: containers.map((val, index)=>{
        return (<tr key={"container-"+val.Id}>
          <th>{"" || val.Id.slice(0, 10)}</th>
          <th>{val.Name.slice(1)}</th>
          <th>{val.Config.Image}</th>
          <th>{(new Date(val.State.StartedAt)).toLocaleString()}</th>
          <th>{val.State.Running == true ? "Running" : (val.State.Restarting == true ? "Restarting" : "Stopped")}</th>
          <th>
                <Button className="btn-icon" color="info" size="sm" onClick={()=>{return this.serverExecution(val, "STOP")}} disabled={val.State.Running == false || val.State.Restarting == true}>
                    <i className="fa fa-power-off"></i>
                </Button>{` `}
                <Button className="btn-icon" color="success" size="sm" onClick={()=>{return this.serverExecution(val, "START")}} disabled={val.State.Running == true || val.State.Restarting == true}>
                    <i className="fa fa-play"></i>
                </Button>{` `}
                <Button className="btn-icon" color="danger" size="sm" onClick={()=>{return this.serverExecution(val, "RESTART")}} disabled={val.State.Restarting == true}>
                    <i className="fa fa-redo" />
                </Button>
                <Button className="btn-icon" color="warning" size="md" onClick={()=>{return this.toggleAlertModal()}}>
                    <i className="fa fa-bell" />
                </Button>
          </th>
        </tr>)
      })
    })
  }

  renderNotifications(){
    if(this.state.notification.status){
      return (<Alert className="serverRespAlert" color={this.state.notification.status}>{this.state.notification.message}</Alert>)
    }
    return null
  }

  render() {
    return (
      <>
        <div className="content">
        {this.renderNotifications()}
        <Row>
            <Col xs="6">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                      {/* <h5 className="card-category">Server Metrics</h5> */}
                      <CardTitle tag="h2">Server Details</CardTitle>
                      <ul class="list-group" style={{width: '100%'}}>
                        <li class="">Servername: {this.state.data ? this.state.data.server_name : ""}</li>
                        <li class="">Last Updated: {this.state.data && this.state.data.metrics.time ? (new Date(this.state.data.metrics.time)).toLocaleString() : ""}</li>
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
          <Row>
            <Col lg="12" md="12">
              <Card>
                <CardBody>
                  <Nav className="nav-pills-primary" pills role="tablist" style={{margin: '0 10px 30px 0', paddingBottom: '10px',borderBottom: '1px solid'}}>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.pills === 1
                        })}
                        onClick={e => this.toggleTabs(e, "pills", 1)}
                        href="#pablo"
                      >
                        Commands
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.pills === 2
                        })}
                        onClick={e => this.toggleTabs(e, "pills", 2)}
                        href="#pablo"
                      >
                        Alerts
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent className="tab-space" activeTab={"pills" + this.state.pills}>
                    <TabPane tabId="pills1">
                              <Table className="tablesorter" responsive>
                                <thead className="text-primary">
                                  <tr>
                                    <th>Container ID</th>
                                    <th>Container Name</th>
                                    
                                    <th>Command</th>
                                    <th>Sent At</th>
                                    <th>Satisfied</th>
                                    
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.executions}
                                </tbody>
                              </Table>
                    </TabPane>
                    <TabPane tabId="pills2">
                        
                              <Table className="tablesorter" responsive>
                                <thead className="text-primary">
                                  <tr>
                                    <th>Container ID</th>
                                    <th>Container Name</th>
                                    <th>Alert Type</th>
                                    <th>Alert Counter</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th>Container ID</th>
                                    <th>Container Name</th>
                                    <th>Alert Type</th>
                                    <th>Alert Counter</th>
                                    <th>Actions</th>
                                  </tr>
                                </tbody>
                              </Table>
                        
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>

            <Modal isOpen={this.state.alertModal} toggle={()=>{this.toggleAlertModal()}}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Server Alert
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                  onClick={()=>{this.toggleAlertModal()}}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </div>
              <ModalBody>
                  <p>Woohoo, you're reading this text in a modal!</p>
              </ModalBody>
              <ModalFooter>
                  <Button color="secondary" onClick={()=>{this.toggleAlertModal()}}>
                      Close
                  </Button>
                  <Button color="primary">
                      Submit Alert
                  </Button>
              </ModalFooter>
            </Modal>
        </div>
      </>
    );
  }
}

export default Dashboard;
