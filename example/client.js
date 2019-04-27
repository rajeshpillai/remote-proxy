const remote = require("../src").createClient({
  host: "127.0.0.1"
});

async function handleClientRequest() {
  try {
    const result1 = await remote.add(5, 2);
    console.log(`First result: ${result1}`);
    const result2 = await remote.add(10, 10);
    console.log(`Second result: ${result2}`);
  } catch (error) {
    console.log(`Catched Error: ${error.message}`);
  }
}

handleClientRequest();
