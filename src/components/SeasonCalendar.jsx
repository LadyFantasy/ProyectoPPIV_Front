import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/PriceMultiplier.css";

function SeasonCalendar({ rates }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getMultiplierColor = multiplier => {
    if (multiplier > 2) return "#ff4444";
    if (multiplier >= 1) {
      const ratio = multiplier - 1;
      return `rgb(${102 + 153 * ratio}, ${187 + 68 * ratio}, ${106 - 106 * ratio})`;
    }
    const ratio = multiplier;
    return `rgb(${144 + 111 * ratio}, ${238 + 17 * ratio}, ${144 + 111 * ratio})`;
  };

  const renderDayContents = (day, date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const rate = rates.find(rate => {
      if (!rate.since || !rate.until) return false;
      const start = new Date(rate.since);
      const end = new Date(rate.until);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return normalizedDate >= start && normalizedDate <= end;
    });

    const color = rate ? getMultiplierColor(rate.multiplier) : null;
    return (
      <div
        className={`price-multiplier__day-content ${color ? "has-color" : ""}`}
        style={color ? { backgroundColor: color } : {}}>
        {day}
      </div>
    );
  };

  return (
    <div className="price-multiplier__calendar-container">
      <h2>Calendario de Temporadas</h2>
      <div className="price-multiplier__calendar">
        <div className="price-multiplier__calendar-grid">
          <div className="price-multiplier__calendar-month">
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              inline
              renderDayContents={renderDayContents}
              readOnly
            />
          </div>
        </div>
        <div className="price-multiplier__legend">
          <div className="price-multiplier__legend-item">
            <div className="price-multiplier__legend-color price-multiplier__legend-color--green" />
            <span>Multiplicador 0x - 1x</span>
          </div>
          <div className="price-multiplier__legend-item">
            <div className="price-multiplier__legend-color price-multiplier__legend-color--yellow" />
            <span>Multiplicador 1x - 2x</span>
          </div>
          <div className="price-multiplier__legend-item">
            <div className="price-multiplier__legend-color price-multiplier__legend-color--red" />
            <span>Multiplicador 2x o más</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonCalendar;
