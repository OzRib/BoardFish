const ip = process.argv[2];
const port = parseInt(process.argv[3]);
//Requires ("Exports")
const serialPort = require('serialport');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
//Definição do corpo do programa
const bodyProg = function(){
    //Server
    const app = express();
    const server = http.createServer(app);
    app.use(express.static('public'));
    app.get('/', (req, res, next) =>{
        res.sendFile(__dirname+'/public/index.html');
    })
    server.listen(port,ip,() =>{
        console.log('Porta: '+server._connectionKey.slice(2));
    })
    const io = socketIO.listen(server);
    //Comunicação serial
    const Readline = serialPort.parsers.Readline;
    const parser = new Readline({delimiter: '\r\n'});
    const mySerial = new serialPort('/dev/ttyUSB0', {
        baudRate: 9600
    });
    mySerial.pipe(parser);
    mySerial.on('open', function(){
        console.log('Conexão iniciada');
        parser.on('data', function(data){
            io.emit('Serial:data', {
                value: data.toString()
            })
        })
    })
    //Envio de sinal
    io.sockets.on('connection', function(socket){
        function showData(data){
            console.clear();
            console.log('host: '+socket.handshake.headers.host+'\n\nDevices: '+socket.handshake.headers['user-agent']+'\n\nTime: '+socket.handshake.time+'\n\nUrl: '+socket.handshake.url+'\n\nIP: '+socket.handshake.address);    
            if(data!=undefined){
                console.log(data);        
            }
        }
        showData();
        socket.on('emitDigitalData', function(digitalDataSite){
            arduinoSended = digitalDataSite.value;
            mySerial.write(arduinoSended);
            showData('Dado digital enviado: '+arduinoSended);
        })
        socket.on('emitAnalogData', function(data){
            byte=parseInt(data)/2;
            data%2==1 ? byte1=(parseInt(data)/2)+2 : byte1=parseInt(data)/2;
            arduinoSended='a'+String.fromCharCode(byte,byte1);
            mySerial.write(arduinoSended);
            showData('Dado analógico enviado: "'+(byte+byte1)+'" PRIMITIVE VALUE: '+arduinoSended);
        })
        socket.on('request', function(){
            showData('requirindo dados para o cliente...');
            mySerial.write('r');
        })
    })
}
//Verificação de argumentos
if(ip == "-h" || ip == "man"){
    console.log("Menu de ajuda: \n\nPara operar corretamente o programa rode o programa como no exemplo: \n  node main.js <ip da sua máquina> <porta> \n\nVerifique se está no diretório do projeto \n\nNota, em alguns computadores as portas listadas abaixo não estão em funcionamento\n\n  [80, 123, 631, 68]");
}else if(ip == undefined || port == undefined){
    console.log('Por favor, preencha corretamente os argumentos pedidos. Tente rodar com "-h" ou "man" para obter ajuda');
}else{
    bodyProg();
}
