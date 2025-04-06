import React, { useState, useEffect, useRef, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Context } from '../../config/Context';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});



// Custom marker icons
const createCustomIcon = (color) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });
};

const userIcon = createCustomIcon('#4CAF50');
const memberIcon = createCustomIcon('#2196F3');

const RecenterMap = ({ position }) => {
    const map = useMap();
    const [showRecenterButton, setShowRecenterButton] = useState(false);



    useEffect(() => {
        const onMove = () => {
            const center = map.getCenter();
            if (position && (
                Math.abs(center.lat - position[0]) > 0.001 ||
                Math.abs(center.lng - position[1]) > 0.001
            )) {
                setShowRecenterButton(true);
            }
        };

        map.on('move', onMove);
        return () => map.off('move', onMove);
    }, [map, position]);

    const recenter = () => {
        if (position) {
            map.setView(position, map.getZoom());
            setShowRecenterButton(false);
        }
    };

    return showRecenterButton ? (
        <button
            onClick={recenter}
            className="recenter-button"
            style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                padding: '8px 16px',
                background: 'rgba(76, 175, 80, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(76, 175, 80, 1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(76, 175, 80, 0.9)'}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8L18 14H6L12 8Z" fill="white" />
                <circle cx="12" cy="17" r="2" fill="white" />
            </svg>
            My Location
        </button>
    ) : null;
};


