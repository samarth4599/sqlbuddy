import React, { useState, useCallback, useMemo } from "react";
import { toast, Zoom } from "react-toastify";
import { sql } from "@codemirror/lang-sql";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import CodeMirror from "@uiw/react-codemirror";
import { useBoundStore } from "@/app/store/rootStore";
import { onExecute } from "@/app/utilities/helpers";
import { csvArray } from "@/app/constants/constants";
import "react-toastify/dist/ReactToastify.css";

const SqlEditor: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const { setData, setState, setHistory, theme } = useBoundStore(
    (state) => state
  );

  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  const onReset = useCallback(() => {
    setValue("");
  }, []);

  const onTableClick = useCallback(() => {
    toast(`Available tables are: ${csvArray.join(", ")}`, {
      position: "top-center",
      type: "info",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
    });
  }, []);

  return (
    <div className="flex flex-grow md:flex-grow-0 flex-col">
      <CodeMirror
        placeholder={"Write your SQL here"}
        theme={theme === "dark" ? dracula : quietlight}
        height="200px"
        autoFocus={true}
        autoCorrect="true"
        extensions={[sql()]}
        onChange={onChange}
        value={value}
      />
      <div className="flex gap-3 mt-2">
        <button
          onClick={onReset}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Reset
        </button>
        <button
          onClick={() => onExecute(value, setData, setState, setHistory)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Execute
        </button>
        <button
          onClick={onTableClick}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Available Tables
        </button>
      </div>
    </div>
  );
};

export default SqlEditor;
