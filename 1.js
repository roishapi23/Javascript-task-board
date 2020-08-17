let count = 0;      
let missionsArray = [];
let noteId; 
let isNoteDeleted = false;
let isPageLoaded;

// main flow function
function createNewMission() {

    let userMissionInput = getMissionDetails();

    if (!isMissionInputValid(userMissionInput)) {
        return;
    }
    storeNewMissionInStorage(userMissionInput);
    createNewNote(userMissionInput , missionsArray);
    clearForm();
}
// getting user inputs
function getMissionDetails() {
    let inputBoxes = getInputBoxes();
    let missionDescription = (inputBoxes.mission).value;
    let missionDate = (inputBoxes.date).value;
    let missionTime = (inputBoxes.time).value;
    updateIdIfAlreadyExists();
    noteId = noteId + 1;
    let missionDetails = {
        mission : missionDescription ,
        date : missionDate , 
        time : missionTime , 
        id : noteId
        }
    return missionDetails;
}
// checking if input is OK
function isMissionInputValid(userMissionInput) {
    let inputBoxes = getInputBoxes();
    if (userMissionInput.mission == "") {
        alert("Please write your mission");
        (inputBoxes.mission).style.backgroundColor = "red";
        return false;
    }
    if (userMissionInput.date == "") {
        alert("Please choose date");
        (inputBoxes.date).style.backgroundColor = "red";
        return false;
    }
    return true;
}
// preventing from user to enter a date that already past
function setMinDate() {
    let today = new Date(),
    day = today.getDate(),
    month = today.getMonth()+1, //January is 0
    year = today.getFullYear();
         if(day<10){
                day='0'+day
            } 
        if(month<10){
            month='0'+month
        }
        today = year+'-'+month+'-'+day;

        document.getElementById("missionDate").setAttribute("min", today);

}

// function checkIfTimedidntPast(userMissionInput) {
//     let today = new Date();
//     hour = today.getHours();
//     minutes = today.getMinutes();
//          if(hour < 10){
//                 hour='0'+ hour;
//             } 
//         if(minutes < 10){
//             minutes='0'+ minutes;
//         }
//         currentHour = (hour + ':' + minutes);

//         userHour = hour.parse(userMissionInput.time);

//         // if (currentHour > userMissionInput.time) {
//         //     return true;
//         // }
//         document.getElementById("missionTime").setAttribute("min", currentHour);
// }

