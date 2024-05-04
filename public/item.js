
function nextImage() {
  const imageContainer = document.querySelector('.image-container');
  const scrollAmount = imageContainer.scrollLeft + imageContainer.clientWidth;
  imageContainer.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });
}

function prevImage() {
  const imageContainer = document.querySelector('.image-container');
  const scrollAmount = imageContainer.scrollLeft - imageContainer.clientWidth;
  imageContainer.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });
}


// Check if the user prefers dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')) {
  // User prefers dark mode
  console.log("User prefers dark mode.");
  console.log(window.matchMedia,window.matchMedia('(prefers-color-scheme: dark)').matches);
} else {
  // User prefers light mode
  console.log("User prefers light mode.");
}



function toggleUpdateForm() {
  const updateForm = document.getElementById('updateForm');
  updateForm.style.display = (updateForm.style.display === 'none' || updateForm.style.display === '') ? 'block' : 'none';
}
function submitForm() {
  document.getElementById('uploadForm').submit();
}
// var buttons=document.getElementsByClassName('add-to-cart-btn')
// for(let btn of buttons){
//   btn.addEventListener('click', function() {
//     // Get the container element
//     var container = document.getElementsByClassName('cart')[0];
//     console.log('hellow')
//     // Scroll the container to the bottom       m
//     container.scrollTop = container.scrollHeight;
//   });
// }
var hidden=true;
function show_sub_comment(id){
  if(hidden)
    $(`#${id}`)[0].style.display='flex'
  else
    $(`#${id}`)[0].style.display='none'
  hidden=!hidden
}
function like_handler(id,object,user_id){
  $.ajax({
    method: 'post',
    url: `/likes/${id}/${object}`,
    // data: $(element).serialize(),
    success: (data) => {
        if (!data.removed) {
          $('#' + id+'-btn').css('background', 'red');
          like_notify(id,user_id,object)
          }
        else $('#' + id+'-btn').css('background', '#dfdfdf'); 
        
        $('#' + id+'-qnt').html(data.count) 
    },
    error: (err) => console.log(err)
});
}
