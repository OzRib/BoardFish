const linkServer = "https://10.0.0.107:3333/"
function welcome(){
    alert('Bem vindo ao Arduino Fish! \n \nComo usar: \n\n    Use os botões verde e vermelho para ligar ou desligar, simultâneamente, o led da placa. \n\n    Use a caixa de texto para mandar uma velocidade para o motor. Valores não numéricos serão desprezados. Números quebrados serão arredondados.');
}
function loadData(val, id){
    document.getElementById(id).value=val;
}
//recebimento de dados
const socket = io(linkServer);
function request(){
    socket.emit('request');
}
socket.on('Serial:data', function(serial){
    var serial=serial.value;
    const val=serial[serial.length-1];
    serial=serial.slice(0, (serial.length-1));
    switch(val){
        case 'a':
            document.getElementById('serialPort').value=serial;
            loadData(serial, 'range');
            break;
        case 'd':
            atualButton(serial);
            break;
    }
})
//Controle de botões
function atualButton(On){
    if(On == "1"){
        loadData('Ligado', 'bt1');
	    loadData('Desligar', 'bt2');
    }else{
	    loadData('Ligar', 'bt1');
	    loadData('Desligado', 'bt2');
    }
    console.log(On);
    console.log(typeof(On));
}
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
