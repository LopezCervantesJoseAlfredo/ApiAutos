const AutoSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID del auto',
        example: 1
      },
      marca: {
        type: 'string',
        description: 'Marca del auto',
        example: 'Toyota'
      },
      modelo: {
        type: 'string',
        description: 'Modelo del auto',
        example: 'Corolla'
      },
      year: {
        type: 'integer',
        description: 'Año del auto',
        example: 2020
      },
      color: {
        type: 'string',
        description: 'Color del auto',
        example: 'Rojo'
      }
    }
  };
  
  module.exports = {
    AutoSchema
  };
  