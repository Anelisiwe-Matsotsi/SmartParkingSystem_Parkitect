//(rudderz243,2026)
import React, { useState, useEffect} from "react";
import ParkingLayout from "../components/ParkingLayout.tsx";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { getTickets, getParkingMap, getBayDetails } from "../services/api";
import type { ParkingMap, BayDetails } from "../services/api";
import { findBay, normalizeBay } from "../services/parking";


//(paul2009, 2021)
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};


const toDate = (iso: string) =>
  new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`);

export const BookPage: React.FC = () => {
 
  const [selectedBay, setSelectedBay] = useState<string | null>(null);
  const [ticketsToday, setTicketsToday] = useState(0);
  const [userName, setUserName] = useState("");
  const [mapData, setMapData] = useState<ParkingMap | null>(null);
  const [mapError, setMapError] = useState(false);
  const [bayDetails, setBayDetails] = useState<BayDetails | null>(null);
  const navigate = useNavigate();

  // logged in user's name for the greeting
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (u) => setUserName(u?.displayName?.split(" ")[0] || ""),
      (err) => {
        console.error("Auth state error:", err);
        setUserName("");
      }
    );
    return unsubscribe;
  }, []);

  // tickets reported today
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const tickets = await getTickets();
        const today = new Date().toDateString();
        const count = tickets.filter(
          (t) => toDate(t.createdAt).toDateString() === today
        ).length;
        if (active) setTicketsToday(count);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // live parking map data (same endpoint the mobile app polls every 4 seconds)
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await getParkingMap();
        if (active) {
          setMapData(data);
          setMapError(false);
        }
      } catch (err) {
        console.error("Failed to load parking map:", err);
        if (active) setMapError(true);
      }
    };
    load();
    const id = setInterval(load, 4000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // details and current occupant for the selected bay, kept live while it is selected
  useEffect(() => {
    setBayDetails(null);
    if (!selectedBay) return;

    let active = true;
    const load = async () => {
      try {
        const details = await getBayDetails(normalizeBay(selectedBay));
        if (active) setBayDetails(details);
      } catch (err) {
        console.error("Failed to load bay details:", err);
      }
    };
    load();
    const id = setInterval(load, 4000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [selectedBay]);

  // live numbers for the panels below the map
  const totalBays = mapData?.totalBays ?? 0;
  const occupiedBays = mapData?.occupiedBays ?? 0;
  const availableBays = mapData?.availableBays ?? 0;
  const occupiedPct = totalBays ? Math.round((occupiedBays / totalBays) * 100) : 0;
  const availablePct = totalBays ? 100 - occupiedPct : 0;
  const sensorCount =
    mapData?.sections?.reduce(
      (n, s) => n + (s.bays?.filter((b) => b.hasPhysicalSensor).length ?? 0),
      0
    ) ?? 0;

  // bay details from the server when available, otherwise whatever the live map says
  const bayInfo = bayDetails ?? (selectedBay ? findBay(mapData, selectedBay) : null);
  const parkedSinceLabel = bayDetails?.parkedSince
    ? toDate(bayDetails.parkedSince).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
    : "";

  // where return starts = the actual HTML/display area
  return (

  //(realCain,2024)
    <section
      className="page is-active"
      data-page-panel="dashboard"
      aria-labelledby="dashboardTitle"
    >

      {/* PAGE HEADING */}
      <div className="page-heading">

        <div>

          <p className="eyebrow">
            Campus parking
          </p>

          <h1 id="dashboardTitle">
            {greeting()}{userName ? `, ${userName}` : ""}
          </h1>

          <p>
            Here's a clear look at what's happening across campus parking.
          </p>

        </div>

        <div className="heading-actions">

          <button
            className="button secondary"
            type="button"
            onClick={() => navigate("/tickets")}
          >
            View tickets
          </button>

          <button
            className="button primary"
            type="button"
          >
            Parking map
          </button>

        </div>

      </div>


      {/* STAT CARDS */}
      <div className="stat-list">

        <article
          className="stat-card searchable"
          data-search="parking bays total spaces"
        >

          <div className="stat-top">

            <span className="stat-icon violet">
              <i
                className="fa-solid fa-square-parking"
                aria-hidden="true"
              ></i>
            </span>

          </div>

          <p>Total parking bays</p>

          <strong className="stat-value">
            {mapData ? totalBays : "-"}
          </strong>

          <small>
            Campus parking capacity
          </small>

        </article>


        <article
          className="stat-card searchable"
          data-search="occupied parking spaces"
        >

          <div className="stat-top">

            <span className="stat-icon blue">
              <i
                className="fa-solid fa-car"
                aria-hidden="true"
              ></i>
            </span>

          </div>

          <p>Currently occupied</p>

          <strong className="stat-value">
            {mapData ? occupiedBays : "-"}
          </strong>

          <small>
            Live occupancy
          </small>

        </article>


        <article
          className="stat-card searchable"
          data-search="available parking spaces"
        >

          <div className="stat-top">

            <span className="stat-icon green">
              <i
                className="fa-solid fa-circle-check"
                aria-hidden="true"
              ></i>
            </span>

          </div>

          <p>Available spaces</p>

          <strong className="stat-value">
            {mapData ? availableBays : "-"}
          </strong>

          <small>
            Spaces currently available
          </small>

        </article>


        <article
          className="stat-card searchable"
          data-search="tickets parking complaints"
        >

          <div className="stat-top">

            <span className="stat-icon orange">
              <i
                className="fa-solid fa-ticket"
                aria-hidden="true"
              ></i>
            </span>

          </div>

          <p>Tickets today</p>

          <strong className="stat-value">
            {ticketsToday}
          </strong>

          <small>
            Parking issues reported today
          </small>

        </article>

      </div>


      {/* map-row: the map now has the whole row to itself */}
      <div className="dashboard-row map-row">

        {/* MAP */}
        <article
          className="panel performance-panel searchable"
          data-search="parking map campus parking bays"
        >

          <div className="panel-heading">

            <div>

              <p className="panel-kicker">
                Live updates
              </p>

              <h2>
                Parking map
              </h2>

            </div>

            <div className="range-control">
              <button
                type="button"
                className="is-active"
              >
                Live
              </button>
            </div>

          </div>


          <div className="chart-summary">

            <strong>
              Campus parking
            </strong>

            <span>
              <i></i>
              {mapError ? "Live data unavailable, retrying" : "Live availability"}
            </span>

          </div>



          <div
            className="chart-box"
            style={{ height: "auto" }}
          >

            {/*  <img
                  src={parkingMap}
                  alt="Campus parking map"
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "contain",
                  }}
                /> */}
            <ParkingLayout
              mapData={mapData}
              onBayClick={(bayId) => setSelectedBay(bayId)}
            />

          </div>

        </article>

      </div>

      <div className="dashboard-row lower-row">

        {/* PARKING BAY */}
        <article
          className="panel activity-panel searchable"
          data-search="parking bay selected bay information"
        >

          <div className="panel-heading">

            <div>

              <p className="panel-kicker">
                Parking selection
              </p>

              <h2>
                Parking bay
              </h2>

            </div>

            <button
              className="text-button"
              type="button"
              onClick={() => setSelectedBay(null)}
            >
              Clear
            </button>

          </div>


          <div className="table-wrap">

            {selectedBay ? (

              <div>

                <p>
                  Selected parking bay
                </p>

                <h2>
                  {selectedBay}
                </h2>

                {bayInfo ? (

                  <>

                    <p>
                      <span
                        className={`status ${bayInfo.isOccupied ? "pending" : "success"}`}
                      >
                        {bayInfo.isOccupied ? "Occupied" : "Available"}

                      </span>
                    </p>

                    <p>
                      <span className="status review">
                        {bayInfo.hasPhysicalSensor
                          ? "Physical sensor linked"
                          : "No physical sensor"}

                      </span>
                    </p>

                    {bayInfo.hasPhysicalSensor &&
                      bayInfo.distanceReadingCm != null && (

                      <p>
                        <span className="status review">
                          Sensor reading: {bayInfo.distanceReadingCm} cm

                        </span>
                      </p>

                    )}

                    {bayInfo.isOccupied && bayDetails && (

                      <>

                        <p>
                          <span className="status pending">
                            {bayDetails.occupantName
                              ? `Occupied by: ${bayDetails.occupantName}${
                                  bayDetails.occupantNumber ? ` (${bayDetails.occupantNumber})` : ""
                                }`
                              : "Occupied by: no registered driver"}

                          </span>
                        </p>

                        {parkedSinceLabel && (

                          <p>
                            <span className="status pending">
                              Since: {parkedSinceLabel}

                            </span>
                          </p>

                        )}

                      </>

                    )}

                  </>

                ) : (

                  <span className="status pending">
                    No live data for this bay

                  </span>

                )}

              </div>

            ) : (

              <div>

                <p>
                  Select a parking bay on the map to view its information.
                </p>

                <span className="status pending">
                  No bay selected
                </span>

              </div>

            )}

          </div>

        </article>
        {/* LIVE PARKING ACTIVITY */}
        <article
          className="panel team-panel searchable"
          data-search="parking activity live updates"
        >

          <div className="panel-heading">

            <div>

              <p className="panel-kicker">
                Live updates
              </p>

              <h2>
                Parking activity
              </h2>

            </div>

            <span className="team-score">
              Live
            </span>

          </div>


          <div className="goal-list">

            <div>

              <span>

                <strong>
                  Available spaces
                </strong>

                <small>
                  {availableBays} of {totalBays} spaces available
                </small>

              </span>

              <span className="goal-bar">
                <i style={{ width: `${availablePct}%` }}></i>
              </span>

            </div>


            <div>

              <span>

                <strong>
                  Occupied spaces
                </strong>

                <small>
                  {occupiedBays} of {totalBays} spaces occupied
                </small>

              </span>

              <span className="goal-bar">
                <i style={{ width: `${occupiedPct}%` }}></i>
              </span>

            </div>


            <div>

              <span>

                <strong>
                  Parking status
                </strong>

                <small>
                  {mapError
                    ? "Live data unavailable"
                    : `${sensorCount} sensors linked`}
                </small>

              </span>

              <span className="goal-bar">
                <i style={{ width: mapError ? "0%" : "100%" }}></i>
              </span>

            </div>

          </div>


          <button
            className="button soft full-button"
            type="button"
          >
            View parking system details
          </button>

        </article>


        {/* PARKING OVERVIEW */}
        <article
          className="panel conversion-panel searchable"
          data-search="parking overview availability occupancy"
        >

          <div className="panel-heading">

            <div>

              <p className="panel-kicker">
                Availability
              </p>

              <h2>
                Parking overview
              </h2>

            </div>

          </div>


          <div className="donut-wrap">

            <div
              className="donut"
              role="img"
              aria-label={`${occupiedPct} percent of parking bays occupied`}
              style={{
                background: totalBays
                  ? `conic-gradient(var(--blue) 0 ${occupiedPct}%, var(--green) ${occupiedPct}% 100%)`
                  : "var(--line)",
              }}
            >

              <span>

                <strong>
                  {occupiedPct}%
                </strong>

                <small>
                  Occupied
                </small>

              </span>

            </div>

          </div>


          <ul className="channel-list">

            <li>
              <span>
                <i className="violet-dot"></i>
                Total bays
              </span>

              <strong>
                {totalBays}
              </strong>
            </li>

            <li>
              <span>
                <i className="blue-dot"></i>
                Occupied
              </span>

              <strong>
                {occupiedBays}
              </strong>
            </li>

            <li>
              <span>
                <i className="green-dot"></i>
                Available
              </span>

              <strong>
                {availableBays}
              </strong>
            </li>

          </ul>

        </article>

      </div>

    </section>


  );
};

{/*References
paul2009. 2021. Time-based headings. (Version 2.0) [Source code] Available at:<https://forum.squarespace.com/topic/207309-time-based-headings/> [Accessed 3 October 2026].
realCAiN. 2024. Updated* Dashboard for sales, ect / Admin Dashboard. (Version 2.0) [Source code] Available at: < https://codepen.io/realCaiN/pen/yLdEzwv > [Accessed 16 Aug. 2026]. 
rudderz243.2026. rudderz243/insy7314-library.  (Version 2.0) [Source code]. Available at: <https://github.com/rudderz243/insy7314-library> [Accessed 17 Aug. 2026].
           */}