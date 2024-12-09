"use client";

import { Fragment, useCallback, useState } from "react";
import { getData } from "./data";
import {
  APIProvider,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  AdvancedMarkerProps,
  CollisionBehavior,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

const data = getData()
  .sort((a, b) => b.position.lat - a.position.lat)
  .map((dataItem, index) => ({ ...dataItem, zIndex: index }));

const Z_INDEX_SELECTED = data.length;
const Z_INDEX_HOVER = data.length + 1;

export type AnchorPointName = keyof typeof AdvancedMarkerAnchorPoint;

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default function Maps() {
  const [markers] = useState(data);

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [anchorPoint, setAnchorPoint] = useState("BOTTOM" as AnchorPointName);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const onMarkerClick = useCallback(
    (id: string | null, marker?: google.maps.marker.AdvancedMarkerElement) => {
      setSelectedId(id);

      if (marker) {
        setSelectedMarker(marker);
      }

      if (id !== selectedId) {
        setInfoWindowShown(true);
      } else {
        setInfoWindowShown(isShown => !isShown);
      }
    },
    [selectedId],
  );

  const onMapClick = useCallback(() => {
    setSelectedId(null);
    setSelectedMarker(null);
    setInfoWindowShown(false);
  }, []);

  const handleInfowindowCloseClick = useCallback(() => setInfoWindowShown(false), []);
  return (
    <div className="h-screen w-screen">
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId={"bf51a910020fa25a"}
          defaultZoom={12}
          defaultCenter={{ lat: 25.033, lng: 121.5654 }}
          gestureHandling={"greedy"}
          onClick={onMapClick}
          clickableIcons={false}
          disableDefaultUI
        >
          {markers.map(({ id, zIndex: zIndexDefault, position, type }) => {
            let zIndex = zIndexDefault;

            if (hoverId === id) {
              zIndex = Z_INDEX_HOVER;
            }

            if (selectedId === id) {
              zIndex = Z_INDEX_SELECTED;
            }

            if (type === "pin") {
              return (
                <AdvancedMarkerWithRef
                  onMarkerClick={(marker: google.maps.marker.AdvancedMarkerElement) => onMarkerClick(id, marker)}
                  onMouseEnter={() => onMouseEnter(id)}
                  onMouseLeave={onMouseLeave}
                  key={id}
                  zIndex={zIndex}
                  className="custom-marker"
                  style={{
                    transform: `scale(${[hoverId, selectedId].includes(id) ? 1.3 : 1})`,
                    transformOrigin: AdvancedMarkerAnchorPoint["BOTTOM"].join(" "),
                  }}
                  position={position}
                >
                  <Pin
                    background={selectedId === id ? "#22ccff" : null}
                    borderColor={selectedId === id ? "#1e89a1" : null}
                    glyphColor={selectedId === id ? "#0f677a" : null}
                  />
                </AdvancedMarkerWithRef>
              );
            }

            if (type === "html") {
              return (
                <Fragment key={id}>
                  <AdvancedMarkerWithRef
                    position={position}
                    zIndex={zIndex}
                    anchorPoint={AdvancedMarkerAnchorPoint[anchorPoint]}
                    className="custom-marker"
                    style={{
                      transform: `scale(${[hoverId, selectedId].includes(id) ? 1.3 : 1})`,
                      transformOrigin: AdvancedMarkerAnchorPoint[anchorPoint].join(" "),
                    }}
                    onMarkerClick={(marker: google.maps.marker.AdvancedMarkerElement) => onMarkerClick(id, marker)}
                    onMouseEnter={() => onMouseEnter(id)}
                    collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
                    onMouseLeave={onMouseLeave}
                  >
                    <div className={`custom-html-content ${selectedId === id ? "selected" : ""}`}></div>
                  </AdvancedMarkerWithRef>

                  {/* anchor point visualization marker */}
                  <AdvancedMarkerWithRef
                    onMarkerClick={(marker: google.maps.marker.AdvancedMarkerElement) => onMarkerClick(id, marker)}
                    zIndex={zIndex + 1}
                    onMouseEnter={() => onMouseEnter(id)}
                    onMouseLeave={onMouseLeave}
                    anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                    position={position}
                  >
                    <div className="visualization-marker"></div>
                  </AdvancedMarkerWithRef>
                </Fragment>
              );
            }
          })}

          {infoWindowShown && selectedMarker && (
            <InfoWindow anchor={selectedMarker} pixelOffset={[0, -2]} onCloseClick={handleInfowindowCloseClick}>
              <h2>Marker {selectedId}</h2>
              <p>Some arbitrary html to be rendered into the InfoWindow.</p>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  },
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};
