import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { BRANCHES } from '../constants';
import { Branch } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PREFERENCES_KEY = 'masaratSearchPreferences';

// Custom Leaflet Icons using SVG data URIs for clean, file-less icons
const defaultIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4B5563"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
const selectedIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EA580C"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

const defaultIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(defaultIconSVG),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

const selectedIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(selectedIconSVG),
    iconSize: [40, 40], // Make it slightly bigger
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});


const BranchesPage: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const branchRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker | null>>({});
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const isUpdatingFromMap = useRef(false);

  // Effect to load preferences from localStorage on initial render
  useEffect(() => {
    try {
        const saved = localStorage.getItem(PREFERENCES_KEY);
        if (saved) {
            const prefs = JSON.parse(saved);
            if (prefs.branchId) {
                setSelectedBranchId(prefs.branchId);
            }
        }
    } catch (e) {
        console.error("Failed to load preferences from localStorage", e);
    }
  }, []);

  // Effect to initialize map, runs only once
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([26.5, 45.5], 5); // Centered on KSA

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        BRANCHES.forEach(branch => {
            if (branch.lat && branch.lng) {
                const marker = L.marker([branch.lat, branch.lng], { icon: defaultIcon })
                    .addTo(mapRef.current!)
                    .bindPopup(`<b>${branch.name}</b>`);
                
                marker.on('click', () => {
                    isUpdatingFromMap.current = true;
                    handleBranchSelect(branch.id);
                });
                markersRef.current[branch.id] = marker;
            }
        });

        // Add a resize listener to invalidate map size when needed
        const resizeObserver = new ResizeObserver(() => {
            mapRef.current?.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);

        return () => {
            resizeObserver.disconnect();
        }
    }
  }, []);

  // Effect to handle branch selection
  useEffect(() => {
    if (selectedBranchId) {
        const branch = BRANCHES.find(b => b.id === selectedBranchId);

        // Update map view if branch is valid
        if (branch?.lat && branch.lng && mapRef.current) {
            mapRef.current.flyTo([branch.lat, branch.lng], 13);
        }

        // Update all markers' icons
        Object.keys(markersRef.current).forEach((id) => {
          const marker = markersRef.current[id];
          if (marker) {
            marker.setIcon(id === selectedBranchId ? selectedIcon : defaultIcon);
            if (id === selectedBranchId) {
              marker.openPopup();
            }
          }
        });
        
        // Scroll card into view if the selection was made from the map
        if (isUpdatingFromMap.current && branchRefs.current[selectedBranchId]) {
            branchRefs.current[selectedBranchId]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            isUpdatingFromMap.current = false; // Reset flag
        }
    }
  }, [selectedBranchId]);

  const handleBranchSelect = (branchId: string) => {
    try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ branchId }));
        setSelectedBranchId(branchId);
    } catch (e) {
        console.error("Failed to save preferences to localStorage", e);
    }
  };

  const branchesByRegion = BRANCHES.reduce((acc, branch) => {
    if (!acc[branch.region]) {
      acc[branch.region] = [];
    }
    acc[branch.region].push(branch);
    return acc;
  }, {} as Record<string, Branch[]>);
  
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-2">اختر الفرع المناسب لك</h1>
      <p className="text-lg text-gray-500 mb-8">اختر من القائمة أو تصفح الخريطة للعثور على أقرب فرع.</p>
      
      <div className="flex flex-col lg:flex-row-reverse gap-6" style={{ height: 'calc(100vh - 250px)' }}>
          {/* Map View */}
          <section aria-labelledby="map-heading" className="w-full lg:w-2/3 h-64 lg:h-full">
              <h2 id="map-heading" className="sr-only">خريطة الفروع</h2>
              <div className="w-full h-full bg-gray-200 rounded-lg shadow-lg z-0" ref={mapContainerRef} />
          </section>
          
          {/* List View */}
          <section aria-labelledby="branch-list-heading" className="w-full lg:w-1/3 h-full overflow-y-auto">
             <h2 id="branch-list-heading" className="sr-only">قائمة الفروع</h2>
              <div className="space-y-8">
                  {Object.entries(branchesByRegion).map(([region, branches]) => (
                  <div key={region}>
                      <h3 className="text-2xl font-bold mb-4 border-b-2 border-orange-500 pb-2 sticky top-0 bg-gray-50 z-10">{region}</h3>
                      <div className="space-y-4">
                      {branches.map(branch => {
                          const isSelected = branch.id === selectedBranchId;
                          return (
                              <div key={branch.id} ref={el => { branchRefs.current[branch.id] = el; }}>
                                  <Card 
                                      onClick={() => handleBranchSelect(branch.id)}
                                      className={`p-4 text-center flex flex-col justify-between border-2 ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-transparent'} transition-all cursor-pointer`}
                                  >
                                  <div>
                                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors mb-2">{branch.name}</h4>
                                      <div className="text-xs text-gray-500 space-y-1">
                                          <p><strong>أوقات العمل:</strong> {branch.workingHours}</p>
                                          <p><strong>الهاتف:</strong> {branch.phone}</p>
                                      </div>
                                  </div>
                                  {isSelected && (
                                      <Link to={`/cars/${branch.id}`} className="mt-4 block">
                                          <Button className="w-full">
                                              عرض السيارات المتاحة
                                          </Button>
                                      </Link>
                                  )}
                                  </Card>
                              </div>
                          );
                      })}
                      </div>
                  </div>
                  ))}
              </div>
          </section>
      </div>
    </div>
  );
};

export default BranchesPage;
