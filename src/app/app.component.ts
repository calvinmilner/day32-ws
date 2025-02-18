import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrder } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  private fb = inject(FormBuilder)

  protected form! : FormGroup
  protected lineItems! : FormArray


  constructor() {
    console.info('in constructor')
  }

  ngOnInit() : void {
    console.info('in ngOnInit')
    // map form to created object
    this.form = this.createForm()
  }
  protected createForm() : FormGroup {
    this.lineItems = this.fb.array([])
    return this.fb.group({
      name: this.fb.control<string>('', [Validators.required]),
      address: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.email]),
      deliveryDate: this.fb.control<string>('', [Validators.required]),
      rush: this.fb.control<boolean>(false),
      lineItems: this.lineItems
    })
  }

  protected createLineItem() : FormGroup {
    return this.fb.group({
      itemName: this.fb.control<string>('', [Validators.required]),
      quantity: this.fb.control<number>(1, [Validators.min(1)]),
      unitPrice: this.fb.control<number>(0.1, [Validators.min(0.1)])
    })
  }

  protected addLineItem() {
    this.lineItems.push(this.createLineItem())
  }

  protected deleteLineItem(idx : number) {
    this.lineItems.removeAt(idx)
  }

  protected processForm() {
    const values: PurchaseOrder = {
      name: this.form.controls['name'].value,
      address: this.form.controls['address'].value,
      email: this.form.controls['email'].value,
      deliveryDate: this.form.controls['deliveryDate'].value,
      rush: this.form.controls['rush'].value,
      lineItems: this.form.controls['lineItems'].value
    }
    this.form.reset
  }

  protected isCtrlValid(ctrlName : string) : boolean {
    return false
  }
}
