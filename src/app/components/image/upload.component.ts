import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-image-cropper',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class ImageCropComponent {


  
  private _imageChangedEvent: any = '';



  @Input() set imageChangedEvent(e: any) {
    this._imageChangedEvent = e;
    if (e) {
      this.showCropper = true;
      this.croppedImageName = e.target.files[0].name;
    } else {
      this.showCropper = false;
    }
  } get imageChangedEvent(): any {
    return this._imageChangedEvent;
  }

  @Output() done: EventEmitter<any> = new EventEmitter();

  showCropper = false;
  private croppedImage: any = '';
  private croppedImageName = 'cropped image';



  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.file;
  }
  loadImageFailed(): void {
    this.done.emit(null);
    this.showCropper = false;
  }
  cropImage(): void {
    const file: File = new File([this.croppedImage], this.croppedImageName, { type: 'image/png' });
    this.done.emit(file);
    this.showCropper = false;
  }
}
