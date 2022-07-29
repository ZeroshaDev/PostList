window.onload = function () {
  document.body.classList.add("loaded_hiding");
  window.setTimeout(function () {
    document.body.classList.add("loaded");
    document.body.classList.remove("loaded_hiding");
  }, 500);
};

const fetchData = async (skiped, limit) => {
  let dat = await fetch(
    `https://dummyjson.com/posts?skip=${skiped}&limit=${limit}`
  );
  dat = await dat.json();
  return { data: dat.posts, total: dat.total };
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

    let postTags = document.createElement("p");
    postTags.classList.add("postTags");
    postTags.textContent = "#" + item.tags.join(" #");

    let postReactions = document.createElement("div");
    postReactions.classList.add("postReactions");
    let img = document.createElement("img");
    img.src = "rsource/favorite_FILL0_wght300_GRAD-25_opsz20.svg";
    postReactions.append(img);
    postReactions.append(item.reactions);

    li.append(userId);
    li.append(postId);
    li.append(postTitle);
    li.append(postBody);
    li.append(postTags);
    li.append(postReactions);
    ul.append(li);
  });
  document.body.append(ul);
}

function pagination(count) {
  let paginator = document.querySelector(".paginator");
  let cntr = count % 10 ? count / 10 + 1 : count / 10;
  for (let i = 0; i < cntr; ++i) {
    if (i === 4) {
      let paginatorItem = document.createElement("div");
      paginatorItem.classList.add("paginatorSkiper");
      paginatorItem.textContent = `...`;
      paginator.append(paginatorItem);
    } else {
      if (i === cntr - 1) {
        let paginatorItem = document.createElement("div");
        paginatorItem.classList.add("paginatorItem");
        paginatorItem.textContent = `${i + 1}`;
        paginator.append(paginatorItem);
      } else {
        if (i < 4) {
          let paginatorItem = document.createElement("div");
          paginatorItem.classList.add("paginatorItem");
          paginatorItem.textContent = `${i + 1}`;
          paginator.append(paginatorItem);
        } else {
          continue;
        }
      }
    }
  }
  paginator.addEventListener("click", (e) => {
    if (e.target.classList == "paginatorItem") {
      document.querySelector(".postList").remove();
      document.querySelectorAll(".paginatorItem").forEach((item) => {
        item.classList.remove("active");
      });
      render((e.target.textContent - 1) * 10, 10);
      paginatorReRender(e.target.textContent, cntr);
    }
  });
}

function paginatorReRender(current, last) {
  let paginator = document.querySelector(".paginator");
  if (current <= 3) {
    while (paginator.firstChild) {
      paginator.removeChild(paginator.firstChild);
    }
    for (let i = 0; i < last; ++i) {
      if (i === 4) {
        let paginatorItem = document.createElement("div");
        paginatorItem.classList.add("paginatorSkiper");
        paginatorItem.textContent = `...`;
        paginator.append(paginatorItem);
      } else {
        if (i === last - 1) {
          let paginatorItem = document.createElement("div");
          paginatorItem.classList.add("paginatorItem");
          paginatorItem.textContent = `${i + 1}`;
          paginator.append(paginatorItem);
        } else {
          if (i < 4) {
            let paginatorItem = document.createElement("div");
            paginatorItem.classList.add("paginatorItem");
            paginatorItem.textContent = `${i + 1}`;
            if (i + 1 == current) {
              paginatorItem.classList.add("active");
            }
            paginator.append(paginatorItem);
          } else {
            continue;
          }
        }
      }
    }
  } else {
    if (current >= last - 2) {
      while (paginator.firstChild) {
        paginator.removeChild(paginator.firstChild);
      }
      for (let i = 0; i < last; ++i) {
        if (i === 1) {
          let paginatorItem = document.createElement("div");
          paginatorItem.classList.add("paginatorSkiper");
          paginatorItem.textContent = `...`;
          paginator.append(paginatorItem);
        } else {
          if (i === 0) {
            let paginatorItem = document.createElement("div");
            paginatorItem.classList.add("paginatorItem");
            paginatorItem.textContent = `${i + 1}`;
            paginator.append(paginatorItem);
          } else {
            if (i >= last - 4) {
              let paginatorItem = document.createElement("div");
              paginatorItem.classList.add("paginatorItem");
              paginatorItem.textContent = `${i + 1}`;
              if (i + 1 == current) {
                paginatorItem.classList.add("active");
              }
              paginator.append(paginatorItem);
            } else {
              continue;
            }
          }
        }
      }
    } else {
      if (paginator.childElementCount < 9) {
        while (paginator.childElementCount !== 9) {
          let paginatorItem = document.createElement("div");
          paginatorItem.classList.add("paginatorItem");
          paginatorItem.textContent = `.`;
          paginator.append(paginatorItem);
        }
      }
      let currentCounter = -2;
      paginator.childNodes.forEach((item, i) => {
        item.classList = "";
        switch (i) {
          case 0:
            item.textContent = 1;
            item.classList.add("paginatorItem");
            break;
          case 1:
            item.textContent = "...";
            item.classList.add("paginatorSkiper");
            break;
          case 7:
            item.textContent = "...";
            item.classList.add("paginatorSkiper");
            break;
          case 8:
            item.textContent = last;
            item.classList.add("paginatorItem");
            break;
          default:
            item.textContent = Number(current) + currentCounter;
            if (Number(current) + currentCounter == current) {
              item.classList.add("active");
            }
            item.classList.add("paginatorItem");
            currentCounter++;
            break;
        }
      });
    }
  }
}

const app = async () => {
  const dat = await fetchData(0, 10);
  pagination(dat.total);
  postLoader(dat.data);
  document.querySelector(".paginatorItem").classList.add("active");
};

async function render(skip, limit) {
  document.body.classList.remove("loaded");
  const dat = await fetchData(skip, limit);
  postLoader(dat.data);
  document.body.classList.add("loaded_hiding");
  window.setTimeout(function () {
    document.body.classList.add("loaded");
    document.body.classList.remove("loaded_hiding");
  }, 500);
}

app();
