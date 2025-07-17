document.getElementById("form1").addEventListener("submit", submitFun1);
document.getElementById("refreshBtn").addEventListener("click", refreshAttendance);

var studentDataArr = JSON.parse(localStorage.getItem("studentData")) || [];
// Load previous attendance history or initialize empty array.
var attendanceHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || [];

function submitFun1(e) {
    e.preventDefault();
    var name = document.querySelector("#name").value;
    var number = document.querySelector("#number").value;
    var city = document.querySelector("#city").value;
    var rollNo = document.querySelector("#rollNo").value;

    var studentObj = {
        name: name,
        number: number,
        city: city,
        rollNo: rollNo,
        attendance: "Not Yet Marked"
    };

    studentDataArr.push(studentObj);
    localStorage.setItem("studentData", JSON.stringify(studentDataArr));
    document.querySelector("#form1").reset();
    alert("Student Added Successfully");

    displayFun(studentDataArr);
}

function displayFun(studentDataArr) {
    var tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";
    var count = 1;
    studentDataArr.forEach(function (item, index) {
        var tr = document.createElement("tr");
        tr.id = "row-" + index; // for deletion animation

        var td1 = document.createElement("td");
        td1.innerHTML = count++;

        var td2 = document.createElement("td");
        td2.innerHTML = item.name;

        var td3 = document.createElement("td");
        td3.innerHTML = item.number;

        var td4 = document.createElement("td");
        td4.innerHTML = item.city;

        var td5 = document.createElement("td");
        td5.innerHTML = item.rollNo;

        var td6 = document.createElement("td");
        td6.innerHTML = item.attendance;

        var td7 = document.createElement("td");

        // Edit button: now used to update only the student's name.
        var editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.classList.add("btn", "btn-secondary", "mb-1");
        editBtn.addEventListener("click", function () {
            editStudent(index);
        });

        var deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.classList.add("btn", "btn-danger", "mb-1");
        deleteBtn.addEventListener("click", function () {
            deleteStudent(index);
        });

        td7.append(editBtn, deleteBtn);

        // New line for Present/Absent buttons.
        td7.append(document.createElement("br"));

        var presentBtn = document.createElement("button");
        presentBtn.innerHTML = "Present";
        presentBtn.classList.add("btn", "btn-success", "mb-1");
        presentBtn.addEventListener("click", function () {
            markAttendance(index, "Present");
        });

        var absentBtn = document.createElement("button");
        absentBtn.innerHTML = "Absent";
        absentBtn.classList.add("btn", "btn-warning", "mb-1");
        absentBtn.addEventListener("click", function () {
            markAttendance(index, "Absent");
        });

        td7.append(presentBtn, absentBtn);

        tr.append(td1, td2, td3, td4, td5, td6, td7);
        tbody.append(tr);
    });
}

function editStudent(index) {
    var currentName = studentDataArr[index].name;
    var newName = prompt("Edit Name:", currentName);
    if (newName !== null && newName.trim() !== "") {
        studentDataArr[index].name = newName.trim();
        localStorage.setItem("studentData", JSON.stringify(studentDataArr));
        displayFun(studentDataArr);
        alert("Student name updated successfully");
    }
}

function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        var row = document.getElementById("row-" + index);
        row.classList.add("fade-out"); // trigger fade-out animation
        setTimeout(function () {
            studentDataArr.splice(index, 1);
            localStorage.setItem("studentData", JSON.stringify(studentDataArr));
            displayFun(studentDataArr);
            alert("Student Deleted Successfully");
        }, 500); // duration matching CSS animation
    }
}

function markAttendance(index, status) {
    // Update current attendance in student record.
    studentDataArr[index].attendance = status;
    localStorage.setItem("studentData", JSON.stringify(studentDataArr));
    
    // Create a record for the attendance history.
    var record = {
        name: studentDataArr[index].name,
        rollNo: studentDataArr[index].rollNo,
        status: status,
        date: new Date().toLocaleString()
    };
    attendanceHistory.push(record);
    localStorage.setItem("attendanceHistory", JSON.stringify(attendanceHistory));
    
    displayFun(studentDataArr);
    alert("Marked as " + status);
}

function refreshAttendance() {
    if (confirm("Are you sure you want to reset attendance for all students?")) {
        studentDataArr = studentDataArr.map(function (item) {
            item.attendance = "Not Yet Marked";
            return item;
        });
        localStorage.setItem("studentData", JSON.stringify(studentDataArr));
        displayFun(studentDataArr);
        alert("Attendance reset for the next date.");
    }
}

displayFun(studentDataArr);