function MapLocation() {

    const { user } = useContext(Context);

    const [position, setPosition] = useState(null);
    const [currentTile, setCurrentTile] = useState({
        name: "OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '© OpenStreetMap contributors'
    });
    const [isSharing, setIsSharing] = useState(false);
    const [roomMembers, setRoomMembers] = useState([]);
    const [showControls, setShowControls] = useState(true);
    const socketRef = useRef(null);
    const mapRef = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        socketRef.current = io('http://localhost:8080', {
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);


    // Track user's position
    useEffect(() => {
        if (!navigator.geolocation) {
            console.error("Geolocation not supported");
            setIsLoading(false);
            setError("Geolocation is not supported by your browser");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const newPos = [pos.coords.latitude, pos.coords.longitude];
                setPosition(newPos);
                // setIsLoading(false);

                if (isSharing && user?.room) {
                    updateLocation(newPos[0], newPos[1]);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setIsLoading(false);
                setError("Could not access your location. Please enable location services.");
            },
            { enableHighAccuracy: true }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [isSharing, user?.room]);

    // Error state
    if (!position) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '30px',
                    borderRadius: '10px',
                    background: 'white',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    maxWidth: '80%',
                    width: '400px'
                }}>
                    <h1 style={{
                        margin: '0 0 20px 0',
                        color: '#2c3e50',
                        fontSize: '28px'
                    }}>
                        Welcome, {user?.username || 'User'}
                    </h1>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60px',
                        height: '60px',
                        margin: '0 auto 20px',
                        borderRadius: '50%',
                        background: '#ffebee',
                        color: '#f44336'
                    }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="currentColor" />
                        </svg>
                    </div>
                    {/* <p style={{ color: '#e53935', fontWeight: 'bold', marginBottom: '10px' }}>{error || 'Could not load your location.'}</p> */}
                    <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>
                        Please enable location services and refresh the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#1e88e5'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#2196F3'}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ marginTop: "80px", marginLeft: "60px", height: '100vh', width: '100vw', position: 'fixed', overflow: 'hidden' }}>
            <MapContainer
                center={position || [0, 0]}
                zoom={15}
                style={{ height: '75%', width: '65%', marginLeft: '23%', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', }}
                whenCreated={map => { mapRef.current = map; }}
            >
                <TileLayer
                    url={currentTile.url}
                    attribution={currentTile.attribution}
                />

                {/* User marker */}
                <Marker position={position} icon={userIcon}>
                    <Popup className="custom-popup">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                background: '#4CAF50',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                marginBottom: '5px',
                                fontWeight: 'bold'
                            }}>
                                {user?.username || 'You'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                Latitude: {position[0].toFixed(6)}<br />
                                Longitude: {position[1].toFixed(6)}
                            </div>
                        </div>
                    </Popup>
                </Marker>

                {/* Member markers */}
                {roomMembers?.map(member => (
                    member.currentLocation && (
                        <Marker
                            key={member._id}
                            position={[member.currentLocation.latitude, member.currentLocation.longitude]}
                            icon={memberIcon}
                        >
                            <Popup className="custom-popup">
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        background: '#2196F3',
                                        color: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        marginBottom: '5px',
                                        fontWeight: 'bold'
                                    }}>
                                        {member.username}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        Latitude: {member.currentLocation.latitude.toFixed(6)}<br />
                                        Longitude: {member.currentLocation.longitude.toFixed(6)}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}

                <RecenterMap position={position} />
            </MapContainer>



            {/* Room controls with animation */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: showControls ? '0' : '-360px',
                zIndex: 1000,
                background: 'white',
                padding: '20px',
                borderRadius: '0 10px 10px 0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                width: '320px',
                height: '75%',
                overflowY: 'auto',
                transition: 'left 0.3s ease'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{
                        margin: '0 0 20px 0',
                        color: '#333',
                        borderBottom: '2px solid #4CAF50',
                        paddingBottom: '10px'
                    }}>
                        MapShare
                        <span style={{
                            fontSize: '12px',
                            background: '#4CAF50',
                            color: 'white',
                            padding: '3px 6px',
                            borderRadius: '10px',
                            marginLeft: '8px',
                            verticalAlign: 'middle'
                        }}>
                            Live
                        </span>
                    </h2>

                    {/* Status messages */}
                    {/* {error && (
                        <div style={{
                            color: 'white',
                            marginBottom: '15px',
                            padding: '10px',
                            background: '#f44336',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            animation: 'fadeIn 0.3s'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="white" />
                            </svg>
                            {error}
                        </div>
                    )} */}

                    {/* {success && (
                        <div style={{
                            color: 'white',
                            marginBottom: '15px',
                            padding: '10px',
                            background: '#4CAF50',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            animation: 'fadeIn 0.3s'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
                            </svg>
                            {success}
                        </div>
                    )} */}

                    <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
                </div>

                {/* {currentRoom ? (
                    <>
                        <div style={{
                            background: '#f5f5f5',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{
                                marginTop: 0,
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '9px',
                                fontWeight: 'bold',
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" fill="#333" />
                                </svg>
                                Current Room: <span style={{ fontWeight: 'normal', fontSize: '10px' }}>{currentRoom}</span>
                            </h3>
                            <div style={{ marginBottom: '15px' }}>
                                <button
                                    onClick={toggleSharing}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginBottom: '10px',
                                        background: isSharing ? '#f44336' : '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '25px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = isSharing ? '#e53935' : '#45a049'}
                                    onMouseOut={(e) => e.currentTarget.style.background = isSharing ? '#f44336' : '#4CAF50'}
                                >
                                    {isSharing ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 8h-1V6c0-2.21-1.79-4-4-4S9 3.79 9 6v2H8c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="white" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" fill="white" />
                                        </svg>
                                    )}
                                    {isSharing ? 'Stop Sharing Location' : 'Start Sharing Location'}
                                </button>

                                <button
                                    onClick={handleLeaveRoom}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: '#ff9800',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '25px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f57c00'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#ff9800'}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="white" />
                                    </svg>
                                    Leave Room
                                </button>
                            </div>

                            <h4 style={{ marginBottom: '10px' }}>Room Members</h4>
                            {roomMembers.length > 0 ? (
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {roomMembers.map(member => (
                                        <div
                                            key={member._id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                marginBottom: '8px',
                                                background: 'white',
                                                borderRadius: '4px',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: '#e0e0e0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '12px',
                                                color: '#555',
                                                fontWeight: 'bold'
                                            }}>
                                                {member.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold' }}>{member.username}</div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: member.currentLocation ? '#4CAF50' : '#9e9e9e'
                                                }}>
                                                    {member.currentLocation ? 'Currently sharing location' : 'Not sharing location'}
                                                </div>
                                            </div>
                                            {member.currentLocation && (
                                                <button
                                                    onClick={() => {
                                                        if (mapRef.current && member.currentLocation) {
                                                            mapRef.current.setView([
                                                                member.currentLocation.latitude,
                                                                member.currentLocation.longitude
                                                            ], 15);
                                                            setShowControls(false);
                                                        }
                                                    }}
                                                    style={{
                                                        // background: '#2196F3',
                                                        // color: 'white',
                                                        // border: 'none',
                                                        // borderRadius: '50%',
                                                        // width: '32px',
                                                        // height: '32px',
                                                        // display: 'flex',
                                                        // alignItems: 'center',
                                                        // justifyContent: 'center',
                                                        // cursor: 'pointer',
                                                        // boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                    }}
                                                    title={`Go to ${member.username}'s location`}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z" fill="white" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '15px',
                                    background: 'white',
                                    borderRadius: '4px',
                                    color: '#9e9e9e'
                                }}>
                                    No other members in this room yet
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            background: '#f5f5f5',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Create a Room</h3>
                            <input
                                type="text"
                                value={roomName}
                                onChange={e => setRoomName(e.target.value)}
                                placeholder="Enter room name"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    marginBottom: '10px',
                                    borderRadius: '25px',
                                    border: '1px solid #ddd',
                                    boxSizing: 'border-box',
                                    fontSize: '14px'
                                }}
                            />
                            <button
                                onClick={handleCreateRoom}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#45a049'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#4CAF50'}
                            >
                                Create Room
                            </button>
                        </div>

                        <div style={{
                            background: '#f5f5f5',
                            padding: '15px',
                            borderRadius: '8px'
                        }}>
                            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Join a Room</h3>
                            <input
                                type="text"
                                value={roomIdInput}
                                onChange={e => setRoomIdInput(e.target.value)}
                                placeholder="Enter room ID"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    marginBottom: '10px',
                                    borderRadius: '25px',
                                    border: '1px solid #ddd',
                                    boxSizing: 'border-box',
                                    fontSize: '14px'
                                }}
                            />
                            <button
                                onClick={handleJoinRoom}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#1e88e5'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#2196F3'}
                            >
                                Join Room
                            </button>
                        </div>
                    </div>
                )} */}

                <div style={{
                    background: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Map Options</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <button
                            onClick={() => setCurrentTile({
                                name: "OpenStreetMap",
                                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                attribution: '© OpenStreetMap contributors'
                            })}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: currentTile.name === "OpenStreetMap" ? '#4CAF50' : '#f1f1f1',
                                color: currentTile.name === "OpenStreetMap" ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Street
                        </button>
                        <button
                            onClick={() => setCurrentTile({
                                name: "Satellite",
                                url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            })}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: currentTile.name === "Satellite" ? '#4CAF50' : '#f1f1f1',
                                color: currentTile.name === "Satellite" ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Satellite
                        </button>
                        <button
                            onClick={() => setCurrentTile({
                                name: "Train",
                                url: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
                                attribution: 'Map data: © OpenStreetMap contributors | Map style: © OpenRailwayMap'
                            })}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: currentTile.name === "Train" ? '#4CAF50' : '#f1f1f1',
                                color: currentTile.name === "Train" ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Train
                        </button>
                    </div>
                </div>
            </div>
            {/* <div style={{ textAlign: 'center', color: '#9e9e9e', fontSize: '14px', padding: '10px 0' }}>
                <br></br> <p>© {new Date().getFullYear()} LiveTrack. All rights reserved. </p>
            </div> */}
        </div>
    )
}

export default MapLocation;