import { LatLon } from './lat-lon';
import { HouseParam } from './house-param';
import { House } from './house';
import { DistanceCalculatorService } from '../service/distance-calculator.service';

/**
 * House view model
 */
export class HouseView {
  coords: LatLon | undefined;
  params?: HouseParam;
  street = '';
  distance: number | null = null;
}

export function updateDistance(
  houses: House[],
  reference: LatLon
): HouseView[] {
  return houses.map((h) => {
    const houseView = new HouseView();
    Object.assign(houseView, h);
    if (!houseView.coords) {
      houseView.distance = null;
      return houseView;
    }

    houseView.distance =
      DistanceCalculatorService.distanceInKmBetweenCoordinates(
        houseView.coords.lat,
        houseView.coords.lon,
        reference.lat,
        reference.lon
      );
    return houseView;
  });
}
