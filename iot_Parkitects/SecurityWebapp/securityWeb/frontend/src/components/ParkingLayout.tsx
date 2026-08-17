import ParkingBay from "../components/ParkingBay";

type ParkingLayoutProps = {
  onBayClick: (id: string) => void
}
export default function ParkingLayout({onBayClick}: ParkingLayoutProps) {
  return (
    <div className="parking-layout">

      <div className="parking-map">

        {/* Left parking row */}
        <div className="parking-column">
          <ParkingBay id="A-01" occupied onClick={onBayClick} />
          <ParkingBay id="A-02" onClick={onBayClick} />
          <ParkingBay id="A-03" occupied onClick={onBayClick} />
          <ParkingBay id="A-04" onClick={onBayClick}/>
          <ParkingBay id="A-05" onClick={onBayClick}/>
        </div>

        {/* Road / aisle */}
        <div className="parking-road">

          <span className="road-text">
            AISLE
          </span>

          <span className="entry">
            ENTRY
          </span>

        </div>

        {/* Right parking row */}
        <div className="parking-column">
          <ParkingBay id="A-06" onClick={onBayClick}/>
          <ParkingBay id="A-07" occupied onClick={onBayClick}/>
          <ParkingBay id="A-08" onClick={onBayClick}/>
          <ParkingBay id="A-09" occupied onClick={onBayClick}/>
          <ParkingBay id="A-10" onClick={onBayClick}/>
        </div>

      </div>

    </div>
  );
}
{/*
  References
 Yilmaz.2018. car park. (Version 2.0) [Source code] Available at: <https://codepen.io/tenkyu/pen/zaJwaR> [Accessed 17 Aug. 2026].
  */}