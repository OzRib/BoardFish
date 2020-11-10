function welcome(){
    alert('Bem vindo ao Arduino Fish! \n \nComo usar: \n\n    Use os botões verde e vermelho para ligar ou desligar, simultâneamente, o led da placa. \n\n    Use a caixa de texto para mandar uma velocidade para o motor. Valores não numéricos serão desprezados. Números quebrados serão arredondados.');
}
function loadData(val, id){    
    document.getElementById(id).value=val;
}
//recebimento de dados
const socket = io('http://10.0.0.103:3333');
function request(){
    socket.emit('request');
}
socket.on('Serial:data', function(serial){
    var serial=serial.value;
    var val=serial[serial.length-1];
    serial=serial.slice(0, (serial.length-1));
    switch(val){
        case 'a':
            document.getElementById('serialPort').value=serial;
            loadData(serial, 'range');
            break;
        case 'd':
            serial=="0"? loadData('Desligado', 'bt2'):loadData('Ligado', 'bt1'); 
            break;    
    }
})
//Controle de botões
function changeButton(id){
    var dado=null;
    if(id=='bt1'){
        loadData('Ligado', id);
        loadData('Desligar', "bt2");
        dado='l';
    }else if(id=='bt2'){ 
        loadData('Desligado', id);
        loadData('Ligar', "bt1");
        dado='d';
    }
    sendDigitalData(dado);
}
//Controle da caixa
function clean(id){
    document.getElementById(id).value='';
}
function sendValue(id){ 
    const data=parseInt(document.getElementById(id).value);    
    if(data>=0 && data <255){
        sendAnalogData(data);
        console.log('enviando: '+data);
    }else{
        console.log('Valor desprezado');        
    }
}
//Envio de dados
function sendDigitalData(data){
    socket.emit('emitDigitalData', {
        value: data.toString() 
    })
}
function sendAnalogData(data){
    socket.emit('emitAnalogData', data);
}
