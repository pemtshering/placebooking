import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map ,take,switchMap,tap} from 'rxjs/operators';
import { Place } from './places.model';
interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}
// places:Place[]=[
//   new Place(
//     'p1',
//     'Thimphu',
//     'Thimphu is an intriguing destinations and the capital of Bhutan. The city nestled in the higher ranges of the Himalayas offers astonishing sights of their emerald forests and beautiful view of the Raidak or Chuu River.',
//     'https://www.tourmyindia.com/blog//wp-content/uploads/2017/04/Memorial-Chorten.png',
//     200,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
  
//     'p2',
//     'Paro',
//     'Its peaceful serene beauty and clean air, surrounded by unlevelled mountains, lush green fields and historical buildings make Paro the foremost popular destination in Bhutan.',
//     'https://www.tourmyindia.com/blog//wp-content/uploads/2017/04/Paro-Taktsang-.jpg',
//     250,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
   
//     'p3',
//     'Punakha',
//     ' ‘The best place to be’ for those who enjoy the adrenaline rush of river rafting in the two rivers/chhus – Mo and Pho.',
//     'https://www.tourmyindia.com/blog//wp-content/uploads/2017/04/Punakha-Dzong.jpg',
//     400,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
   
//     'p4',
//     'Trongsa',
//     'Trongsa sits in the central Bhutan and its lush flora creates a beautiful place to surround your senses and simply meditate.',
//     'https://www.tourmyindia.com/blog//wp-content/uploads/2017/04/Trongsa-Dzong.jpg',
//     300,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
   
//     'p5',
//     'Jakar',
//     'Nearing the foothills of Choekhor Valley lays Jakar, locally known as Chamkhar. This region is mainly known for its trading centre and the famous attraction in this place is the Jakar Dzong.',
//     'https://www.tourmyindia.com/blog//wp-content/uploads/2017/04/Jakar-Dzong.jpg',
//     300,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p6',
//     'Phobjikha',
//     'Phobjikha is an enormous U-shaped glacial valley bordering the Jigme Singye Wangchuck National Park.',
//     'https://www.tourmyindia.com/blog//wp-content/uploads/2017/04/Phobjikha.jpg',
//     300,
//     new Date('2022-01-01'),
//     new Date('2022-12-31'),
//     'abc'
//   ),
// ]
@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }
 
  constructor(private http:HttpClient) {}
  

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://placebookingapp-feead-default-rtdb.firebaseio.com/offered-place.json',
        
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
      .get<PlaceData>(
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

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://www.tourmyindia.com/blog//wp-content/uploads/2017/04/Paro-Taktsang-.jpg',
      price,
      dateFrom,
      dateTo,
      'abc'
    );
    return this.http
      .post<{ name: string }>(
        'https://placebookingapp-feead-default-rtdb.firebaseio.com/offered-place.json',
        {
          ...newPlace,
          id: null
        }
      ) 
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
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
          `https://placebookingapp-feead-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }

}
