import React from "react";

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
  Col
} from "reactstrap";

class Login extends React.Component {
    state = {
        email: null,
        password: null
    }

    loginUser(){
        if(!this.state.email || !this.state.password){
            return false
        }
        this.submitLogin()
    }

    submitLogin(){
        console.log(this.state)
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
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Input placeholder="Email" type="email" id="email" style={{marginTop: 10, marginBottom: 10}} onChange={(e)=>{
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
                  <Button className="btn-fill" color="primary" type="submit">
                    Login
                  </Button>
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
