const form = document.getElementById("uploadForm");
var element = false;

const sendFiles = async () => {
  let insertHtml = `
<!-- loading -->
<div id="loading" class="is-hide">
    <div class="cv-spinner">
        <span class="spinner"></span>
        <p id="loadingletter">Now loading...</p>
    </div>
</div>
<!-- loading -->
`;
  document
    .getElementsByTagName("body")[0]
    .insertAdjacentHTML("afterbegin", insertHtml);
  showLoading();
  if (element) {
    var rmelement = document.getElementsByClassName("inline");
    var len = rmelement.length;
    for (var i = 0; i < len; i++) {
      var e = rmelement[0];
      e.parentNode.removeChild(e);
    }
  }
  let processing = document.getElementById("processing").value;
  let start = Date.now();
  const files = document.getElementById("inputFiles").files;

  const formData = new FormData();

  Object.keys(files).forEach((key) => {
    formData.append("photos", files.item(key));
  });

  const response = await fetch(`/upload?processing=${processing}`, { // Fetch data from backend
    method: "POST",
    body: formData,
  });

  const json = await response.json();
  let timing = Date.now() - start;

  const h2 = document.querySelector("h2");
  h2.textContent = `${json?.status}`;

  // const h3 = document.querySelector('h3')
  // h3.textContent = json?.message

  const p = document.querySelector("p"); // Update p tag
  p.textContent = `${timing} ms`;

  // const img = document.querySelector('img')
  // img.src = `data:image/jpeg;base64,${json?.message[0]}`

  for (let n = 0; n < json?.message.length; ++n) { // Creage image content for the number of images
    const imglist = document.getElementById("imagelist");
    const div = document.createElement("div");
    div.className = "inline";
    let image = imglist.appendChild(div);
    // const img = document.createElement('img');
    const img = new Image(300); // Create image
    img.src = `data:image/jpeg;base64,${json?.message[n]}`;
    // document.body.append(img); // Append in html
    // const newLine = document.createElement("br");
    image.appendChild(img);
    // document.body.append(newLine);
    const button = document.createElement("button"); // Add Download button under each photo
    button.className = "btn";
    button.setAttribute("type", "submit");
    const divimg = document.createElement("div");
    let image1 = div.appendChild(divimg);
    image1.className = "center";
    button.textContent = "Download";
    button.addEventListener(
      "click",
      () => {
        //a要素を生成
        let element = document.createElement("a");
        //a要素のhref属性を設定
        element.href = img.src;
        //a要素のdownload属性を設定
        element.download = "sample.png";
        //a要素のtarget属性を設定
        element.target = "_blank";
        //a要素のクリック実行
        element.click();
      },
      false
    );
    image1.appendChild(button); // Append in html
    // document.body.appendChild(newLine);
    element = true;
  }

  console.log(json);
  console.log(document.getElementsByTagName("body")[0]);
  hideLoading();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendFiles();
});

function showLoading() {
  document.getElementById("loading").classList.remove("is-hide");
}

function hideLoading() {
  document.getElementById("loading").remove();
}
