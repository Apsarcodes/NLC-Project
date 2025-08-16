let ipStr = document.getElementById("ipStr");
let opStr = document.getElementById("opStr");
let ipLan = document.getElementById("ipLan");
let opLan = document.getElementById("opLan");
let btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  if (ipStr.value !== "") {
    const url = "https://text-translator2.p.rapidapi.com/translate";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "28a1aa8d66msh6d641cebad4d626p1c4f86jsn6d655bf181a3",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      body: new URLSearchParams({
        source_language: ipLan.value,
        target_language: opLan.value,
        text: ipStr.value,
      }),
    };

    try {
      const promise = fetch(url, options);
      promise
        .then((v1) => {
          return v1.json();
        })
        .then((v2) => {
          console.log(typeof ipStr.value);
          console.log(opStr.value);
          console.log(ipLan.value);
          console.log(opLan.value);
          console.log(v2);
          try {
            opStr.value = v2.data.translatedText;
          } catch {
            opStr.placeholder = v2.message;
          }
        });
      // const result = response.text();
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Input Can't be Empty");
  }
});

function ajaxFun(str) {
  console.log(str);

  const url = "https://text-translator2.p.rapidapi.com/translate";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "28a1aa8d66msh6d641cebad4d626p1c4f86jsn6d655bf181a3",
      "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
    },
    body: new URLSearchParams({
      source_language: ipLan.value,
      target_language: opLan.value,
      text: str,
    }),
  };


  const promise = fetch(url, options);
  promise
    .then((v1) => {
      return v1.json();
    })
    .then((v2) => {
      // console.log(typeof ipStr.value);
      // console.log(opStr.value);
      // console.log(ipLan.value);
      // console.log(opLan.value);
      // console.log(v2);
      try {
        opStr.value = v2.data.translatedText;
      } catch {
        opStr.placeholder = v2.message;
      }
    });

}