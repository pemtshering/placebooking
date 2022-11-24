import { Component, OnInit, Output,EventEmitter,ViewChild,ElementRef,Input } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera,CameraSource,CameraResultType } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', {static:false})filePickerRef:ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage:string;
  usePicker = false;
  constructor(private platfrom:Platform) { }
  ngOnInit() {
    if (
     ( this.platfrom.is('mobile')&& !this.platfrom.is('hybrid')) ||
      this.platfrom.is('desktop')
    ){
      this.usePicker = true;
    }
  }
  onPickImage(){
    if (!Capacitor.isPluginAvailable('Camera')){
      this.filePickerRef.nativeElement.click();
      return;
    }
    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation:true,
      width:300,
      resultType:CameraResultType.Base64
    })
    .then(image =>{
      this.selectedImage = image.base64String;
      this.imagePick.emit(image.base64String);
      
    })
    .catch(error =>{
      console.log(error);
      if(this.usePicker){
        this.filePickerRef.nativeElement.click();
      }
      return false;
    });
  }
  onFileChosen(event:Event){
    const pickerFile = (event.target as HTMLInputElement).files[0];
    if (!pickerFile){
      return;
    }
    const fr = new FileReader();
    fr.onload = () =>{
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickerFile);
    }
    fr.readAsDataURL(pickerFile);
  }

}
