export interface ConsumeJsonGeneric {
  datos: Map<string, any>;
}

export interface ConsumeUsuario {
  datos: {
    email: string;
    login: string;
    idcar: any[];  // Ajustar el tipo según lo esperado para este campo
    nameusr: string;
    password: string;
    typeusr: string | number;  // Según lo que se espera del servicio
  };
  // Otros campos si es necesario
}
