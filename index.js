async function postLoader() {
  let dat = await fetch("https://jsonplaceholder.typicode.com/posts");
  dat = await dat.json();
  let ul = document.createElement("ul");
  dat.forEach((item) => {
    let li = document.createElement("li");
    li.innerHTML = `<p class = "postIds">UserId: ${item.userId}</p> <p class = "postIds">PostId:${item.id}</p> <p class="postTitle">${item.title}</p> <p class="postBody">${item.body}</p>`;
    li.classList.add("post");
    ul.append(li);
  });
  document.body.append(ul);
}
postLoader();
