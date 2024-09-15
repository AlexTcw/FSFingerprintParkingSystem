export interface ResponseJsonPage {
    datos:{
        code: number,
        msj: string,
        obj: {
            size: number,
            totalPages: number,
            page: number,
            content: [[]]
            totalElements:number
        },
        value: string
    }
}
