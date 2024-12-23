import { Component, OnInit } from '@angular/core';
import { Config } from 'ngx-ui-loader/lib/utils/interfaces';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-edit-work-order-track',
  templateUrl: './edit-work-order-track.component.html',
  styleUrl: './edit-work-order-track.component.css'
})
export class EditWorkOrderTrackComponent implements OnInit{
  constructor(private config: DynamicDialogConfig)
  {

  }
  ngOnInit(): void {
   
    console.log('WorkOrderTrackObj :',this.config.data.WorkOrderTrackObj )
  }

}
