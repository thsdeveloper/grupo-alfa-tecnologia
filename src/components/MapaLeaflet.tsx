"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { estadosInfo, coresRegiao } from "@/data/estadosBrasil";

interface MapaLeafletProps {
  estadoSelecionado: string | null;
  onEstadoClick: (sigla: string) => void;
  onEstadoHover: (sigla: string | null) => void;
}

// Coordenadas das capitais dos estados
const coordenadasEstados: Record<string, [number, number]> = {
  AC: [-9.0238, -70.812],
  AL: [-9.5713, -36.782],
  AP: [0.902, -52.003],
  AM: [-3.1019, -60.025],
  BA: [-12.9714, -38.5014],
  CE: [-3.7172, -38.5433],
  DF: [-15.7801, -47.9292],
  ES: [-20.3155, -40.3128],
  GO: [-16.6869, -49.2648],
  MA: [-2.5307, -44.3068],
  MT: [-15.601, -56.0974],
  MS: [-20.4697, -54.6201],
  MG: [-19.9167, -43.9345],
  PA: [-1.4558, -48.4902],
  PB: [-7.115, -34.863],
  PR: [-25.4284, -49.2733],
  PE: [-8.0476, -34.877],
  PI: [-5.0892, -42.8019],
  RJ: [-22.9068, -43.1729],
  RN: [-5.7945, -35.211],
  RS: [-30.0346, -51.2177],
  RO: [-8.7612, -63.9004],
  RR: [2.8235, -60.6758],
  SC: [-27.5954, -48.548],
  SP: [-23.5505, -46.6333],
  SE: [-10.9472, -37.0731],
  TO: [-10.1689, -48.3317],
};

// Componente para controlar o zoom
function ZoomControl({ estadoSelecionado }: { estadoSelecionado: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (estadoSelecionado && coordenadasEstados[estadoSelecionado]) {
      const coords = coordenadasEstados[estadoSelecionado];
      map.flyTo(coords, 7, { duration: 1 });
    } else {
      // Volta para visão geral do Brasil
      map.flyTo([-14.235, -51.9253], 4, { duration: 1 });
    }
  }, [estadoSelecionado, map]);

  return null;
}

// Ícone customizado para marcador selecionado
const createCustomIcon = (isSelected: boolean, cor: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${isSelected ? "40px" : "24px"};
        height: ${isSelected ? "40px" : "24px"};
        background: ${isSelected ? "#b6c72c" : cor};
        border: 3px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.8)"};
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        ${isSelected ? "animation: pulse 1.5s infinite;" : ""}
      ">
        ${isSelected ? `<span style="color: #211915; font-weight: bold; font-size: 12px;"></span>` : ""}
      </div>
    `,
    iconSize: [isSelected ? 40 : 24, isSelected ? 40 : 24],
    iconAnchor: [isSelected ? 20 : 12, isSelected ? 20 : 12],
  });
};

export default function MapaLeaflet({
  estadoSelecionado,
  onEstadoClick,
  onEstadoHover,
}: MapaLeafletProps) {
  const estadosAtivos = Object.keys(estadosInfo);

  return (
    <>
      <style jsx global>{`
        .leaflet-container {
          background: #1a1512;
          font-family: inherit;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(33, 25, 21, 0.95);
          border: 1px solid #b6c72c;
          border-radius: 12px;
          color: white;
        }
        .leaflet-popup-tip {
          background: rgba(33, 25, 21, 0.95);
          border: 1px solid #b6c72c;
        }
        .leaflet-popup-content {
          margin: 12px 16px;
        }
        .estado-popup-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 4px;
        }
        .estado-popup-regiao {
          color: #b6c72c;
          font-size: 12px;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
      <MapContainer
        center={[-14.235, -51.9253]}
        zoom={4}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={true}
        attributionControl={false}
        style={{ height: "450px", width: "100%", borderRadius: "16px" }}
      >
        {/* Tile Layer - Mapa escuro estilizado */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Marcadores dos estados */}
        {estadosAtivos.map((sigla) => {
          const coords = coordenadasEstados[sigla];
          const info = estadosInfo[sigla];
          const isSelected = estadoSelecionado === sigla;
          const corRegiao = coresRegiao[info?.regiao] || "#b6c72c";

          if (!coords) return null;

          return (
            <CircleMarker
              key={sigla}
              center={coords}
              radius={isSelected ? 18 : 10}
              pathOptions={{
                fillColor: isSelected ? "#b6c72c" : corRegiao,
                fillOpacity: isSelected ? 1 : 0.8,
                color: isSelected ? "#fff" : "rgba(255,255,255,0.6)",
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onEstadoClick(sigla),
                mouseover: () => onEstadoHover(sigla),
                mouseout: () => onEstadoHover(null),
              }}
            >
              <Popup>
                <div>
                  <div className="estado-popup-title">{info?.nome}</div>
                  <div className="estado-popup-regiao">{info?.regiao} • {info?.capital}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        <ZoomControl estadoSelecionado={estadoSelecionado} />
      </MapContainer>
    </>
  );
}
