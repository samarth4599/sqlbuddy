import { readString } from "react-papaparse";
import {
  IHeaderObject,
  TScreenState,
  TTableData,
} from "../constants/interfaces";
import { csvArray, csvLink } from "../constants/constants";
import { callApi } from "./api";
import { Bounce, toast } from "react-toastify";

// Function to convert CSV data to table data
export const csvConverter = (
  data: any,
  setData: (data: TTableData) => void
) => {
  // Decode the content of the CSV data
  const encodedData = data.content.replace("\n", "");
  const stringData = atob(encodedData);

  // Parse the decoded string as CSV using react-papaparse library
  readString(stringData, {
    worker: true,
    complete: (results: any) => setData(results.data),
  });
};

// Function to find a matching table name from the query
export const findCSVTable = (query: string): string | null => {
  // Convert the query to lowercase for case-insensitive matching
  const lowerCaseQuery = query.toLowerCase();

  // Find the first table name from csvArray present in the query
  const tableName = csvArray.find((tableName) =>
    lowerCaseQuery.includes(tableName.toLowerCase())
  );

  // Return the matching table name or null if not found
  return tableName ?? null;
};

// Function to execute the CSV retrieval and conversion process
export const onExecute = async (
  value: string,
  setData: (data: TTableData) => void,
  setState: (state: TScreenState) => void,
  setHistory: (text: string) => void
) => {
  try {
    // Find the matching table name from the query
    const table = findCSVTable(value);

    if (table) {
      // If a valid table name is found, set the state to "loading"
      setState("loading");

      // Call the API to retrieve the CSV data
      const getCSV = await callApi(csvLink(table));

      // Convert the retrieved CSV data to table data
      csvConverter(getCSV, setData);

      // Update the history with the executed query
      setHistory(value);

      // Set the state to "success"
      setState("success");
    } else {
      // If no valid table name is found, throw an error
      throw new Error("Invalid Table Name");
    }
  } catch (e: any) {
    // Catch any errors that occur during the process and display an error toast
    toast(e.message ?? "Something went wrong", {
      position: "top-right",
      type: "error",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

    // Set the state to "error" and clear the table data
    setState("error");
    setData([]);
  }
};

export const convertToHeaders = (data: TTableData): IHeaderObject[] => {
  if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
    return []; // Return an empty array if the input data is invalid
  }

  // Extract the headers from the first row of data
  const headers: string[] = data[0];

  // Map the headers array to the desired format
  const formattedHeaders: IHeaderObject[] = headers.map((header) => ({
    id: header,
    displayName: header,
  }));

  return formattedHeaders;
};

export const convertToRows = (data: TTableData): Record<string, string>[] => {
  if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[0])) {
    return []; // Return an empty array if the input data is invalid
  }

  // Extract the headers from the first row of data
  const headers: string[] = data[0];

  // Convert the rest of the rows into objects
  const formattedData: Record<string, string>[] = data.slice(1).map((row) =>
    row.reduce((acc, cell, index) => {
      acc[headers[index]] = cell;
      return acc;
    }, {} as Record<string, string>)
  );

  return formattedData;
};
