import React from "react";
import {CONSTANTS} from "../env";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Alert
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import * as axios from "axios";
import auth from "../common/auth";

class Login extends React.Component {
    state = {
        email: null,
        password: null,
        notification: {
          status: null,
          message: null
        },
        loading: false
    }

    componentDidMount(){
      var isUserLoggedIn = sessionStorage.getItem("DOPR_USER")
      var tokenAvail = sessionStorage.getItem("DOPR_TOKEN")

      if(isUserLoggedIn && tokenAvail){
        return this.props.history.push("/admin/dashboard")
      }
      sessionStorage.clear()
    }
    

    async loginUser(){
        if(!this.state.email || !this.state.password){
            return false
        }
        this.setState({notification:{status: null, message: null}, loading: true})
        await this.submitLogin()
    }

    async submitLogin(){
      try {
        var data = this.state;
        delete data.notification
        delete data.loading
        
        let response = await axios.post(`${CONSTANTS.baseUrl}/api/v1/Auth/login`, data);
        this.setState({notification:{status: "success", message: response.data.message}});

        auth.setSessionStorage(response)
        setTimeout(()=>{
          return this.props.history.push("/admin/dashboard")
        }, 2000)

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
  render() {
    return (
      <>
          <Row className="text-center" onSubmit={(e)=>{e.preventDefault();this.loginUser()}}>
            <Col md="4" sm="8" xl="4" style={{margin: '10% auto'}}>

            <Form>
              <Card>
              <h3 className="text-center" style={{margin: '20px 0', padding: 0}}>Dopr</h3>
                <CardBody>
                {this.renderNotifications()}
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Input placeholder="Email" type="email" id="email" required style={{marginTop: 10, marginBottom: 10}} onChange={(e)=>{
                              this.setState({email: e.target.value})
                          }}/>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Input
                            placeholder="Your Password"
                            type="password"
                            id="password"
                            required
                            style={{marginTop: 10, marginBottom: 10}}
                            onChange={(e)=>{
                                this.setState({password: e.target.value})
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  
                </CardBody>
                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit" disabled={this.state.loading==true}>
                    Login
                  </Button>
                  <p className="text-center" style={{margin: "30px 0 0"}}>
                    <Link to="/auth/register">
                    Dont have an account ? Signup
                  </Link>
                  </p>
                </CardFooter>
              </Card>
              </Form>
            </Col>
          </Row>
      </>
    );
  }
}

export default Login;
