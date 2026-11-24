import React, { useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
} from '@vis.gl/react-google-maps';
import { Compass, ExternalLink, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

const MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';

const MapFallbackCard: React.FC<{ reason?: string }> = ({ reason }) => (
  <div className="w-full h-[380px] md:h-[440px] bg-[#E6DCCB]/45 border border-[#252925]/15 rounded-sm flex flex-col items-center justify-center p-8 text-center">
    <div className="w-12 h-12 rounded-sm bg-[#183D32] text-[#C5A46D] flex items-center justify-center mb-4">
      <MapPin className="w-6 h-6" aria-hidden="true" />
    </div>
    <h3 className="font-display text-2xl text-[#183D32]">{SITE_CONFIG.businessName}</h3>
    <p className="text-sm text-[#252925]/80 mt-2">{SITE_CONFIG.location.fullLocation}</p>
    <p className="text-xs font-medium tracking-wider uppercase text-[#354A36] mt-2">
      Google Maps Plus Code: {SITE_CONFIG.location.plusCode}
    </p>
    {reason && <p className="text-xs text-[#252925]/65 mt-3 max-w-md">{reason}</p>}
    <a
      href={SITE_CONFIG.location.googleMapsDirectionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#183D32] text-[#F8F6F0] text-xs font-medium tracking-[0.16em] uppercase rounded-sm hover:bg-[#354A36] transition-colors"
    >
      <Compass className="w-4 h-4" aria-hidden="true" />
      <span>Get Directions</span>
      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
    </a>
  </div>
);

const InteractiveMapCanvas: React.FC = () => {
  const status = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <MapFallbackCard reason="Interactive map tiles are temporarily unavailable. Use the Google Maps link below for live turn-by-turn directions." />
    );
  }

  return (
    <div className="relative w-full h-[380px] md:h-[440px] rounded-sm overflow-hidden border border-[#252925]/15 shadow-sm bg-[#E6DCCB]/30">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={SITE_CONFIG.location.coordinates}
        defaultZoom={15}
        gestureHandling="cooperative"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <AdvancedMarker
          ref={markerRef}
          position={SITE_CONFIG.location.coordinates}
          title={SITE_CONFIG.businessName}
          onClick={() => setInfoOpen(true)}
        >
          <Pin background="#183D32" borderColor="#C5A46D" glyphColor="#F8F6F0" scale={1.15} />
        </AdvancedMarker>

        {infoOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={260}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-1 text-[#252925]">
              <p className="font-display text-sm font-semibold text-[#183D32]">
                {SITE_CONFIG.businessName}
              </p>
              <p className="text-xs text-[#252925]/80 mt-1">
                {SITE_CONFIG.location.addressLine}
              </p>
              <p className="text-[11px] font-medium text-[#354A36] mt-1">
                Plus Code: {SITE_CONFIG.location.plusCode}
              </p>
              <a
                href={SITE_CONFIG.location.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#183D32] underline mt-2"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

interface LocationMapProps {
  quotaExceeded?: boolean;
}

export const LocationMap: React.FC<LocationMapProps> = ({ quotaExceeded = false }) => {
  if (!MAPS_API_KEY || quotaExceeded) {
    return (
      <MapFallbackCard
        reason={
          quotaExceeded
            ? 'Interactive map quota reached for this preview session. Open Google Maps directly for live directions.'
            : 'Open Google Maps directly using Plus Code G28X+95 Athi River for live directions.'
        }
      />
    );
  }

  return (
    <APIProvider
      apiKey={String(MAPS_API_KEY)}
      libraries={['marker']}
      language="en"
      region="KE"
    >
      <InteractiveMapCanvas />
    </APIProvider>
  );
};
