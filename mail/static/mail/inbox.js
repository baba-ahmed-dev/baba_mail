document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
  document.querySelector('#combose-submit').addEventListener('click',func);

} 

function reply(sender , subject,time , body){
  compose_email()
  document.querySelector('#compose-recipients').value = sender;
  document.querySelector('#compose-subject').value = `Re: ${subject}`;
  document.querySelector('#compose-body').value = `On ${time} ${sender} wrote : ${body}`;
} 

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3> `;
  
  
  if(mailbox == 'inbox'){
    getdata()
  }else if(mailbox == 'sent'){
    getdataSent()
  }else if(mailbox == 'archive'){
    getdataArchived()
  }else if(mailbox == 'view'){
    viewEmail
  }
  
}


// sent mail
function func(){
  fetch("/emails",{
    method:"POST",
    body: JSON.stringify({
    recipients : document.querySelector('#compose-recipients').value,
    subject : document.querySelector('#compose-subject').value,
    body : document.querySelector('#compose-body').value
   })
  })
  .then(resonse => resonse.json())
  .then(() => load_mailbox('sent'));
  
}
   


 // view email for inbox , archived
 function viewEmail(id){
  fetch("/emails/"+id).then(response => response.json()).then(element => {
      load_mailbox('view');
      const myDiv = document.createElement('div');
      const attr = document.createAttribute('class');
      attr.value = 'myDiv';
      myDiv.setAttributeNode(attr);
      document.querySelector('#emails-view').append(myDiv);
      myDiv.innerHTML = `
        <div class="view">
        <h4> from : ${element.sender}</h4>
        <h4> to : ${element.recipients}</h4>
        <h5>Subject : ${element.subject}<h5/>
        <h5>body : ${element.body}<h5/>
        <p> timestamp : ${element.timestamp}</p>
        <button id='arch' class='btn buttonTwo'>${element.archived ? 'unarchive' : 'archive'} </button>
        <button id='reply' class='btn buttonTwo'> reply </button>
        </div>  
      `
      fetch('/emails/'+id , {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })
      
      document.querySelector('#arch').addEventListener('click',function(){
        let status = element.archived ? false : true
        fetch('/emails/'+id , {
          method : "PUT",
          body : JSON.stringify({
            archived : status
          })
        })
        .then(()=>load_mailbox('inbox'))
        
      })
     
      document.querySelector('#reply').addEventListener('click',function(){
        reply(element.sender,element.subject, element.timestamp ,element.body);
      })
  });
 }


 // get inbox emails
function getdata(){
  fetch("/emails/inbox").then(response => response.json()).then(result => {
    result.forEach(element => {
      const myDiv = document.createElement('div');
      const attr = document.createAttribute('class');
      attr.value = 'myDiv';
      myDiv.setAttributeNode(attr);
      if(element.read == true){
        myDiv.style.background = 'rgba(242,245,245,0.8)'
      }else{
        myDiv.style.background = '#fff'
      }
      myDiv.addEventListener('click',function(){viewEmail(element.id)});
      document.querySelector('#emails-view').append(myDiv);
      myDiv.innerHTML = `
        <span class='sp1'>${element.sender}</span>
        <span class='sp2'>${element.subject}</span>
        <span class='sp3'>${element.timestamp}</span>
      `
    });
  });
};

// get send emails
function getdataSent(){
  fetch("/emails/sent").then(response => response.json()).then(result => {
    result.forEach(element => {
      const myDiv = document.createElement('div');
      const attr = document.createAttribute('class');
      attr.value = 'myDiv';
      myDiv.setAttributeNode(attr);
      document.querySelector('#emails-view').append(myDiv);
      myDiv.innerHTML = `
      <span class='sp1'>${element.recipients}</span>
      <span class='sp2'>${element.subject}</span>
      <span class='sp3'>${element.timestamp}</span>
      `
      myDiv.addEventListener('click',function(){viewEmailSent(element.id)});
    });
  });
};
// get archived emails
function getdataArchived(){
  fetch("/emails/archive").then(response => response.json()).then(result => {
    result.forEach(element => {
      const myDiv = document.createElement('div');
      const attr = document.createAttribute('class');
      attr.value = 'myDiv';
      myDiv.setAttributeNode(attr);
      document.querySelector('#emails-view').append(myDiv);
      myDiv.innerHTML = `
      <span class='sp1'>${element.sender}</span>
      <span class='sp2'>${element.subject}</span>
      <span class='sp3'>${element.timestamp}</span>
      `
      myDiv.addEventListener('click',function(){viewEmail(element.id)});
      
    });
  });
};
// view for sent
function viewEmailSent(id){
  fetch("/emails/"+id).then(response => response.json()).then(element => {
      load_mailbox('view');
      document.querySelector('#emails-view').innerHTML = `
        <h2>View</div>
        <div class="myDiv view">
        <h4> from : ${element.sender}</h4>
        <h4> to : ${element.recipients}</h4>
        <h5>Subject : ${element.subject}<h5/>
        <h5>body : ${element.body}<h5/>
        <p> timestamp : ${element.timestamp}</p>
        </div>  
      `   
  });
 }