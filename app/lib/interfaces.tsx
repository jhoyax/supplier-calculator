export interface Supplier {
    id: number,
    name: string,
    unit_of_purchase: string,
    unit_amount: number,
    unit_code: string,
    price: number,
    isEdit: boolean
};

export interface Suppliers extends Array<Supplier> {};
