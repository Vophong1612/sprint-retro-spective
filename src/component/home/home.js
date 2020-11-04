import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import config from '../../config/config.json'
import Header from '../header/header';
import Footer from '../footer/footer';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {useHistory} from 'react-router';
import { BrowserRouter as Router, Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },

    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

// axios.defaults.withCredentials = true;

function HandleOpenCloseNewBoardDialog(boards, setBoard) {
    const [open, setOpen] = useState(false);
    const [boardName, setBoardName] = useState('');
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const HandleAddBoard = (boardName) => {
        const timeCreate = moment(new Date());
        const owner = localStorage.getItem("Username");
        const new_board = {
            boardName: boardName,
            owner: owner,
            timeCreate: timeCreate.format("YYYY-MM-DDTHH:mm:ss"),
            timeUpdate: null,
        };

        axios.post(`${config.path}/board/my-board`, { new_board: new_board })
            .then(result => {
                console.log(result);
                const temp = {
                    boardID: result.data.result.id,
                    boardName: boardName,
                    owner: owner,
                    timeCreate: timeCreate.format("YYYY-MM-DDTHH:mm:ss"),
                    timeUpdate: null,
                }
                setBoard([...boards, temp]);
            })
            .catch(error => {
                console.log(error); // Xử lý lỗi
            })
    };


    return (
        <div>
            <Button fullWidth outlinedSecondary variant="outlined" color="secondary" onClick={handleClickOpen}>
                New
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                maxWidth="xs" fullWidth>
                <DialogTitle id="form-dialog-title">Add Board</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        onChange={e => setBoardName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        HandleAddBoard(boardName, setOpen);
                        setOpen(false);
                    }
                    } color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default function Home() {

    const history = useHistory();

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuth");
        console.log(isAuth);
        if (isAuth === null || isAuth === "false") {
            history.push("/login");
        }
    }, [history]);

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [boardName, setBoardName] = useState('');

    const [boards, setBoard] = useState([]);

    const [curBoard, setCurBoard] = useState({});

    useEffect(() => axios.get(`${config.path}/board/my-board`)
        .then(result => {
            if (result.data.code === 0) {
                setBoard(result.data.result.boards);
            }
            else {
                alert("Can not load yours boards! Try again");
            }
        }), [])

    const HandleDeleteBoard = (boardID) => {
        axios.post(`${config.path}/board/delete-board?board_id=${boardID}`, { boardID: boardID })
            .then(result => {
                const curBoards = [];
                boards.forEach(element => {
                    if (element.boardID !== boardID)
                        curBoards.push(element);
                })
                if (result.data.code === 0) {
                    setBoard(
                        curBoards
                    );
                }
            }).catch(error => {
                console.log(error); // Xử lý lỗi
            });
    }

    const HandleEditBoard = (event, boardName) => {
        const edit_board = {
            boardID: curBoard.boardID,
            boardName: boardName,
        };

        axios.post(`${config.path}/board/edit-board?board_id=${curBoard.boardID}`, { edit_board: edit_board })
            .then(result => {
                console.log(result);
                const updated = result.data.result.updated_board;
                const curBoards = [];
                boards.forEach(element => {
                    if (element.boardID === curBoard.boardID)
                        curBoards.push(updated);
                    else curBoards.push(element);
                })
                setBoard(curBoards);
            })
            .catch(error => {
                console.log(error); // Xử lý lỗi
            })


    };

    return (
        <React.Fragment>
            <CssBaseline />

            <Header />

            {/* Hero unit */}
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                {HandleOpenCloseNewBoardDialog(boards, setBoard)}
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="main">

            </Container>

            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {boards.map((board) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid item key={board.boardID} xs={12} sm={board.title === 'Enterprise' ? 12 : 6} md={4}>
                            <Card>
                                <CardHeader
                                    title={board.boardName}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                    action={
                                        <div>
                                            <IconButton aria-label="settings" onClick={() => {
                                                setCurBoard(board);
                                                handleClickOpen();
                                            }}>
                                                <EditIcon />
                                            </IconButton>
                                            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                                                maxWidth="xs" fullWidth>
                                                <DialogTitle id="form-dialog-title">Edit </DialogTitle>
                                                <DialogContent>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        type="text"
                                                        fullWidth
                                                        onChange={e => setBoardName(e.target.value)}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleClose} color="primary">
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={(event) => {
                                                        HandleEditBoard(event, boardName);
                                                        setOpen(false);
                                                    }
                                                    } color="primary">
                                                        OK
                                                    </Button>
                                                </DialogActions>
                                            </Dialog> </div>
                                    }
                                />

                                <CardContent>
                                    <div className={classes.cardPricing}>
                                        <Typography component="h8" variant="h8" color="textPrimary">
                                            {new Intl.DateTimeFormat("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            }).format(new Date(board.timeCreate))}
                                        </Typography>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Link to={`/board?board_id=${board.boardID}`} fullWidth
                                        component={Button}>
                                        View
                                    </Link>
                                    <IconButton aria-label="settings" onClick={() => HandleDeleteBoard(board.boardID)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Footer />
        </React.Fragment>
    );
}
