import React from "react";

export const TicketsPage: React.FC = () => {
  return (
    <section className="page is-active" aria-labelledby="ticketsTitle">

      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">Parking management</p>

          <h1 id="ticketsTitle">Tickets</h1>

          <p>
            View and manage parking tickets issued across campus.
          </p>
        </div>

        <button className="button primary" type="button">
          Issue ticket
        </button>
      </div>

      {/* TICKET CARDS */}
      <div className="project-grid">

        {/* TICKET 1 */}
        <article
          className="project-card searchable"
          data-search="parking ticket A01 student unpaid"
        >
          <div className="project-card-top">
            <span className="project-icon violet">
              <i
                className="fa-solid fa-ticket"
                aria-hidden="true"
              ></i>
            </span>

            <button type="button" aria-label="More options">
              <i
                className="fa-solid fa-ellipsis"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <span className="status pending">
            Unpaid
          </span>

          <h2>Parking Bay A01</h2>

          <p>
            Vehicle parked in a restricted parking bay.
          </p>

          <div className="project-meta">
            <span>
              <small>Ticket ID</small>
              <strong>#PT-1048</strong>
            </span>

            <span>
              <small>Issued</small>
              <strong>10:42 AM</strong>
            </span>
          </div>

          <div className="project-footer">
            <div className="avatar-stack">
              <i>SG</i>
            </div>

            <strong>R500</strong>
          </div>

          <div className="progress-track">
            <span style={{ width: "35%" }}></span>
          </div>
        </article>


        {/* TICKET 2 */}
        <article
          className="project-card searchable"
          data-search="parking ticket B14 lecturer paid"
        >
          <div className="project-card-top">
            <span className="project-icon blue">
              <i
                className="fa-solid fa-ticket"
                aria-hidden="true"
              ></i>
            </span>

            <button type="button" aria-label="More options">
              <i
                className="fa-solid fa-ellipsis"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <span className="status success">
            Paid
          </span>

          <h2>Parking Bay B14</h2>

          <p>
            Parking violation resolved and payment received.
          </p>

          <div className="project-meta">
            <span>
              <small>Ticket ID</small>
              <strong>#PT-1047</strong>
            </span>

            <span>
              <small>Issued</small>
              <strong>09:15 AM</strong>
            </span>
          </div>

          <div className="project-footer">
            <div className="avatar-stack">
              <i>SG</i>
            </div>

            <strong>R300</strong>
          </div>

          <div className="progress-track">
            <span style={{ width: "100%" }}></span>
          </div>
        </article>


        {/* TICKET 3 */}
        <article
          className="project-card searchable"
          data-search="parking ticket C07 student review"
        >
          <div className="project-card-top">
            <span className="project-icon green">
              <i
                className="fa-solid fa-ticket"
                aria-hidden="true"
              ></i>
            </span>

            <button type="button" aria-label="More options">
              <i
                className="fa-solid fa-ellipsis"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <span className="status review">
            Under review
          </span>

          <h2>Parking Bay C07</h2>

          <p>
            Ticket has been disputed and is awaiting review.
          </p>

          <div className="project-meta">
            <span>
              <small>Ticket ID</small>
              <strong>#PT-1046</strong>
            </span>

            <span>
              <small>Issued</small>
              <strong>08:32 AM</strong>
            </span>
          </div>

          <div className="project-footer">
            <div className="avatar-stack">
              <i>SG</i>
            </div>

            <strong>R500</strong>
          </div>

          <div className="progress-track">
            <span style={{ width: "60%" }}></span>
          </div>
        </article>


        {/* TICKET 4 */}
        <article
          className="project-card searchable"
          data-search="parking ticket D22 visitor unpaid"
        >
          <div className="project-card-top">
            <span className="project-icon orange">
              <i
                className="fa-solid fa-ticket"
                aria-hidden="true"
              ></i>
            </span>

            <button type="button" aria-label="More options">
              <i
                className="fa-solid fa-ellipsis"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <span className="status pending">
            Unpaid
          </span>

          <h2>Parking Bay D22</h2>

          <p>
            Vehicle exceeded the permitted parking time.
          </p>

          <div className="project-meta">
            <span>
              <small>Ticket ID</small>
              <strong>#PT-1045</strong>
            </span>

            <span>
              <small>Issued</small>
              <strong>Yesterday</strong>
            </span>
          </div>

          <div className="project-footer">
            <div className="avatar-stack">
              <i>SG</i>
            </div>

            <strong>R400</strong>
          </div>

          <div className="progress-track">
            <span style={{ width: "20%" }}></span>
          </div>
        </article>

      </div>
    </section>
  );
};

export default TicketsPage;