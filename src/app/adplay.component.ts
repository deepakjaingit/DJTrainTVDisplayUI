import { Component } from "@angular/core";

@Component({
    selector: 'app-adplay',
    templateUrl: './adplay.component.html',
})
export class AdPlayComponent {
    onPause(args: any) {
        
      }
      onPlaying(args: any) {
         const div = document.getElementById('myVideo')
        if (div) {
          // if (div.requestFullscreen)
          //   div.requestFullscreen();
          // else if (div.webkitRequestFullscreen)
          //   div.webkitRequestFullscreen();
          // else if (div.msRequestFullScreen)
          //   div.msRequestFullScreen();
        }
      }
}
