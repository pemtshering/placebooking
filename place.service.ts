import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, pipe } from 'rxjs';
import { Place } from './place/place.model';
import { map, take, switchMap, tap} from 'rxjs/operators';

interface placeData{
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}
@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private _places = new BehaviorSubject<Place[]>([])
  get places(){
  return this._places.asObservable();
  placeId: String
}
placeId: String
// place:Place[]=[
// new Place(
//   new Date('2022-07-07'),
//   new Date('2022-07-28'),
//   'p1',
//   'Paro',
//   'Paro is a valley town in Bhutan, west of the capital, Thimphu. It is the site of the country only international airport and is also known for the many sacred sites in the area',
//   'https://static2.tripoto.com/media/filter/tst/img/315930/TripDocument/1499852492_2.jpg',
//   500

// ),
 
// new Place(
//   new Date('2022-07-07'),
//   new Date('2022-07-28'),
//   'p2',
//   'Thimphu',
//   'Thimphu it is the capital  and largest city of Bhutan. It is situated in the western central part of Bhutan, and the surrounding valley',
//   'https://www.bhutan.travel/uploads/locations/YpG7C_XyjzX_thimphu-pic_600_320.jpg',
//   700

// ),
// new Place(
//   new Date('2022-07-07'),
//   new Date('2022-07-28'),
//   'p3',
//   'Phobjikha Valley',
//   'The Phobjikha Valley ཕོབ་སྦྱིས་ཁ spelled as Pho-sbis-kha, is a vast U-shaped valley in central Bhutan. The valley houses one of the impressive ancient Buddhist monasteries in Bhutan known as Gangteng Monastery of the Nyingma sect in central Bhutan.',
//   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7sNlXtEbKddxZt-86ssssOLi2A66xSAnU6g&usqp=CAU',
//   200
// ),
// new Place(
//   new Date('2022-07-07'),
//   new Date('2022-07-28'),
//   'p4',
//   'Punakha',
//   'Punakha is a valley town in Bhutan, west of the capital, and is also known for the many sacred sites in the area',
//   'https://media.istockphoto.com/photos/glorious-evening-in-punakha-bhutan-bhutan-is-also-known-as-the-land-picture-id1326288165?k=20&m=1326288165&s=612x612&w=0&h=eAJhyPjog1aSKLKpxA08nItmhvFYEHX77cvBiMI5vUs=',
//  400
// ),
// new Place(  
//   new Date('2022-07-07'),
//   new Date('2022-07-28'),
//   'p5',
//   'Gangteng',
//   'The valley houses one of the impressive ancient Buddhist monasteries in Bhutan known as Gangteng Monastery of the Nyingma sect in central Bhutan. The graceful ...',
//   'https://live.staticflickr.com/65535/49808128448_1e2e66c387_b.jpg',
// 100
// ),
// ]
  constructor(private http:HttpClient) {}
      addPlace(title:string,
        description:string,
        price: number,
        dateFrom: Date,
        dateTo: Date
        ){

        // console.log(title,description,price,dateFrom,dateTo);
        let generatedId: string;
        const newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          'https://live.staticflickr.com/65535/49808128448_1e2e66c387_b.jpg',
          price,
          dateFrom,
          dateTo,
          'abc'
        );
        return this.http
        .post<{name: string}>
        ("https://placebookingapp-feead-default-rtdb.firebaseio.com/offered-place.json", // .jons only present in firebase.
      {
        ...newPlace,
        id: null
      })
        .pipe(
          switchMap(resData =>{
            generatedId = resData.name;
            return this.places;
          }),
          take(1),
          tap(places =>{
            newPlace.id = generatedId;
            this._places.next(places.concat(newPlace))
          })
        )
      }
    fetchPlace() {
      return this.http
        .get<{ [key: string]: placeData }>(
          'https://placebookingapp-feead-default-rtdb.firebaseio.com/offered-place.json'
        )
        .pipe(
          map(resData => {
            const places = [];
            for (const key in resData) {
              if (resData.hasOwnProperty(key)) {
                places.push(
                  new Place(
                    key,
                    resData[key].title,
                    resData[key].description,
                    resData[key].imageUrl,
                    resData[key].price,
                    new Date(resData[key].availableFrom),
                    new Date(resData[key].availableTo),
                    resData[key].userId
                  )
                );
              }
            }
            return places;
            // return [];
          }),
          tap(places => {
            this._places.next(places);
          })
        )
    }
    getPlace(id: string) {
      return this.http
        .get<placeData>(
          `https://placebookingapp-feead-default-rtdb.firebaseio.com/offered-place/${id}.json`
        )
        .pipe(
          map(placeData => {
            return new Place(
              id,
              placeData.title,
              placeData.description,
              placeData.imageUrl,
              placeData.price,
              new Date(placeData.availableFrom),
              new Date(placeData.availableTo),
              placeData.userId
            );
          })
        )
    } 
   updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlace();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        console.log(updatedPlaceIndex);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://placebookingapp-feead-default-rtdb.firebaseio.com/offered-place/${placeId}.json`,
          
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}

    //  this.getplace();
    // this. fetchPlace();
  //  }
  //  getplace(){
  //   return [...this.place]
  //  }
  
  // get allPlaces(){
  //   return this.place;
  // }
  //   getSelectedplace(placeId:string){
  //   return this.place.find(eachPlace=>{
  //   return eachPlace.id === placeId;
  // })

//   .subscribe(selectedPlace=>{
//     console.log(selectedPlace); 
// })     
  // .subscribe(places=>{
  //   console.log(places);  
  // })
  // const placeData={
  //   title:title,
  //   description:description,
  //   price:price,
  //   dateFrom:dateFrom,
  //   dateTo:dateTo   inside addplaces
  //   getplace(){
  //   return this.http
  //   .get("https://placebookingapp-d85b6-default-rtdb.firebaseio.com/offered-places.json")
  //   .subscribe(response=>{
  //     console.log(response);
  //   })
  // }