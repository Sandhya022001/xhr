
let cl = console.log;

const postContainer = document.getElementById('postContainer')
const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const contentControl = document.getElementById('content')
const submitBtn = document.getElementById('submitBtn')
const updateBtn = document.getElementById('updateBtn')

let baseUrl = `https://jsonplaceholder.typicode.com/posts`;
let postArray = []

const createCard = (postobj) => {

    let div = document.createElement('div');
    div.className = 'card mb-4'
    div.innerHTML = `
    <div class="card-header">${postobj.title}</div>
    <div class="card-body">${postobj.body}</div>
    <div class="card-footer text-right">
         <button class='btn btn-primary' onClick ='onEdit(this)'> Edit </button>
         <button class='btn btn-danger' onClick ='onDelete(this)'> Delete </button>
    </div>
  `
    postContainer.append(div)

}


const onEdit =(ele) => {
	cl(ele.closest('.card').id)
	let id = ele.closest('.card').id;
    localStorage.setItem('updateId' , id)
	let getsingleObjUrl =`${baseUrl}/${id}`
	 makeApiCall('GET' ,getsingleObjUrl, null);
     updateBtn.classList.remove('d-none')
	 submitBtn.classList.add('d-none')
}

const onDelete = (ele) => {
       let deleteid= ele.closest('.card').id;
       cl(deleteid);
       let deleteUrl = `${baseUrl}/${deleteid}`
       makeApiCall('DELETE', deleteUrl , null);
       ele.closest('.card').remove()
}

const templating = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += `
                    <div class="card mb-4" id="${post.id}">
                        <div class="card-header">${post.title}</div>
                        <div class="card-body">${post.body}</div>
                        <div class="card-footer text-right">
                             <button class='btn btn-primary' onClick ='onEdit(this)'> Edit </button>
                             <button class='btn btn-danger' onClick ='onDelete(this)'> Delete </button>
                        </div>
                    </div>
        `
    });
    postContainer.innerHTML = result;
}



const makeApiCall = (methodName , apiUrl ,body) =>{

    let xhr = new XMLHttpRequest()
    xhr.open(methodName , apiUrl)
 
    xhr.onload = function () {
        if (this.status === 200 ) {
         postArray = JSON.parse(this.response)
		 if(Array.isArray(JSON.parse(this.response))){
			   templating(postArray)
		 }
		 else if(methodName === 'GET'){
			titleControl.value = postArray.title;
            contentControl.value = postArray.body
		 }
		 
   
    }else if(this.status === 201){
        createCard(body)
    }
}
    xhr.send(JSON.stringify(body));

}

makeApiCall('GET', baseUrl , null)

 let xhr = new XMLHttpRequest();


const onPostSubmit = (eve) => {
    eve.preventDefault()
    let obj = {
        title: titleControl.value,
        body: contentControl.value,
        userId: Math.floor(Math.random() * 11)
    }
    // cl(obj)
    eve.target.reset()
    // let xhr = new XMLHttpRequest();
    makeApiCall('POST', baseUrl, obj)
}

const onPostUpdate = (eve) => {
    let id =localStorage.getItem('updateId');
    let updateUrl= `${baseUrl}/${id}`;
    makeApiCall('PATCH', updateUrl);
    let obj={
         title : titleControl.value,
         body : contentControl.value
          }
          makeApiCall('PATCH', updateUrl, JSON.stringify(obj));
          postForm.reset();
          updateBtn.classList.add('d-none');
          submitBtn.classList.remove('d-none');
          let card = document.getElementById(id);
          cl(card);
          card.innerHTML =`
          <div class="card-header">${obj.title}</div>
          <div class="card-body">${obj.body}</div>
          <div class="card-footer text-right">
               <button class='btn btn-primary' onClick ='onEdit(this)'> Edit </button>
               <button class='btn btn-danger' onClick ='onDelete(this)'> Delete </button>
          </div>
          `
}


postForm.addEventListener('submit', onPostSubmit)
updateBtn.addEventListener('click', onPostUpdate)

