import React from "react";
import {CONSTANTS} from "../env";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Nav,
  Alert
} from "reactstrap";
import * as axios from "axios";

class UserProfile extends React.Component {

  state = {
    email: null,
    username: null,
    name: null,
    surname: null,
    organization: null,
    notification: {
      status: null,
      message: null
    },
    user: null,
    loading: false

  }

  async UpdateUser(){
      if(!this.state.email || !this.state.password){
          return false
      }
      this.setState({notification:{status: null, message: null}, loading: true})
      await this.submitUpdate()
  }


  async submitUpdate(){

    var userObj = await JSON.parse(sessionStorage.getItem("DOPR_USER"));
    this.setState({user: userObj});
    try {
        var data = this.state;
        delete data.notification
        delete data.loading
        delete data.user
        
        let response = await axios.put(`${CONSTANTS.baseUrl}/api/v1/User/${this.state.user.id}`, data);
        this.setState({notification:{status: "success", message: response.data.message}});

    } catch(error){
      this.setState({notification:{status: "danger", message: error.response.data.message}});
    }

    this.setState({loading: false})
  }

  renderNotifications(){
    if(this.state.notification.status){
      return (<Alert color={this.state.notification.status}>{this.state.notification.message}</Alert>)
    }
    return null
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="10" lg="10" sm="10">
              <Card>
                <CardHeader>
                  <h5 className="title">Edit Profile</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-md-1" md="4" lg="4">
                        <FormGroup>
                          <label>Name</label>
                          <Input
                            defaultValue={this.state.name}
                            placeholder="Name"
                            type="text"
                            onChange={(e)=>{
                              this.setState({name: e.target.value})
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-md-1" md="4" lg="4">
                        <FormGroup>
                          <label>Surname</label>
                          <Input
                            defaultValue={this.state.surname}
                            placeholder="Surname"
                            type="text"
                            onChange={(e)=>{
                              this.setState({name: e.target.value})
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-md-1" md="4" lg="4">
                        <FormGroup>
                          <label>Organization</label>
                          <Input
                            defaultValue=""
                            placeholder="Organization"
                            type="text"
                            onChange={(e)=>{
                              this.setState({name: e.target.value})
                            }}
                            defaultValue={this.state.organization}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="4" lg="4">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Email address
                          </label>
                          <Input placeholder="mike@email.com" type="email" onChange={(e)=>{
                              this.setState({name: e.target.value})
                            }}
                            defaultValue={this.state.email}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-md-1" md="4" lg="4">
                        <FormGroup>
                          <label>Username</label>
                          <Input
                            defaultValue={this.state.username}
                            placeholder="Username"
                            type="text"
                            disabled
                            onChange={(e)=>{
                              this.setState({password: e.target.value})
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-md-1" md="4" lg="4">
                        <FormGroup>
                          <label>Password</label>
                          <Input
                            defaultValue={this.state.password}
                            placeholder="Password"
                            type="text"
                            onChange={(e)=>{
                              this.setState({pasword: e.target.value})
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit" disabled={this.state.loading}>
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </Col>
            <Col md="2" sm="2" lg="2">
              <Card className="card-user">
                <CardBody>
                  <Nav>
                    <li
                      className={this.activeRoute("/profile")}
                        key="1"
                      >
                      <a href="/admin/profile"
                        className="nav-link"
                        activeClassName="active"
                      >
                        <i className="tim-icons icon-single-02" />
                      </a>
                    </li>
                  </Nav>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default UserProfile;
