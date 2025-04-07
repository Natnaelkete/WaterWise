import Map from "@/components/maps/Map";
import React, { useEffect, useState } from "react";

const MapPage = () => {
  return (
    <>
      <div className="bg-white-700 mx-auto my-5 w-[98%] h-[500px]">
        <Map />
      </div>
    </>
  );
};

export default MapPage;
