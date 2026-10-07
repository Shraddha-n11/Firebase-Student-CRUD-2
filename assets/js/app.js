var cl=console.log;

const form=document.getElementById("form");
const spinner=document.getElementById("spinner");
const name=document.getElementById("name");
const Grade=document.getElementById("Grade");
const contact=document.getElementById("contact");
const SubmitBtn=document.getElementById("SubmitBtn");
const UpdateBtn=document.getElementById("UpdateBtn");
const data=document.getElementById("data");


const BASE_URL="https://xhr-1st-crud-default-rtdb.firebaseio.com"
const std_URL=`${BASE_URL}/std.json`;

let stdarr=[];

//toggle
function Ontoggle(){
    spinner.classList.toggle("d-none")
}


//Templating

function Templating(eve,i) {
    let result = ``;
    eve.forEach((ele, i) => {
        result += `
            <tr id="${ele.id}">
                <td>${i+1}</td>
                <td>${ele.name}</td>
                <td>${ele.Grade}</td>
                <td>${ele.contact}</td>
                <td><i onclick="OnEdit(this)"class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                <td><i onclick="OnDelete(this)"class ="fa-solid fa-trash-can fa-2x text-danger"></i></td>
            </tr>`;
    });
    data.innerHTML = result;
}

//Read

function OnRead(eve){
    let xhr=new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/std.json`)
    Ontoggle();
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res=JSON.parse(xhr.response)
            stdarr=[];
            for (const key in res){
                res[key].id=key;
                stdarr.push(res[key])
            }
            Templating(stdarr);
        }else{
            cl("error")
        }
        Ontoggle();
    }
}
OnRead(stdarr);

//Create

function Createtodo(ele){
    ele.preventDefault();
    let obj={
        name:name.value.trim(),
        Grade:Grade.value.trim(),
        contact:contact.value.trim()
    }
    let xhr=new XMLHttpRequest()
    xhr.open("POST",`${std_URL}`)
    Ontoggle();
    xhr.send(JSON.stringify(obj));
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            obj.id=res.name;
            let tr=document.createElement("tr")
            tr.id=res.name;
            cl(res);
            form.reset();
            Swal.fire({
                title: "Created!",
                text: "Subject created successfully.",
                icon: "success"
            })
            OnRead();
        } else {
            cl("Error");
        }
        Ontoggle();
    };
}



// Edit

function OnEdit(eve){
    let Edit_Id = eve.closest("tr").id;
    localStorage.setItem("Edit_Id",Edit_Id)
    let xhr= new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/std/${Edit_Id}.json`);
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <=299){
    let res= JSON.parse(xhr.response)
    cl(res)
    name.value=res.name;
    Grade.value=res.Grade;
    contact.value=res.contact;
    SubmitBtn.classList.add("d-none");
    UpdateBtn.classList.remove("d-none")
        }else{
            cl("error")
    }

}
}

//Update

function Onupdate(eve){
    let Update_Id=localStorage.getItem("Edit_Id")
    let Upobj={
        name:name.value,
        Grade:Grade.value,
        contact:contact.value,
    }
    let xhr= new XMLHttpRequest();
    xhr.open("PATCH",`${BASE_URL}/std/${Update_Id}.json`);
         Ontoggle();
        xhr.send(JSON.stringify(Upobj));
        xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res= JSON.parse(xhr.response);
            let td=document.getElementById(Update_Id).children;
            td[1].innerHTML=Upobj.name,
            td[2].innerHTML=Upobj.Grade,
            td[3].innerHTML=Upobj.contact,
            SubmitBtn.classList.remove("d-none");
            UpdateBtn.classList.add("d-none");
            localStorage.removeItem("Edit_Id")
            form.reset();
            Swal.fire({
                title: "Updated!",
                text: "Subject updated successfully.",
                icon: "success"
            })
        }else{
            cl("error")
        }
        Ontoggle();
}
}

//Delete

function OnDelete(eve) {
    let Remove_Id=eve.closest("tr").id;
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    let xhr=new XMLHttpRequest();
    xhr.open("DELETE", `${BASE_URL}/std/${Remove_Id}.json`)
    Ontoggle();
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            eve.closest("tr").remove();
            let td=[...document.querySelectorAll("#data tr td:first-child")]
            td.forEach((eve, i)=>{
                eve.innerHTML=i+1;
            })
    }else{
        cl("error")
    }
    Ontoggle();
}
  }
})
}




//Event Listners

form.addEventListener("submit", Createtodo);
UpdateBtn.addEventListener("click", Onupdate);