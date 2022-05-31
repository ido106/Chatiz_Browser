import React from "react"
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './sign_in.css';

export const Globaltoken = {
    token: ''
};

export const GlobalConts = {
    contacts: null
};

export const GlobalIsSigninDone = {
    isDone: false
}

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valid_user: false,
            isSubmitted: false,
            userName: '',
            passWord: ''

        }

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchAll = this.fetchAll.bind(this);
    }

    togglePassword() {
        var passwordInput = document.getElementById("passwordInput");
        var eye = document.getElementById("passwordEye")
        if (passwordInput.value != '') {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                eye.className = "fa fa-eye-slash"
            } else {
                passwordInput.type = "password";
                eye.className = "fa fa-eye"
            }
        }
    }

    handleChangeUsername(event) {
        this.setState({
            userName: event.target.value
        });
        this.props.updateUserData((prevState) => ({ ...prevState, myUser: this.state.userName }))
    }
    handleChangePassword(event) {
        this.setState({ passWord: event.target.value });
    }

    async fetchAll() {

        let func = async () => {
            var flag = true;
            const res = await fetch("https://localhost:7038/api/SignIn",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: this.state.userName
                        , password: this.state.passWord
                    })

                }).then(
                    response => {
                        response.text().then(
                            response2 => {
                                //console.log("res2= ", response2);
                                Globaltoken.token = response2;
                                console.log("Global Token= ", Globaltoken.token);
                                console.log(typeof (Globaltoken.token));
                                let jsonRes = null;
                                try {
                                    jsonRes = JSON.parse(response2);
                                } catch (error) {
                                    this.setState({
                                        valid_user: true
                                    });
                                    this.setState({
                                        isSubmitted: true
                                    })
                                    return;
                                }
                                if (JSON.parse(response2).status == 400) {
                                    console.log("hh")
                                    this.setState({
                                        isSubmitted: true
                                    })
                                    flag = false;
                                    return;
                                }
                                if (!flag) {
                                    return;
                                }
                                console.log(typeof (Globaltoken.token));
                                getAllContacts();


                            }).then(res => {
                                if (!flag) {
                                    return;
                                }  
                                this.setState({
                                    valid_user: true
                                });
                                this.setState({
                                    isSubmitted: true
                                })
                            })



                        //token = await res.json();
                    });
        };

        //let conts = [];

        async function getAllContacts() {
            await fetch("https://localhost:7038/api/contacts", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Globaltoken.token,
                }
            }).then(response2 => {
                //console.log("response2: ",response2);
                response2.text().then(
                    response3 => {
                        GlobalConts.contacts = response3;
                        console.log("global conts = ", GlobalConts.contacts);
                    }
                )
            })
            // .then(async data=>{
            //     GlobalConts.contacts = (await data.json())[0];
            //     console.log("global conts = " , GlobalConts.contacts);
            //     // this.props.updateUserData(prevState => ({
            //     //     ...prevState,
            //     //     contacts : GlobalConts.contacts,
            //     // }))

            // })
        }
        await func();

    }

    async handleSubmit(event) {
        event.preventDefault();

        // let token = null;
        // let exist = true;



        await this.fetchAll()

        GlobalIsSigninDone.isDone = true;


    }



    render() {
        if (this.state.valid_user) {

            return (
                <Navigate to="/Chats" />
            );
        }
        return (
            <div className="signin-container">
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous" />

                {/* Fontawesome CDN */}
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous" />

                {/* Custom styles */}
                <link rel="stylesheet" type="text/css" href="styles.css" />

                <div className="d-flex justify-content-center h-100">
                    <div className="card signin-card">
                        <div className="card-header">
                            <h3>Sign In</h3>
                            <div className="d-flex justify-content-end social_icon">
                                <span><i className="fab fa-facebook-square"></i></span>
                                <span><i className="fab fa-google-plus-square"></i></span>
                                <span><i className="fab fa-twitter-square"></i></span>
                            </div>
                        </div>
                        <div className="card-body">
                            {(!this.state.valid_user && this.state.isSubmitted) ? <p className="text-danger">Incorrect username or password</p> : null}
                            <form onSubmit={this.handleSubmit}>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                                    </div>
                                    <input type="text" value={this.state.userName} onChange={this.handleChangeUsername} className="form-control" placeholder="username" />

                                </div>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-key"></i></span>
                                    </div>

                                    <input type="password" onChange={this.handleChangePassword} value={this.state.passWord} className="form-control" placeholder="password"
                                        id="passwordInput" />

                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i id="passwordEye" className="fa fa-eye" onClick={this.togglePassword}></i></span>
                                    </div>

                                </div>
                                <div className="row align-items-center remember">
                                    <input type="checkbox" /> Remember Me
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Login" className="btn float-right login_btn" />
                                </div>
                            </form>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-center links">
                                Don't have an account?<Link to="/SignUp" onClick={() => { this.setState({ valid_user: false }) }}>Sign Up</Link>
                            </div>
                            <div className="fa fa star d-flex justify-content-center links big">
                                <a href = "http://localhost:5155">Rating Page</a>
                            </div>
                            
                            <div className="d-flex justify-content-center">
                                <a href="https://www.youtube.com/watch?v=y83x7MgzWOA" target="_blank">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn