//const nodemailer =require("nodemailer")
//import Swal from "sweetalert2";
const email = document.getElementById("email")
const password = document.getElementById("password")

async function ingresar(event) {
    event.preventDefault();
    var user = {
        email: email.value,
        password: password.value,
    }
    await fetch("/loin", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify(user),
    }).then((response) => {
        console.log('Paso del pop')
        console.log(response);
        if (response.status == 200) {
            alert("mensaje enviado con exito");

        } else {
            alert("fallo al enviar el mensaje");
        }
    });

    window.localStorage.setItem("correo", email.value)
    window.localStorage.setItem("password", password.value)
    console.log("email", email.value)
    console.log("password", password.value)
    window.location.replace('correo.html')
}

function cerrarSesion() {
    window.localStorage.clear();
    window.location.replace('index.html')
}
async function enviarCorreo() {
    const dest = document.getElementById("destinatario").value
    const asunto = document.getElementById("asunto").value
    const mensaje = document.getElementById("mensaje").value
    var mail = {
       //emailFrom: window.localStorage.getItem("correo"),
        //emailFrom: "peespinosag@correo.udistrital.edu.co",
        //emailpass: "toikpmzosqzqvbjt",
        emailFrom: window.localStorage.getItem("correo"),
        emailpass: window.localStorage.getItem("password"),
        emailDest: dest,
        subject: asunto,
        text: mensaje,
    }
    await fetch("/envio", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify(mail),
    }).then((response) => {
        console.log(response);
        if (response.status == 200) {
            alert("mensaje enviado con exito");
        } else {
            alert("fallo al enviar el mensaje");
        }
    });

    
}
