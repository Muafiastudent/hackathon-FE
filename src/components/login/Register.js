import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import Alert from "../alert/Alert";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password1: "",
            password2: "",
            redirect: false,
            userRegAlert: false,
            userRegMsg: "",
            userRegTheme: "",
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            userRegAlert: false,
        });

        const { name, email, password1, password2 } = this.state;

        // Validation checks
        if (!name || !email || !password1 || !password2) {
            this.setState({
                userRegMsg: "All fields are required!",
                userRegAlert: true,
                userRegTheme: "danger",
            });
            return;
        }

        if (password1 !== password2) {
            this.setState({
                userRegMsg: "Password confirmation does not match!",
                userRegAlert: true,
                userRegTheme: "danger",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/user/newUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.toLowerCase(),
                    password: password1,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                this.setState({
                    userRegMsg: "You have successfully registered!",
                    userRegAlert: true,
                    userRegTheme: "success",
                    name: "",
                    email: "",
                    password1: "",
                    password2: "",
                });

                setTimeout(() => this.setState({ redirect: true }), 1500); // Redirect after 1.5 seconds
            } else {
                this.setState({
                    userRegMsg: data.error || "Registration failed. Try again!",
                    userRegAlert: true,
                    userRegTheme: "danger",
                });
            }
        } catch (error) {
            console.error("Error during registration:", error);
            this.setState({
                userRegMsg: "Server error. Please try again later.",
                userRegAlert: true,
                userRegTheme: "danger",
            });
        }
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="container">
                <Alert
                    show={this.state.userRegAlert}
                    theme={this.state.userRegTheme}
                    msg={this.state.userRegMsg}
                />
                <div className="row">
                    <form className="mt-5 col-lg-6 mx-auto" onSubmit={this.handleSubmit}>
                        <div className="form-group row">
                            <p>
                                Already have an account? Quickly{" "}
                                <a href="/login"><strong>sign in</strong></a> for your account now.
                            </p>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    name="password1"
                                    className="form-control"
                                    value={this.state.password1}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Confirmation</label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    name="password2"
                                    className="form-control"
                                    value={this.state.password2}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="text-center">
                                <button type="submit" className="btn btn-success col-3 mt-2">
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;
