"use client";

import { useGetMaps } from "@/core/hooks/use-maps";
import LeafletMap from "@/core/view/maps/leaflet-map";
import { Spinner } from "@/core/components/ui/spinner";

const Maps = () => {
  const { data } = useGetMaps();

  return data ? (
    <div className="w-full h-full p-5 ">
      <LeafletMap
        coordinates={data}
        className="h-full"
      />
    </div>
  ) : (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner variant="bars" size={80} className="text-primary" />
    </div>
  );
};

export default Maps;
