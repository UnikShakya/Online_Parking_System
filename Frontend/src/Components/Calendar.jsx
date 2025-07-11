import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; 


const Calendar = () => {
  const [startDate, setStartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [returnTime, setReturnTime] = useState(null); 

  const customFormat = (date) => {
    if (!date) return '';
    return date.format('DD/MM/YYYY'); 
  };

  return (
    <div className="max-w-4xl mx-auto my-20 border rounded-lg shadow-md">
      <div className="flex justify-between items-center border-b">
        <div className="flex-1 p-4 border-r-2">
          <input
            type="text"
            placeholder="Start Locations"
            className="w-full p-2  rounded text-gray-600 bg-[#f0f0f0] focus:outline-none "
          />
        </div>
        <div className="flex-1 p-4">
        <div className="flex-1 p-4 border-r-2">
          <input
            type="text"
            placeholder="End Locations"
            className="w-full p-2  rounded text-gray-600 bg-[#f0f0f0] focus:outline-none "
          />
        </div>
        </div>
        <div className="flex-1 p-4">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <DatePicker
              label="Start Date"
              value={returnDate}
              onChange={(newValue) => setReturnDate(newValue)}
              minDate={startDate || dayjs()}
              renderInput={(params) => <input {...params} />}
              slotProps={{
                textField: {
                  variant: 'standard',
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.375rem',
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                    },
                  },
                },
                openPickerButton: {
                  sx: {
                    color: '#6b7280', 
                  },
                },
              }}
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
        </div>

        <div className="flex-1 p-4">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <TimePicker
            label= "Start Time"
              value={returnTime}
              onChange={(newValue) => setReturnTime(newValue)}
              minutesStep={1} 
              slotProps={{
                textField: {
                  variant: 'standard',
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.375rem',
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280', 
                    },
                  },
                },
                openPickerButton: {
                  sx: {
                    color: '#6b7280', 
                  },
                },
              }}
              format="HH:mm A" 
            />
          </LocalizationProvider>
        </div>
        
      </div>
    </div>
  );
};

export default Calendar;