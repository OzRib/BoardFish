#define REQ 2
#define ANALOG 1
#define DIGITAL 0
#define led 13
byte motor;
void setup() {
  pinMode(led, OUTPUT);
  Serial.begin(9600);
  Serial.setTimeout(10);
}

void atualMotor(){
  Serial.print(motor);
  Serial.println('a');
}

void atualLed(){
  Serial.print(digitalRead(led));
  Serial.println('d');
}
void atual(byte key){
  if(ANALOG==key){
    atualMotor();
  }else if(DIGITAL==key){
    atualLed();  
  }else{
    atualMotor();
    atualLed();
  }
}

void request(){
  atual(REQ);
}

void loop() {
  if(Serial.available()>0){
    String cmd = Serial.readString();
    switch(cmd[0]){
      case 'r':
        request();
        break;
      case 'l':
        digitalWrite(led, HIGH);
        atual(DIGITAL);
        break;
      case 'd': 
        digitalWrite(led, LOW);
        atual(DIGITAL);
        break;
      case 'a':
        motor = cmd[1]+cmd[2];
        analogWrite(6, motor);
        atual(ANALOG);
        break;
    }
  }
}
