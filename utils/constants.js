function validateTimeSlots(dateTimes){
    let actualParsedDate = new Date(dateTimes);
    let flgged = false,hh = actualParsedDate.getHours(),mm = actualParsedDate.getMinutes(),ss = actualParsedDate.getSeconds(),
    valTobeTested = `${hh}:${mm}:${ss}`,startDateTime = 9,endDateTime = 18;
    var isValidDateTimes = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(valTobeTested);
    if(!isValidDateTimes){
        flgged = false;
    }
    else{
        validateWokingTimeSlots();
    }
    function validateWokingTimeSlots(){
        if((hh >= startDateTime && hh <= endDateTime) && (mm >= 0 && mm <= 60) && (ss >= 0 && mm <= 60)){
            console.log("flgged and hh is:", hh , mm , ss);
            flgged = true;
        }
        else{
            flgged = false;
        }
    }
    return flgged;
}

module.exports = {validateTimeSlots};