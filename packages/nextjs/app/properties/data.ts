type MarkerData = Array<{
  id: string;
  position: google.maps.LatLngLiteral;
  type: "pin" | "html";
  zIndex: number;
}>;

export function getData() {
  const data: MarkerData = [];

  // create 50 random markers around Taipei
  for (let index = 0; index < 50; index++) {
    data.push({
      id: String(index),
      position: { lat: rnd(25.01, 25.06), lng: rnd(121.53, 121.58) }, // Taipei coordinates
      zIndex: index,
      type: Math.random() < 0.5 ? "pin" : "html",
    });
  }

  return data;
}

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
