import dayjs, { Dayjs } from "dayjs";

// use this function to format a date object or string to a specific format
export const formatDate = (
  date?: string | Dayjs | Date | null,
  format: string | undefined = "DD/MM/YYYY",
) => {
  return date ? dayjs(date).format(format) : null;
};

// use this function to convert a string date to a dayjs object. use case for default value for form DatePicker
export const formatStringToDate = (str?: string | null) => {
  return str ? dayjs(str) : null;
};
