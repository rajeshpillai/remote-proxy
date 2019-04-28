const remote = require("../src").createClient({
  host: "127.0.0.1"
});

async function handleClientRequest() {
  try {
    const result1 = remote.add(5, 2).then((data) => {
      console.log(`First result: ${data}`);
    });

    // const result2 = await remote.add(10, 10);
    // console.log(`Second result: ${result2}`);
  } catch (error) {
    console.log(`Catched Error: ${error}`);
  }
}

handleClientRequest();
