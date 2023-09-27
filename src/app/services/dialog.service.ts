import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class DialogService {
  static DEFAULT_DIALOG_SETTINGS = {
    centered: true,
    backdrop: true,
    keyboard: true,
  };
  // --------------------------------------------------------------------------
  /**
   * For NgbModal Docs - https://ng-bootstrap.github.io/#/components/modal/api
   */
  constructor(private modalService: NgbModal) {}

  // --------------------------------------------------------------------------
  /**
   * open:- open a dialog with component as input para
   * @param component: any, dialogSettings?
   * @returns NgbModalRef
   */
  open(component: any, dialogSettings?): NgbModalRef {
    let settings;
    if (dialogSettings) {
      settings = dialogSettings;
    } else {
      settings = DialogService.DEFAULT_DIALOG_SETTINGS;
    }
    return this.modalService.open(component, settings);
  }
}
