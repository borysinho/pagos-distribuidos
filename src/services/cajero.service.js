import { Worker } from "worker_threads";

let cajerosArray = [];

const addCajero = async (cant) => {
  try {
    // const allDeudas = await prismcant.findMany();
    for (let index = 0; index < cant; index++) {
      const worker = new Worker("./src/job/worker.job.js");
      cajerosArray.push(worker);
      worker.postMessage({ msg: "init", nroCajero: cajerosArray.length });
    }

    console.log(`Se adicionaron ${cant} cajeros`);
    return { "Data: ": `Se adicionaron ${cant} cajeros` };
  } catch (error) {
    throw error;
  }
};

export default { addCajero };
