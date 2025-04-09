type messageData = {
    type:string,//what we want to do
    roomId?:number,//roomid
    changeCode?:string,//changes in the code
    cursorPosition?:{line:number,column:number}
  }

export default messageData