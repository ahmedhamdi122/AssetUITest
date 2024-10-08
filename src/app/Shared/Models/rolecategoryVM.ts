export class ListRoleCategoriesVM {
    id: number = 0;
    name: string = "";
    nameAr: string = "";
    orderId: number=0;

}
export class CreateRoleCategoryVM {
    name: string;
    nameAr: string;
    orderId: number;
}

export class EditRoleCategoryVM {
    id: number = 0;
    name: string = "";
    nameAr: string = "";
    orderId: number;
}


export class SortSearchVM {
    SortField: string = "";
    SortOrder: number;
    Search:string='';
}

export class RoleCategoriesResult
{
    results: ListRoleCategoriesVM[];
    count: number;
}