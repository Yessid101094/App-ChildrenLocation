import {Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import { Plugins } from '@capacitor/core';


declare var google;
const { Geolocation } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map = null;
  marker: any;
  positionSet: any;
  lat: any;
  long: any;
  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  placeid: any;
  places: any;
  marker2: any;

  @Input() position = {
            lat: 10.9878,
            lng: -74.7889
  };


  constructor(public zone: NgZone) {
    //this.myLocation();
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ngOnInit() {
    this.loadMap();
  }




  loadMap() {
      const position = this.position;

       const mapEle: HTMLElement = document.getElementById('map');
      const myLatLng = { lat: 10.9878 , lng: -74.7889 };
      this.map = new google.maps.Map(mapEle, {
        center: position,
        zoom: 12,
        disableDefaultUI: true
      });
      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        draggable: true,
      });



       google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
        this.addMarker(position);
      });
  }

  addMarker(position: any): void {
    let latLng = new google.maps.LatLng(position.lat, position.lng);

    this.marker.setPosition(latLng);
    this.map.panTo(position);
    this.positionSet = position;
  }



  myLocation() {
    Geolocation.getCurrentPosition().then((result) => {
      console.log('myLocation() -> get');
      const position = {
        lat: result.coords.latitude,
        lng: result.coords.longitude,
      }
      console.log(position);
      this.lat = position.lat;
      this.long = position.lng;
      this.addMarker(position);
    });
  }

  ShowCords(){
    alert('lat' + this.lat + ' long'+ this.long);
  }


  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  SelectSearchResult(item) {
     //AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
    //HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
    alert(JSON.stringify(item))
    this.placeid = item.place_id;
    console.log(this.placeid);

  }

  ClearAutocomplete(){
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

}