// push mission details to the storage
function storeNewMissionInStorage(userMissionInput) {
        let oldMissionCounter = Number(localStorage.getItem("savedMissionCount"));
        if (count >= 0 && count < oldMissionCounter) {
            count = oldMissionCounter;
        }
    count = count+1;
    localStorage.setItem("savedMissionCount" , count);
    updateMissionArray(userMissionInput , missionsArray);
}
// creation and updating the mission array
function updateMissionArray(userMissionInput , missionsArray) {
    let currentMissionsArray = JSON.parse(localStorage.getItem("missionsArray"));
    if (currentMissionsArray != null) {
        missionsArray = currentMissionsArray;
        missionsArray.push(userMissionInput);
    }
    else {
    missionsArray.push(userMissionInput);
    }
    localStorage.setItem("missionsArray" , JSON.stringify(missionsArray));
}
// creation of the notes with the mission from the array
function createNewNote(userMissionInput) {
    let currentMissionsArray = JSON.parse(localStorage.getItem("missionsArray"));
    if (currentMissionsArray == null) {
        return;
    }
    let noteOutputArea = document.getElementById("noteMissionsArea");
    noteOutputArea.innerHTML = "";

    for (let index = 0; index < currentMissionsArray.length; index++) {
        let newNote = document.createElement("div");
        newNote.classList.add("noteBlock");
    
        if (isPageLoaded == true) {
        }
        else if (isNoteDeleted == false && currentMissionsArray[index + 1] == currentMissionsArray[currentMissionsArray.length]) {
        newNote.setAttribute("id" , "fade-in");
        }

        let iconSpan = document.createElement("span");
        iconSpan.classList.add("xIcon");

        let innerIcon = document.createElement("span");
        innerIcon.classList.add("glyphicon");
		innerIcon.classList.add("glyphicon-remove");

        let textInNoteArea = document.createElement("div");
        textInNoteArea.classList.add("textInNote");

        let dateAndTimeDiv = document.createElement("div");
        dateAndTimeDiv.classList.add("dateAndTimeArea");

        innerIcon.id = currentMissionsArray[index].id;
        innerIcon.onclick = deleteNote;

        // textInNoteArea.scrollIntoViewIfNeeded();
        // textInNoteArea.scrollIntoViewIfNeeded(true);

        if (currentMissionsArray[index].time == undefined || currentMissionsArray[index].time == "" ) {
            textInNoteArea.innerHTML = "Task: \n" + currentMissionsArray[index].mission;
            dateAndTimeDiv.innerHTML = currentMissionsArray[index].date;
        }
        else{
            textInNoteArea.innerHTML = "Task: \n" + currentMissionsArray[index].mission;
            dateAndTimeDiv.innerHTML = currentMissionsArray[index].date + "<br>" + currentMissionsArray[index].time ;
        }
       
        noteOutputArea.appendChild(newNote);
        newNote.appendChild(iconSpan);
        iconSpan.appendChild(innerIcon);
        newNote.appendChild(textInNoteArea);
        newNote.appendChild(dateAndTimeDiv);
    }
}
// delete note and mission, also from local storage
function deleteNote() {
    currentMissionsArray = JSON.parse(localStorage.getItem("missionsArray"));
    for (let index = 0; index < currentMissionsArray.length; index++) {
        if (currentMissionsArray[index].id == this.id) {
            currentMissionsArray.splice(index , 1);
        }
    }
    missionsArray = currentMissionsArray;
    localStorage.setItem("missionsArray" , JSON.stringify(missionsArray));
    count = count - 1 ; 
    if (count < 0) {
        count = 0;
    }
    localStorage.setItem("savedMissionCount" , count);
    isNoteDeleted = true;
    createNewNote();
    isNoteDeleted = false;
}

// updating new id if it is already exists
function updateIdIfAlreadyExists() {
    let currentMissionsArray = +JSON.parse(localStorage.getItem("missionsArray"));
    if (currentMissionsArray == 0) {
        noteId = 0;
        return;
    }
    else if (currentMissionsArray.length == 0) {
        noteId = 0;
        return;
    }
    noteId = biggestId(); 
    
    return;
}
// making sure the new note ID will not be the same as an exist note
function biggestId() {
    let currentMissionsArray = JSON.parse(localStorage.getItem("missionsArray"));
    let maxId = currentMissionsArray[0].id;
    for (let index = 0; index < currentMissionsArray.length; index++) {
        if (currentMissionsArray[index].id > maxId) {
            maxId = currentMissionsArray[index].id
        }
    }
    return maxId;
}

// init the input background after an error
function initBackgroundColor() {
    let inputBoxes = getInputBoxes();
    (inputBoxes.mission).style.backgroundColor = "";
    (inputBoxes.date).style.backgroundColor = "";
    return;
}
// init form, after the user create his mission
function clearForm() {
    initBackgroundColor();
    let inputBoxes = getInputBoxes();
    (inputBoxes.mission).value = "";
    (inputBoxes.date).value = "";
    (inputBoxes.time).value = "";
    return;
}

// define boxes input for use in many functions
function getInputBoxes() {
    let missionTextBox = document.getElementById("missionText");
    let missionDateBox = document.getElementById("missionDate");
    let missionTimeBox = document.getElementById("missionTime");
    let boxes = {
        mission : missionTextBox , 
        date : missionDateBox ,
        time : missionTimeBox
    }
    return boxes;
}

// on load show exists tasks from local storage
function showCurrentTasks() {
    setMinDate();
    isPageLoaded = true;
    createNewNote();
    isPageLoaded = false;
}