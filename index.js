const fetchData = async () => {
  let dat = await fetch("https://jsonplaceholder.typicode.com/posts");
  dat = await dat.json();
  return [dat, dat.length];
};

function postLoader(dat) {
  let ul = document.createElement("ul");
  ul.classList.add("postList");
  dat.forEach((item) => {
    let li = document.createElement("li");
    li.classList.add("post");

    let userId = document.createElement("p");
    userId.classList.add("postIds");
    userId.textContent = `UserId: ${item.userId}`;

    let postId = document.createElement("p");
    postId.classList.add("postIds");
    postId.textContent = `PostId:${item.id}`;

    let postTitle = document.createElement("p");
    postTitle.classList.add("postTitle");
    postTitle.textContent = item.title;

    let postBody = document.createElement("p");
    postBody.classList.add("postBody");
    postBody.textContent = item.body;

    li.append(userId);
    li.append(postId);
    li.append(postTitle);
    li.append(postBody);
    ul.append(li);
  });
  document.body.append(ul);
}

function pagination(count, data) {
  let paginator = document.querySelector(".paginator");
  let cntr = count % 10 ? count / 10 + 1 : count / 10;
  for (let i = 0; i < cntr; ++i) {
    let paginatorItem = document.createElement("div");
    paginatorItem.classList.add("paginatorItem");
    paginatorItem.addEventListener("click", function (e) {
      document.querySelector(".postList").remove();
      postLoader(
        data.slice(i == 0 ? 0 : i * 10 - 1, paginatorItem.textContent * 10)
      );
      console.log(e.target);
    });
    paginatorItem.textContent = `${i + 1}`;
    paginator.append(paginatorItem);
  }
}

const mainFunction = async () => {
  const dat = await fetchData();
  pagination(dat[1], dat[0]);
  postLoader(dat[0].slice(0, 10));
};

mainFunction();
