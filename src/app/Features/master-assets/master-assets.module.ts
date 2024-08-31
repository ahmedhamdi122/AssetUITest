import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterAssetsRoutingModule } from './master-assets-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';

import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { MatIconModule } from '@angular/material/icon';
import { ViewComponent } from './view/view.component';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { LoadingSpinnerComponent } from 'src/app/Shared/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    ViewComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    InputNumberModule,
    DeleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DialogModule,
    MatTabsModule,
    TranslateModule,
    MatRadioModule,
    MatSnackBarModule,
    ConfirmDialogModule,
    MatIconModule,
    TableModule,
    TooltipModule,
    MasterAssetsRoutingModule,
    PaginatorModule,
    AutoCompleteModule,
    InputTextModule,
    FloatLabelModule,
    RadioButtonModule,
    ToastModule,
  ],
  providers:[MessageService]
})
export class MasterAssetsModule { }

