import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "../header/header";
import config from "../../config/config.json";
import { Redirect, useHistory } from "react-router";
import { UserContext } from "../userContext/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "70",
  },
  heroContent: {
    padding: theme.spacing(8, 0, 4),
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

axios.defaults.withCredentials = true;

export default function ChangePassword() {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    if (isAuth === null || isAuth === "false") {
      setRedirect(<Redirect to="/login"></Redirect>);
    }
  }, []);

  const classes = useStyles();
  const [values, setValues] = React.useState({
    password: "",
    newpassword: "",
    showPassword: false,
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
    return (
      values.password.length > 0 &&
      values.newpassword.length > 0
    );
  };

  //   const [user_name, setUser_name] = useContext(UserContext);

  const handleChangePassword = (password, newpassword, event) => {
    event.preventDefault();
    axios
      .post(`${config.path}/user/change-password`, {
        password: password,
        newpassword: newpassword,
      })
      .then((result) => {
        // console.log(result.data);
        if (result.data.code === 0) {
          alert("Change password success! ");
          setRedirect(<Redirect to="/" />);
        } else {
          alert("Sorry! Can not change your password now!");
        }
      })
      .catch((error) => {
        console.log(error); // Xử lý lỗi
      });
  };

  return (
    redirect || (
      <React.Fragment>
        <CssBaseline />
        <Header username={values.username} />
        <Container maxWidth="sm" component="main" className={classes.root}>
          <form
            onSubmit={(event) =>
              handleChangePassword(values.password, values.newpassword, event)
            }
          >
            <Typography
              component="h4"
              align="center"
              variant="h4"
              color="textPrimary"
              gutterBottom
              className={classes.heroContent}
            >
              Change Password
            </Typography>
            <FormControl
              fullWidth
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
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
            <FormControl
              fullWidth
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                New Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.newpassword}
                onChange={handleChange("newpassword")}
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
              <Link
                component={Button}
                type="submit"
                disabled={!valadateForm()}
                className={classes.link}
              >
                Changes
              </Link>
            </Typography>
          </form>
        </Container>
      </React.Fragment>
    )
  );
}
