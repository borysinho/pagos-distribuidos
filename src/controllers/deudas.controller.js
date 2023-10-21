import deudaService from "../services/deuda.service.js";

const getAllDeudas = async (req, res) => {
  try {
    const allDeudas = await deudaService.getAllDeudas();
    res.json(allDeudas);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getDeuda = async (req, res) => {
  try {
    const deuda = await deudaService.getDeuda(parseInt(req.params.id));
    res.json(deuda);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getDeudasPersona = async (req, res) => {
  try {
    const deudas = await deudaService.getDeudasPersona(parseInt(req.params.id));
    const montoTotalDeuda = (
      await deudaService.getMontoTotalDeudas(parseInt(req.params.id))
    ).toString();
    const montoTotalDeudaPagada = (
      await deudaService.getMontoTotalDeudasPagadas(parseInt(req.params.id))
    ).toString();
    res.json({
      Deudas: deudas,
      MontoTotalDeudas: montoTotalDeuda,
      MontoTotalDeudaPagada: montoTotalDeudaPagada,
      MontoTotalDeudaPendiente: (
        parseFloat(montoTotalDeuda) - parseFloat(montoTotalDeudaPagada)
      ).toString(),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default { getAllDeudas, getDeuda, getDeudasPersona };
