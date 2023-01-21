import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const Countdown = () => {
  const [daysLeft, setDaysLeft] = useState(null);
  const [hoursLeft, setHoursLeft] = useState(null);
  const [minLeft, setMinLeft] = useState(null);
  const [secLeft, setSecLeft] = useState(null);

  const getTimer = () => {
    const cstTime = dayjs().tz("America/Chicago");
    const currentDay = cstTime.day();
    const currentHour = cstTime.hour();
    const currentWeekThursday = cstTime
      .startOf("week")
      .day(4)
      .hour(21)
      .minute(0)
      .second(0)
      .millisecond(0);
    let toThursday = currentWeekThursday;
    if (currentDay > 4 || (currentDay === 4 && currentHour > 21)) {
      toThursday = currentWeekThursday
        .add(7, "day")
        .startOf("week")
        .add(4, "day")
        .hour(21)
        .minute(0)
        .second(0)
        .millisecond(0);
    }
    let remainingTime = toThursday.diff(cstTime, "seconds");
    const intervalId = setInterval(() => {
      setDaysLeft(Math.floor(remainingTime / 86400));
      setHoursLeft(Math.floor((remainingTime % 86400) / 3600));
      setMinLeft(Math.floor(((remainingTime % 86400) % 3600) / 60));
      setSecLeft(Math.floor(((remainingTime % 86400) % 3600) % 60));
      remainingTime--;
      if (remainingTime < 0) {
        clearInterval(intervalId);
        getTimer();
      }
    }, 1000);
  };

  useEffect(() => {
    getTimer();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-[1rem] my-[1rem] md:my-0 transition-all duration-500">
      <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center leading-loose">
        Time Remaining in Debug Cycle
      </h2>

      <div className="flex justify-center gap-[.8rem] font-vcr min-h-[80px]">
        {daysLeft && (
          <>
            <div className="flex flex-col items-center gap-[.5rem]">
              <h2 className="text-[2rem] lg:text-[2.5rem]">{daysLeft}</h2>
              <h4 className="text-[1.25rem] lg:text-[1.5rem]">Days</h4>
            </div>
            <div className="flex flex-col items-center gap-[.5rem]">
              <h2 className="text-[2rem] lg:text-[2.5rem]">{hoursLeft}</h2>
              <h4 className="text-[1.25rem] lg:text-[1.5rem]">Hours</h4>
            </div>
            <div className="flex flex-col items-center gap-[.5rem]">
              <h2 className="text-[2rem] lg:text-[2.5rem]">{minLeft}</h2>
              <h4 className="text-[1.25rem] lg:text-[1.5rem]">Minutes</h4>
            </div>
            <div className="flex flex-col items-center gap-[.5rem]">
              <h2 className="text-[2rem] lg:text-[2.5rem]">{secLeft}</h2>
              <h4 className="text-[1.25rem] lg:text-[1.5rem]">Seconds</h4>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Countdown;
