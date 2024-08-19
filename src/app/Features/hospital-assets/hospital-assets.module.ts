import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HospitalAssetsRoutingModule } from './hospital-assets-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';

import { TooltipModule } from 'primeng/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CarouselModule } from 'primeng/carousel';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DetailsComponent } from './details/details.component';
//  import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { ViewComponent } from './view/view.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PmcalendarComponent } from './pmcalendar/pmcalendar.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
 import { FullCalendarModule } from '@fullcalendar/angular';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ListverticalComponent } from './listvertical/listvertical.component';
import { MatButtonModule } from '@angular/material/button';
// import { NgxBarcodeModule } from 'ngx-barcode';
import { BadgeModule } from 'primeng/badge';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthGuard } from 'src/app/Shared/Services/guards/authGuard.guard';
import { AlertdeleteComponent } from './alertdelete/alertdelete.component';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    DeleteconfirmationComponent,
    DetailsComponent,
    ViewComponent,
    PmcalendarComponent,
    
    ListverticalComponent,
    AlertdeleteComponent
  ],
  imports: [
    BadgeModule,
    FullCalendarModule,
    NgxBarcode6Module,
    DeleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DialogModule,
    MatTabsModule,
    MatInputModule,
    TranslateModule,
    
    MatRadioModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MultiSelectModule,
    //  MatListModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
   
    MatSelectModule,
    MatExpansionModule,
    ConfirmDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
   
    TooltipModule,
    CheckboxModule,
    HospitalAssetsRoutingModule,
    PaginatorModule,
    TableModule,
    AutoCompleteModule,
    CarouselModule,
    MatButtonModule,
    BadgeModule,
    MatBadgeModule,
    MatButtonModule,
    CalendarModule,
    RadioButtonModule,
    MatProgressSpinnerModule,
    MatInputModule
  ],
  providers: [MessageService, ConfirmationService, AuthGuard],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HospitalAssetsModule { }
