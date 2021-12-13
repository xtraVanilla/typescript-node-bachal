async function submit(e) {
  e.preventDefault();

  const input = document.querySelector("#message");

  if (input) {
    const res = await fetch("http://localhost:3000/data", {
      method: "post",
      //@ts-ignore
      body: JSON.stringify({ message: input.value }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    const respHeading = document.querySelector("#yourmessage");

    if (respHeading) {
      respHeading.innerHTML = `Your message: ${data.message}`;
    }

    //@ts-ignore
    input.value = "";
  }
}

document.querySelector("#submitbutton")?.addEventListener("click", submit);
