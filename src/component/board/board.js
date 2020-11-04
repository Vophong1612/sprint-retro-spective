import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import config from '../../config/config.json'
import './board.scss';
import { useHistory } from 'react-router-dom';

// axios.defaults.withCredentials = true;

function Board() {

  const isAuth = localStorage.getItem("isAuth");
  const history = useHistory();
  console.log(isAuth);
  if (isAuth === null || isAuth === "false") {
      history.push("/login");
  }

  // console.log(window.location);
  const params = new URLSearchParams(window.location.search);
  const board_id = Number(params.get("board_id"));
  // console.log(board_id);
  const [tasks, setTask] = useState([])
  const [curT, setCurT] = useState(null);

  const onDragOver = ev => {
    ev.preventDefault();
  };

  const onDragStart = (ev, id) => {
    console.log(id);
    ev.dataTransfer.setData("id", id);
  };

  const onDrop = (ev, cat) => {
    const id = Number(ev.dataTransfer.getData("id"));
    let curtasks = [...tasks];
    curtasks.forEach(e => {
      if (e.id === id) {
        e.category = cat;
      }
    })
    if (cat !== 'trash') {
      let columnname = 1;
      if (cat === "toimprove") {
        columnname = 2;
      } else if (cat === "actionitems") {
        columnname = 3;
      }
      const entity = {
        tagID: id,
        columnname: columnname
      }
      axios.post(`${config.path}/task/update-column-task?board_id=${board_id}`, { update_task: entity })
        .then(result => {
          console.log(result);
          if (result.data.code === 0) {
            setTask(
              curtasks
            );
          }
        }).catch(error => {
          console.log(error); // Xử lý lỗi
        });
    }
    else if (cat === "trash") {
      axios.post(`${config.path}/task/delete-task?board_id=${board_id}`, { tagID: id })
        .then(result => {
          console.log(result);
          if (result.data.code === 0) {
            setTask(
              curtasks
            );
          }
        }).catch(error => {
          console.log(error); // Xử lý lỗi
        });
    }
  };

  const handleKeyPress = ev => {
    if ((ev.key === "Enter") && (ev.target.value !== "")) {
      const name = ev.target.value;

      axios.get(`${config.path}/task/task-total`)
        .then(result => {
          const timeCreate = moment(new Date());

          const new_task = {
            boardID: board_id,
            content: name,
            columnname: 1,
            timeCreate: timeCreate.format("YYYY-MM-DDTHH:mm:ss"),
            timeUpdate: null
          };
          axios.post(`${config.path}/task/new-task`, { new_task: new_task })
            .then(result => {
              console.log(result);
              if (result.data.code === 0) {
                setTask([
                  ...tasks,
                  { id: result.data.result.id, name: name, category: "wentwell" }
                ]);
              }
              else {
                alert("Something's wrong! Please retry!");
              }
            })
            .catch(error => {
              console.log(error); // Xử lý lỗi
            });

        })

      ev.target.value = "";
    }
  };

  const [taskName, setTaskName] = useState('');
  // const [dialog, setDialog] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };


  const HandleEditTask = () => {
    const entity = {
      tagID: curT.id,
      content: taskName,
    };
    axios.post(`${config.path}/task/update-content-task?board_id=${board_id}`, { update_task: entity })
      .then(result => {
        console.log(result);
        if (result.data.code === 0){
          const task_temp = [...tasks];
          task_temp.forEach(e => {
            if (e.id === curT.id){
              e.name = taskName;
            }
          });
          setTask(task_temp);
        }
      })
      .catch(error => {
        console.log(error); // Xử lý lỗi
      })

  };

  let my_tasks = {
    wentwell: [],
    toimprove: [],
    actionitems: [],
    trash: []
  };

  tasks && tasks.forEach(t => {
    my_tasks[t.category].push(
      <div
        className="item-container"
        key={t.id}
        draggable
        onDragStart={e => onDragStart(e, t.id)}>
        {t.name}
        <Button className="edit-button" onClick={() => 
          {
            setCurT(t);
            handleClickOpen();}
          }>
          <EditIcon /></Button>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
          maxWidth="xs" fullWidth>
          <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              type="text"
              fullWidth
              onChange={e => {
                setTaskName(e.target.value);
                // console.log(e.target.value, taskName);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
            <Button onClick={() => {
              HandleEditTask();
              handleClose();
            }} color="primary">
              OK
        </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  });

  useEffect(() => axios.get(`${config.path}/task?board_id=${board_id}`)
    .then(result => {
      let row = [];
      result.data.result.forEach(e => {
        let cat = "wentwell";
        if (e.columnname === 2) {
          cat = "toimprove";
        } else if (e.columnname === 3) {
          cat = "actionitems";
        }
        const task = {
          id: e.tagID,
          name: e.content,
          category: cat
        }
        row.push(task);
      });
      setTask(row);
    }), [])


  return (
    <div>
      <div id='background-image'></div>
      <div class="container">
        <div
          className="drop-area"
          onDragOver={e => onDragOver(e)}
          onDrop={e => onDrop(e, "wentwell")}
        >
          <h1>Went well</h1>
          {my_tasks.wentwell}
        </div>
        <div
          className="drop-area"
          onDragOver={e => onDragOver(e)}
          onDrop={e => onDrop(e, "toimprove")}
        >
          <h1>To Improve</h1>
          {my_tasks.toimprove}
        </div>
        <div
          className="drop-area"
          onDragOver={e => onDragOver(e)}
          onDrop={e => onDrop(e, "actionitems")}
        >
          <h1>Action Items</h1>
          {my_tasks.actionitems}
        </div>
      </div>
      <div>
        <div
          class="trash-drop"
          onDrop={e => onDrop(e, "trash")}
          onDragOver={e => onDragOver(e)}>
          Drop here to remove
          </div>
        <input
          onKeyPress={e => handleKeyPress(e)}
          className="input"
          type="text"
          placeholder="Task Name"
        />
      </div>
    </div>
  );
}

export default Board;
