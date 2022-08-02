window.onload = function () {
  document.body.classList.add("loaded_hiding");
  window.setTimeout(function () {
    document.body.classList.add("loaded");
    document.body.classList.remove("loaded_hiding");
  }, 500);
  let searchInput = document.querySelector(".searchInput");
  searchInput.addEventListener("keyup", () => {
    search(searchInput.value);
  });
  deleteLoader();
};

const fetchData = async (skip, limit, word) => {
  let url = word
    ? `https://dummyjson.com/posts/search?q=${word}`
    : `https://dummyjson.com/posts?skip=${skip}&limit=${limit}`;
  let dat = await fetch(url);
  dat = await dat.json();
  return { data: dat.posts, total: dat.total };
};

function renderPosts(dat) {
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

    getLikes(item,img);

    img.addEventListener("click", () => {
      likes(item, img);
    });

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

function renderPagination(count) {
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
      document.querySelector(".searchInput").value = "";
      document.querySelector(".postList").remove();
      document.querySelectorAll(".paginatorItem").forEach((item) => {
        item.classList.remove("active");
      });
      renderPostsList((e.target.textContent - 1) * 10, 10);
      updatePaginator(e.target.textContent, cntr);
    }
  });
}

function updatePaginator(current, last) {
  let paginator = document.querySelector(".paginator");
  if (current <= 3) {
    formationPaginator(paginator, last, current, 4, last - 1, 0);
  } else {
    if (current >= last - 2) {
      formationPaginator(paginator, last, current, 1, 0, 1);
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

function formationPaginator(paginator, last, current, a, b, num) {
  while (paginator.firstChild) {
    paginator.removeChild(paginator.firstChild);
  }
  for (let i = 0; i < last; ++i) {
    if (i === a) {
      let paginatorItem = document.createElement("div");
      paginatorItem.classList.add("paginatorSkiper");
      paginatorItem.textContent = `...`;
      paginator.append(paginatorItem);
    } else {
      if (i === b) {
        let paginatorItem = document.createElement("div");
        paginatorItem.classList.add("paginatorItem");
        paginatorItem.textContent = `${i + 1}`;
        paginator.append(paginatorItem);
      } else {
        if (comparePaginator(i, last, num)) {
          let paginatorItem = document.createElement("div");
          paginatorItem.classList.add("paginatorItem");
          paginatorItem.textContent = `${i + 1}`;
          if (i + 1 == current) {
            paginatorItem.classList.add("active");
          }
          paginator.append(paginatorItem);
        }
      }
    }
  }
}

function comparePaginator(i, last, num) {
  if (num === 0) {
    if (i < 4) {
      return true;
    } else {
      return false;
    }
  }
  if (num === 1) {
    if (i >= last - 4) {
      return true;
    } else {
      return false;
    }
  }
}

const app = async () => {
  const dat = await fetchData(0, 10);
  renderPosts(dat.data);
  renderPagination(dat.total);
  document.querySelector(".paginatorItem").classList.add("active");
};

async function renderPostsList(skip, limit) {
  createLoader();
  const dat = await fetchData(skip, limit);
  renderPosts(dat.data);
  deleteLoader();
}

async function search(word) {
  if (word.length === 0) {
    const dat = await fetchData(0, 10);
    document.querySelector(".postList").remove();
    renderPosts(dat.data);
  } else {
    const dat = await fetchData(0, 0, word);
    document.querySelector(".postList").remove();
    renderPosts(dat.data);
  }
}

function createLoader() {
  let preloader = document.createElement("div");
  preloader.classList.add("preloader");
  let preloaderRow = document.createElement("div");
  preloaderRow.classList.add("preloader__row");
  let preloaderItem = document.createElement("div");
  preloaderItem.classList.add("preloader__item");
  let preloaderItem2 = document.createElement("div");
  preloaderItem2.classList.add("preloader__item");
  preloaderRow.append(preloaderItem);
  preloaderRow.append(preloaderItem2);
  preloader.append(preloaderRow);
  document.body.classList.remove("loaded");
  document.body.append(preloader);
}

function deleteLoader() {
  let preloader = document.querySelector(".preloader");
  preloader.remove();
}

function likes(item, element) {
  if (!element.classList.contains("liked")) {
    console.log("here");
    element.classList.add("liked");
    element.nextSibling.textContent =
      Number(element.nextSibling.textContent) + 1;
    localStorage.setItem(item.id, Number(element.nextSibling.textContent));
  } else {
    element.classList.remove("liked");
    element.nextSibling.textContent =
      Number(element.nextSibling.textContent) - 1;
    localStorage.removeItem(item.id);
  }
}

function getLikes(item,element) {
if(localStorage.getItem(item.id)){
  element.classList.add("liked");
  element.nextSibling.textContent =
      Number(element.nextSibling.textContent) + 1;
}
}

app();
