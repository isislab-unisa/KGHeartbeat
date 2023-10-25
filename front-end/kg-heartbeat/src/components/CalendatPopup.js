import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CalendarPopup ({selectableDates, onDateSelect, defaultDate}) {
    const [selectedDate, setSelectedDate] = useState(defaultDate || null);
    /* Example of accepted format 
    let data = parseISO('2023-10-10',1)
    */
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        onDateSelect(date);
    }

    return(
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateSelect}
                dateFormat="yyyy-MM-dd"
                includeDates={selectableDates}
                popperModifiers={{
                    preventOverflow: {
                        enabled: true
                    }
                }}
            />
        </div>
    )
}

export default CalendarPopup;