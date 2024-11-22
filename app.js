
import { db, collection, addDoc,query ,orderBy,  onSnapshot,deleteDoc,doc,updateDoc  } from "./firebase.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
// var firstName, lastName;
// const profilePhotoImg = document.getElementById("profilePhotoImg");
// const profilePhotoInput = document.getElementById("profilePhotoInput");

// profilePhotoImg.addEventListener("click", () => {
//   profilePhotoInput.click();
// });

// profilePhotoInput.addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   const reader = new FileReader();
//   reader.onload = () => {
//     profilePhotoImg.src = reader.result;
//   };
//   reader.readAsDataURL(file);
// });
// signUpForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   firstName = document.getElementById("inputFirstName").value;
//   lastName = document.getElementById("inputLastName").value;
//   console.log(firstName, lastName);

//   const signUpFormContainer = document.getElementById("signUpFormContainer");
//   var postApp = document.getElementById("postApp");

//   signUpForm.reset();
//   Swal.fire({
//     position: "top-end",
//     icon: "success",
//     title: "Account created successfully!",
//     showConfirmButton: false,
//     timer: 1500,
//   });
//   signUpFormContainer.classList.add("hidden");
//   postApp.classList.remove("hidden");
// });

// var backgroundImg;
// function post() {
//   var title = document.getElementById("title");
//   var description = document.getElementById("description");
//   console.log(firstName, lastName);
//   var currentTime = new Date().toLocaleTimeString();
//   if (title.value.trim() && description.value.trim()) {
//     var post = document.getElementById("post");
//     post.innerHTML += `
//    <div class="card p-2 mb-2">
//        <div class="card-header d-flex">
//        <img class="profile-photo" src="${profilePhotoImg.src}" />
//        <div class="name-time d-flex flex-column">
//         ${firstName} ${lastName}
//         <div class="time">${currentTime}</div>
//       </div>
//     </div>
//       <div style="background-image: url(${backgroundImg})" class="card-body">
//         <blockquote class="blockquote mb-0">
//            <p>${title.value}</p>
//            <footer class="blockquote-footer">${description.value}</footer>
//          </blockquote>
//       </div>
//        <div class="card-footer d-flex justify-content-end">
//          <button type="button" onclick="editpost(this)" class="ms-2 btn  editBtn">Edit</button>
//          <button type="button" onclick="deletePost(this)" class="ms-2 btn btn-danger deleteBtn">Delete</button>
//        </div>
//   </div>`;
//     title.value = "";
//     description.value = "";
//   } else {
//     Swal.fire({
//       title: "Empty Post",
//       text: "Can't publish post without Title or Description",
//       icon: "question",
//     });
//   }
// }
let addDocument = async () => {
  try {
    let title_input = document.getElementById("title");
    let desc_input = document.getElementById("description");
    title_input.style.display = "block";
    desc_input.style.display = "block";
    // Adding document to Firestore
    const docRef = await addDoc(collection(db, "Post"), {
      title: title_input.value,
      desc: desc_input.value,
      time: Timestamp.now(),
    });

    console.log("Successfully added document with ID: ", docRef.id);

    // Clear input fields
    title_input.value = '';
    desc_input.value = '';
  } catch (error) {
    console.log("Error adding document: ", error);
  }
};
// Add event listener to button
let button = document.getElementById("button");
button.addEventListener("click", addDocument);

let post = () => {
  try {
    const q = query(collection(db, "Post"), orderBy("time", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let post_data = document.getElementById("post_data");
      post_data.innerHTML = '';

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timeString = data.time ? data.time.toDate() : "No Timestamp";
        post_data.innerHTML += `
          <div class="card p-2 mb-2" data-id="${doc.id}">
              <div class="card-header d-flex">
                  <div class="name-time d-flex flex-column">
                      Anonymous User
                      <div class="time">${timeString}</div>
                  </div>
              </div>
              <div style="background-color: lightgray;" class="card-body">
                  <blockquote class="blockquote mb-0">
                      <p>${data.title}</p>
                      <footer class="blockquote-footer">${data.desc}</footer>
                  </blockquote>
              </div>
              <div class="card-footer d-flex justify-content-end">
                  <button type="button" class="ms-2 btn editBtn">Edit</button>
                  <button type="button" class="ms-2 btn btn-danger deleteBtn">Delete</button>
              </div>
          </div>`;

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
            const post_delete = event.target.closest('.card').getAttribute('data-id');
            console.log('Deleting document with ID:', post_delete);

            try {
              const docRef = doc(db, "Post", post_delete);
              await deleteDoc(docRef);

              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Post Deleted Successfully",
                showConfirmButton: false,
                timer: 1500
              });
            } catch (error) {
              console.log("Error deleting document: ", error);
            }
          });
        });

        const editButtons = document.querySelectorAll('.editBtn');
        editButtons.forEach((button) => {
          button.addEventListener('click', (event) => {
            const post_id = event.target.closest('.card').getAttribute('data-id');
            const title = event.target.closest('.card').querySelector('.title').innerText; // Use innerText
            const desc = event.target.closest('.card').querySelector('.description').innerText; // Use innerText

            document.getElementById("title").value = title;
            document.getElementById("description").value = desc;
            document.getElementById("update").setAttribute("data-id", post_id);
          });
        });
        
      });
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching posts: ", error);
  }
};

let Updated_Post = async () => {
  const id = document.getElementById("update").getAttribute("data-id");
  let title_input = document.getElementById("title");
  let desc_input = document.getElementById("description");

  const washingtonRef = doc(db, "Post", id);

  try {
    await updateDoc(washingtonRef, {
      title: title_input.value,
      description: desc_input.value,
      timestamp: serverTimestamp(),
    });

    alert("Updated Successfully");
  } catch (e) {
    console.error("Error updating document:", e);
  }
};

let updateButton = document.getElementById("update");
if (updateButton) {
  updateButton.addEventListener("click", Updated_Post);
}

post();





// Call the post function

// function selectImg(src) {
//   backgroundImg = src;
//   var bgImg = document.getElementsByClassName("bg-img");

//   for (var i = 0; i < bgImg.length; i++) {
//     bgImg[i].className = "bg-img";
//   }
//   event.target.className += " selectedImg";
// }
// function deletePost(button) {
//   button.parentNode.parentNode.remove();
// }
// function editpost(button) {
//   var card = button.parentNode.parentNode;
//   var title = card.childNodes[3].childNodes[1].childNodes[1].innerHTML;
//   var description = card.childNodes[3].childNodes[1].childNodes[3].innerHTML;
//   document.getElementById("title").value = title;
//   document.getElementById("description").value = description;
//   card.remove();}
