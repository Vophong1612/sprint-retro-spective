import React from "react";
import clsx from "clsx";
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Typography from "@material-ui/core/Typography";
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../header/header';
import config from '../../config/config.json';
import  { useHistory } from 'react-router';
import { BrowserRouter as Router, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    root: {
        display: "flex",
        flexWrap: "wrap"
    },
    margin: {
        margin: theme.spacing(1)
    },
    withoutLabel: {
        marginTop: theme.spacing(3)
    },
    textField: {
        width: "70"
    },
    heroContent: {
        padding: theme.spacing(8, 0, 4)
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
}));


// axios.defaults.withCredentials = true;

export default function Login() {
    const classes = useStyles();
    const history = useHistory();
    const [values, setValues] = React.useState({
        username: "",
        password: "",
        showPassword: false
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const valadateForm = () => {
        return values.username.length > 0 && values.password.length > 0;
    }

    const handleLogin = (username, password, event) => {
        event.preventDefault();
        axios.post(`${config.path}/user/register`, { username: username, password: password })
            .then(result => {
                // console.log(result.data);
                if (result.data.code === 0){
                    history.push(`/login`);
                }
                else if (result.data.code === -1) {
                    alert('Username is exist! Please enter other username!');
                }
                else {
                    alert('Sorry! Register fail');
                }
            })
            .catch(error => {
                console.log(error); // Xử lý lỗi
            })
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Header username={values.username}/>
            <Container maxWidth="sm" component="main" className={classes.root}>
                <form onSubmit={(event) => handleLogin(values.username, values.password, event)}>
                    <Typography component="h4" align="center" variant="h4"
                        color="textPrimary" gutterBottom className={classes.heroContent}>
                        Register
                    </Typography>
                    <FormControl fullWidth className={classes.margin} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">
                            Username
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-username"
                            value={values.username}
                            onChange={handleChange("username")}
                            labelWidth={60}
                        />
                    </FormControl>
                    <FormControl
                        fullWidth
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                            Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? "text" : "password"}
                            value={values.password}
                            onChange={handleChange("password")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                    </FormControl>
                    <Typography align="center" gutterBottom>
                        <Link component={Button} type="submit" disabled={!valadateForm()} className={classes.link}>Register</Link>
                    </Typography>
                    <Typography align="center" gutterBottom>
                    <Link to={`/login`} variant="subtitle2" color="textPrimary" gutterBottom >
                        Or Login
                    </Link>
                    </Typography>
                </form>
            </Container>
        </React.Fragment>
    );
}
