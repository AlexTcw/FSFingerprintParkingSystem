export interface ConsumeJsonGeneric {
  datos: Map<string, any>;
}

export interface ConsumeJsonGenericToken{
  datos:{
    token:string;
  }
}

export interface ConsumeUsuario {
  datos: {
    email: string;
    login: string;
    idcar: any[];
    nameusr: string;
    password: string;
    typeusr: string | number;
  };
}

export interface ConsumeJsonPage{
  "datos": {
    actFlag?:number,
    startDate?: string,
    endDate?: string,
    key?: string,
    type?: string,
    page?:number,
    size?:number
  }
}
