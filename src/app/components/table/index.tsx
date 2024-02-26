"use client";
import React, { useMemo, useState } from "react";
import { useBoundStore } from "@/app/store/rootStore";
import LoadingAnimation from "../loader";

const Table: React.FC = () => {
  const { data, state } = useBoundStore((state) => state);
  const [visibleRows, setVisibleRows] = useState<number>(15);

  const loading = useMemo(
    () => (
      <div className="flex justify-center items-center h-full">
        <LoadingAnimation />
      </div>
    ),
    []
  );

  const noData = useMemo(
    () => (
      <div className="flex justify-center items-center h-full">
        <span className="text-3xl text-gray-400 font-semibold">
          No data to display
        </span>
      </div>
    ),
    []
  );

  const table = useMemo(
    () => (
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {data.at(0)?.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(1, visibleRows + 1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    [data, visibleRows]
  );

  const content = useMemo(() => {
    switch (state) {
      case "loading":
        return loading;
      case "error":
      case "success":
        return data.length === 0 ? noData : table;
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, data, visibleRows]);

  const loadMore = () => {
    setVisibleRows((prev) => Math.min(prev + 15, data.length));
  };

  const allDataRendered = visibleRows >= data.length;

  return (
    <div>
      <div className="overflow-scroll h-96 rounded-md border-2 border-gray-200 bg-white">
        {content}
      </div>
      <button
        disabled={allDataRendered}
        onClick={loadMore}
        className={`${
          allDataRendered ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
        } text-white px-2 py-1 rounded-md mt-3 text-sm`}
      >
        Load More
      </button>
    </div>
  );
};

export default Table;