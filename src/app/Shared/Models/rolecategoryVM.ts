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


export class SortRoleCategoryVM {
    SortField: string = "";
    SortOrder: number;

}

export class RoleCategoriesResult
{
    results: ListRoleCategoriesVM[];
    count: number;
}