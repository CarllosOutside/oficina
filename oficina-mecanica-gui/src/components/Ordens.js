import { ListComponent } from "../ListComponent";
import React from "react";
import { useState, useEffect } from "react";
import moment from "moment-timezone";
import 'moment/locale/pt';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Ordens = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const mesesNomes = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const [data, setData] = useState(new Date())

    useEffect(()=>{},[data])

    const selectData = (value) =>{
        setData(value)
    }
    
      return(
        <div style={{textAlign:"center"}}>
            <button onClick={handleShow} style={{marginLeft:"9rem", marginTop:"2rem",
        backgroundColor:"white", border:"0px"}}>
            <h3 >{moment.tz(data,"America/Sao_Paulo").format("DD - MMMM - YYYY")}</h3>
            </button>
            <div>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Selecione uma data</Modal.Title>    
        </Modal.Header>
        <Modal.Body> <Calendar 
        name="data"
        onClickDay={selectData}
            defaultView='year'
            tileDisabled={({ view, date }) => ((date.getDay() == 0|| date.getDay() == 6) //desativa sabados e domingos
             && view=='month')}/></Modal.Body>
      </Modal>
           
            </div>
            <br/>
        <div style = {{display: "flex", marginTop: 8}}>
            <ListComponent dataAtual={data}/>
        </div>
        </div>
    );
};

export default Ordens;