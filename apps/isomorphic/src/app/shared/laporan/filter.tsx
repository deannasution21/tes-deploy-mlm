import { DatePicker } from '@core/ui/datepicker';
import DropdownAction, { optionsTimeframe } from '../dropdown-action';
import DateFiled from '@core/components/controlled-table/date-field';

export default function ReportFilter({
  handleFilterChange,
  type,
  startDate,
  setStartDate,
  custom,
  setCustom,
}: {
  handleFilterChange: (typenya: string) => void;
  type: string;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  custom: [Date | null, Date | null];
  setCustom: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}) {
  return (
    <div className="flex w-full max-w-lg flex-wrap gap-4">
      <DropdownAction
        className="w-full rounded-md border 3xl:w-auto"
        options={optionsTimeframe}
        onChange={handleFilterChange}
        value={type} // Pass current value
      />
      {type === 'monthly' && (
        <div className="w-full 3xl:w-auto">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="MMM, yyyy"
            placeholderText="Pilih bulan"
            showMonthYearPicker
            popperPlacement="bottom-end"
            inputProps={{
              variant: 'text',
              inputClassName: 'h-[38px] [&_input]:text-ellipsis',
            }}
            className="rounded-md border"
          />
        </div>
      )}
      {type === 'custom' && (
        <div className="w-full 3xl:w-auto">
          <DateFiled
            selected={custom[0]}
            startDate={custom[0]!}
            endDate={custom[1]!}
            onChange={(date) => setCustom(date)}
            selectsRange
            dateFormat="dd MMM yyyy"
            placeholderText="Pilih rentang tanggal"
            maxDate={new Date()}
            className=""
          />
        </div>
      )}
    </div>
  );
}
