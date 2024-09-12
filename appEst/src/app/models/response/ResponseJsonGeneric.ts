import {Usuario} from "../entity/Usuario";

export interface ResponseJsonGeneric {
  datos: {
    code: number;
    msj: string;
    obj: Usuario[];
    value: string;
  };
}
