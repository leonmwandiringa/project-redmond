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
    loading: false,
    token: null
  }

  async UpdateUser(){
      this.setState({notification:{status: null, message: null}, loading: true})
      await this.submitUpdate()
  }


  async submitUpdate(){

    var cid = this.state.user.id
    var tkn = this.state.token
    try {
        var data = this.state;
        delete data.notification
        delete data.loading
        delete data.user
        delete data.token
        
        let response = await axios.put(`${CONSTANTS.baseUrl}/api/v1/User/${cid}`, data, { headers: { Authorization: `Bearer ${tkn}` } });
        this.setState({notification:{status: "success", message: response.data.message}});
        await this.getUser()
    } catch(error){
     console.log(error)
      // this.setState({notification:{status: "danger", message: error.response.data.message}});
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

  async getUser(){
    this.setState({notification:{status: null, message: null}, loading: true})
    
    console.log(this.state.user)
    try {
      let response = await axios.get(`${CONSTANTS.baseUrl}/api/v1/User/${this.state.user.id}`, { headers: { Authorization: `Bearer ${this.state.token}` } });
      if(response.data.status){
        this.setState({
          email: response.data.data.email,
          username: response.data.data.username,
          name: response.data.data.name,
          surname: response.data.data.surname,
          organization: response.data.data.organization,
        });
      }
      this.setState({notification:{status: null, message: null}, loading: false})
      
    } catch(error){
      console.log(error)
      //this.setState({notification:{status: "danger", message: error.response.data.message, loading: false}});
    }
  }

  async componentWillMount(){
    var userObj = await JSON.parse(sessionStorage.getItem("DOPR_USER"));
    var userToken = sessionStorage.getItem("DOPR_TOKEN");
    this.setState({user: userObj, token: userToken});
    await this.getUser();
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="11" lg="11" sm="11">
            <Form onSubmit={async (e)=>{e.preventDefault();await this.UpdateUser()}}>
              <Card>
                <CardHeader>
                  <h5 className="title">Edit Profile</h5>
                </CardHeader>
                <CardBody>
                  
                    <Row>
                      <Col className="pr-md-1" md="4" lg="4">
                        <FormGroup>
                          <label>Name</label>
                          <Input
                            defaultValue={this.state.name}
                            placeholder="Name"
                            type="text"
                            required
                            onChange={(e)=>{
                              this.setState({name: e.target.value.trim()})
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
                            required
                            type="text"
                            onChange={(e)=>{
                              this.setState({name: e.target.value.trim()})
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-md-1" md="4" lg="4">
                        <FormGroup>
                          <label>Organization</label>
                          <Input
                            defaultValue={this.state.organization}
                            placeholder="Organization"
                            type="text"
                            required
                            onChange={(e)=>{
                              this.setState({name: e.target.value.trim()})
                            }}
                            defaultValue={this.state.organization}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="6" lg="6">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Email address
                          </label>
                          <Input placeholder="mike@email.com" type="email" onChange={(e)=>{
                              this.setState({name: e.target.value.trim()})
                            }}
                            disabled
                            defaultValue={this.state.email}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-md-1" md="6" lg="6">
                        <FormGroup>
                          <label>Username</label>
                          <Input
                            defaultValue={this.state.username}
                            placeholder="Username"
                            type="text"
                            disabled
                            onChange={(e)=>{
                              this.setState({password: e.target.value.trim()})
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  
                </CardBody>
                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit" disabled={this.state.loading}>
                    Save
                  </Button>
                </CardFooter>
              </Card>
              </Form>
            </Col>
            <Col md="1" sm="1" lg="1" style={{padding: 0}}>
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
